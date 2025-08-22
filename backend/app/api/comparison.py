from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Depends
from ..auth import get_api_key
from ..services.image_service import ImageComparisonService
from collections import deque

router = APIRouter(
    prefix="/comparison", 
    tags=["comparison"], 
    dependencies=[Depends(get_api_key)]
)
comparison_store = {}
comparison_history = deque(maxlen=10) # Store last 10 comparisons

@router.post("/", response_model=dict)
async def create_comparison(
    before_image: UploadFile = File(...),
    after_image: UploadFile = File(...),
    threshold: float = Form(0.1),  # Default threshold value
    ignore_regions: str = Form("{}")  # JSON string for ignore regions
):
    """
    Endpoint to compare two images with optional ignore regions and threshold.
    """
    service = ImageComparisonService()
    try:
        # Call the updated compare_images method
        result = await service.compare_images(
            before_file=before_image,
            after_file=after_image,
            threshold=threshold,
            ignore_regions=ignore_regions
        )
        # Store the result in the comparison_store and history
        comparison_store[result['id']] = result
        comparison_history.append(result)
        return result
    except Exception as e:
        # Handle errors gracefully
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{comparison_id}")
async def get_comparison(comparison_id: str):
    if comparison_id not in comparison_store:
        raise HTTPException(404, "Not found")
    return comparison_store[comparison_id]

@router.get("/history/")
async def get_history():
    return list(comparison_history)