# Backend

This directory contains the FastAPI backend for the Visual Difference Detection application.

## Setup

1.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Server:**

    ```bash
    uvicorn main:app --reload
    ```

    The server will be available at `http://localhost:8000`.

## API

The backend exposes a REST API for image comparison.

### Endpoints

-   `POST /api/comparison/`: Compare two images.
-   `GET /api/comparison/history/`: Get a history of recent comparisons.
-   `GET /api/comparison/{comparison_id}`: Get the results of a specific comparison.

### Authentication

The API is protected by API key authentication. To access the API, you must include a valid API key in the `X-API-Key` header of your requests.

The valid API keys are defined in `backend/app/config.py`. The default API key is `my-secret-api-key`.

## Dependencies

-   [FastAPI](https://fastapi.tiangolo.com/): A modern, fast (high-performance) web framework for building APIs with Python 3.7+ based on standard Python type hints.
-   [pixelmatch](https://github.com/mapbox/pixelmatch): A JavaScript image comparison library used for visual diffing.
-   [pydantic-settings](https://pydantic-docs.github.io/pydantic-settings/): A Pydantic extension for managing application settings.