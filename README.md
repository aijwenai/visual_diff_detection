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
Feel free to use the curated images in /res to kick off your journey!

## Project Structure
- `backend/`: The FastAPI application that handles image processing and comparison as well as necessary tests.
- `frontend/`: The React application that provides the user interface.

## Assumptions
* The primary users of this application are developers or QA testers who need a simple tool for visual regression testing.
* The application would be hosted in a trusted environment, so the current API key authentication is sufficient for security.
* Users are technically savvy enough to understand the concept of a sensitivity threshold and how to draw ignore regions.

## Future Improvements
* **User Accounts:** Implement a user authentication system to allow users to save their comparison history and settings.
* **More Comparison Algorithms:** Add support for different diffing algorithms to provide more nuanced comparisons.
* **Real-time Collaboration:** Allow multiple users to view and interact with the same comparison results in real-time.
* **Automated Testing Integration:** Provide an API endpoint for automated testing tools to trigger comparisons and retrieve results.
* **E2E tests for frontend:** Implement end-to-end tests for the frontend to ensure the user interface works as expected.

## Challenges
* **Performance with Large Images:** Processing large images on the backend can be slow and memory-intensive. This was mitigated by resizing images before comparison, but a more robust solution would be needed for a production environment.
* **Frontend State Management:** Managing the state of the image uploads, comparison settings, and results on the frontend was complex. Using a state management library like Redux or Zustand could simplify this.
* **Cross-Browser Compatibility:** Ensuring that the application works consistently across different web browsers was a challenge, especially with the canvas-based region selection.


## License

This project is licensed under the terms of the MIT license. See the [LICENSE](LICENSE) file for details.