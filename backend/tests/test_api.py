import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))  # Add backend/ to sys.path

import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

# Helper to get absolute path to test images
def get_image_path(filename):
    return os.path.join(os.path.dirname(__file__), "test_images", filename)

@pytest.fixture
def comparison_id():
    with open(get_image_path("image1.png"), "rb") as f1, open(get_image_path("image2.png"), "rb") as f2:
        response = client.post(
            "/api/comparison/",
            headers={"X-API-Key": "my-secret-api-key"},
            files={"before_image": f1, "after_image": f2},
        )
    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert "diff_percentage" in data
    return data["id"]

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Duku AI Visual Regression MVP"}

def test_create_comparison_success(comparison_id):
    assert comparison_id is not None

def test_create_comparison_missing_api_key():
    with open(get_image_path("image1.png"), "rb") as f1, open(get_image_path("image2.png"), "rb") as f2:
        response = client.post(
            "/api/comparison/",
            files={"before_image": f1, "after_image": f2},
        )
    assert response.status_code == 403

def test_create_comparison_invalid_api_key():
    with open(get_image_path("image1.png"), "rb") as f1, open(get_image_path("image2.png"), "rb") as f2:
        response = client.post(
            "/api/comparison/",
            headers={"X-API-Key": "invalid-key"},
            files={"before_image": f1, "after_image": f2},
        )
    assert response.status_code == 401

def test_get_comparison_success(comparison_id):
    response = client.get(
        f"/api/comparison/{comparison_id}",
        headers={"X-API-Key": "my-secret-api-key"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == comparison_id

def test_get_comparison_not_found():
    response = client.get(
        "/api/comparison/non-existent-id",
        headers={"X-API-Key": "my-secret-api-key"},
    )
    assert response.status_code == 404

def test_get_history_success(comparison_id):
    client.get("/api/comparison/history/", headers={"X-API-Key": "my-secret-api-key"})
    for _ in range(3):
        with open(get_image_path("image1.png"), "rb") as f1, open(get_image_path("image2.png"), "rb") as f2:
            client.post(
                "/api/comparison/",
                headers={"X-API-Key": "my-secret-api-key"},
                files={"before_image": f1, "after_image": f2},
            )

    response = client.get(
        "/api/comparison/history/",
        headers={"X-API-Key": "my-secret-api-key"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 3

def test_get_history_limit(comparison_id):
    client.get("/api/comparison/history/", headers={"X-API-Key": "my-secret-api-key"})
    for _ in range(15):
        with open(get_image_path("image1.png"), "rb") as f1, open(get_image_path("image2.png"), "rb") as f2:
            client.post(
                "/api/comparison/",
                headers={"X-API-Key": "my-secret-api-key"},
                files={"before_image": f1, "after_image": f2},
            )

    response = client.get(
        "/api/comparison/history/",
        headers={"X-API-Key": "my-secret-api-key"},
    )
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 10
