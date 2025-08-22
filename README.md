# Visual Difference Detection

A web-based application for comparing two images and highlighting their differences. This project is a minimal, yet complete, implementation of a visual regression testing tool, built with a FastAPI backend and a React frontend.

## Features

- **Image Comparison:** Upload two images to compare them and see a visual diff.
- **Threshold Adjustment:** Use a slider to adjust the sensitivity of the difference detection.
- **Ignore Regions:** Select rectangular regions to exclude from the comparison.
- **Comparison History:** View a history of recent comparisons.
- **API Key Authentication:** Secure the backend with API key authentication.

## Tech Stack

- **Backend:** FastAPI, Python, Pillow, pixelmatch, pydantic-settings
- **Frontend:** React, TypeScript, Vite, react-dropzone

## Getting Started

To get the application running locally, follow the instructions in the `backend/README.md` and `frontend/README.md` files.
Feel free to use the curated images in /res to kick off!
## Project Structure

- `backend/`: The FastAPI application that handles image processing and comparison.
- `frontend/`: The React application that provides the user interface.

## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.