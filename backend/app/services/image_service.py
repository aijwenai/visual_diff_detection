# image_service.py
import os
import io
import uuid
import json
from typing import Any, Dict, List, Tuple

import numpy as np
from PIL import Image
from fastapi import UploadFile
import pixelmatch


class ImageComparisonService:
    """
    Compare two images with optional ignore regions, produce a diff image and stats.
    - Saves uploads as PNG
    - Supports RGBA only (will auto-convert)
    - Ignore regions are rectangles in pixel coordinates:
      {"before":[{x,y,width,height},...], "after":[...]}  # both lists are merged
    """

    def __init__(self, upload_dir: str = "static/uploads", generated_dir: str = "static/generated") -> None:
        self.upload_dir = upload_dir
        self.generated_dir = generated_dir
        os.makedirs(upload_dir, exist_ok=True)
        os.makedirs(generated_dir, exist_ok=True)

    # --------------------------- helpers ---------------------------

    @staticmethod
    def _ensure_rgba(img: Image.Image) -> Image.Image:
        """Convert any mode to RGBA."""
        if img.mode != "RGBA":
            img = img.convert("RGBA")
        return img

    @staticmethod
    def _parse_regions(ignore_regions: str) -> Tuple[List[Dict[str, int]], List[Dict[str, int]]]:
        """Parse JSON string to two lists; fail-safe to [] []."""
        try:
            data = json.loads(ignore_regions or "{}")
            return data.get("before", []) or [], data.get("after", []) or []
        except (json.JSONDecodeError, TypeError):
            return [], []

    async def _save_image(self, file: UploadFile, filename: str) -> str:
        """
        Read UploadFile and store as PNG (RGBA). Returns absolute path.
        Notes:
        - `bytes` -> `io.BytesIO` is the correct way; type checkers sometimes warn.
        """
        contents: bytes = bytes(await file.read())
        img = Image.open(io.BytesIO(contents))
        img = self._ensure_rgba(img)

        filepath = os.path.join(self.upload_dir, f"{filename}.png")
        img.save(filepath, format="PNG")
        return filepath

    # --------------------------- main API ---------------------------

    async def compare_images(
        self,
        before_file: UploadFile,
        after_file: UploadFile,
        threshold: float,
        ignore_regions: str = "{}",
    ) -> Dict[str, Any]:
        """
        Returns:
            {
              id, before_image, after_image, diff_image,
              diff_percentage, diff_pixels, total_pixels,
              threshold, ignored_regions_count
            }
        """
        # clamp threshold to [0, 1]
        if not (0.0 <= float(threshold) <= 1.0):
            threshold = max(0.0, min(1.0, float(threshold)))

        comparison_id = str(uuid.uuid4())
        before_regions, after_regions = self._parse_regions(ignore_regions)

        # Save uploads to disk (and re-open to make sure formats are normalized)
        before_path = await self._save_image(before_file, f"{comparison_id}_before")
        after_path = await self._save_image(after_file, f"{comparison_id}_after")

        before_img = self._ensure_rgba(Image.open(before_path))
        after_img = self._ensure_rgba(Image.open(after_path))

        # Resize "after" to match "before" if different
        if before_img.size != after_img.size:
            after_img = after_img.resize(before_img.size)

        width, height = before_img.size

        # numpy arrays as H×W×4 uint8
        before_np = np.asarray(before_img, dtype=np.uint8)
        after_np = np.asarray(after_img, dtype=np.uint8)
        # ---- build ignore mask (H×W bool) ----
        ignore_mask = np.zeros((height, width), dtype=bool)
        for region in (before_regions or []) + (after_regions or []):
            x = int(region.get("x", 0))
            y = int(region.get("y", 0))
            w = int(region.get("width", 0))
            h = int(region.get("height", 0))
            if w <= 0 or h <= 0:
                continue
            x0 = max(0, x)
            y0 = max(0, y)
            x1 = min(x + w, width)
            y1 = min(y + h, height)
            if x0 < x1 and y0 < y1:
                ignore_mask[y0:y1, x0:x1] = True

        # ---- apply ignore mask by painting neutral gray ----
        if np.any(ignore_mask):
            neutral = np.array([127, 127, 127, 255], dtype=np.uint8)
            before_masked = np.where(ignore_mask[:, :, None], neutral, before_np)
            after_masked = np.where(ignore_mask[:, :, None], neutral, after_np)
        else:
            before_masked = before_np
            after_masked = after_np

        # ---- pixelmatch ----
        # output must be a mutable numpy array
        diff_buffer = bytearray(height*width*4)

        # pixelmatch accepts numpy arrays (H×W×4) for imgA/imgB and a buffer for output
        diff_count = pixelmatch.pixelmatch(
            before_masked.tobytes(),
            after_masked.tobytes(),
            width,
            height,
            output=diff_buffer,
            threshold=threshold,
            includeAA=True,
        )

        # ---- save diff image ----
        diff_data = np.frombuffer(diff_buffer, dtype=np.uint8).reshape((height, width, 4))
        diff_img = Image.fromarray(diff_data, mode="RGBA")
        diff_path = os.path.join(self.generated_dir, f"{comparison_id}_diff.png")
        diff_img.save(diff_path)

        # ---- stats ----
        comparable_pixels = int(width * height - int(np.sum(ignore_mask)))
        diff_percentage = (diff_count / comparable_pixels * 100.0) if comparable_pixels > 0 else 0.0

        return {
            "id": comparison_id,
            "before_image": f"/static/uploads/{comparison_id}_before.png",
            "after_image": f"/static/uploads/{comparison_id}_after.png",
            "diff_image": f"/static/generated/{comparison_id}_diff.png",
            "diff_percentage": diff_percentage,
            "diff_pixels": int(diff_count),
            "total_pixels": comparable_pixels,
            "threshold": float(threshold),
            "ignored_regions_count": int(len(before_regions) + len(after_regions)),
        }
