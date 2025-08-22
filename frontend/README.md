# Frontend

This directory contains the React frontend for the Visual Difference Detection application.

## Setup

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Run the Development Server:**

    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:5173`.

## Components

-   `App.tsx`: The main application component.
-   `FileUpload.tsx`: A component for uploading files.
-   `HistoryPanel.tsx`: A component for displaying the comparison history.
-   `RegionSelector.tsx`: A component for selecting regions to ignore.
-   `ResultsPanel.tsx`: A component for displaying the comparison results.
-   `SensitivitySlider.tsx`: A component for adjusting the sensitivity of the difference detection.

## Hooks

-   `useComparison.ts`: A custom hook for making API requests to the backend to compare images.
-   `useHistory.ts`: A custom hook for fetching the comparison history from the backend.

## Dependencies

-   [React](https://reactjs.org/): A JavaScript library for building user interfaces.
-   [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.
-   [Vite](https://vitejs.dev/): A build tool that aims to provide a faster and leaner development experience for modern web projects.
-   [react-dropzone](https://react-dropzone.js.org/): A simple React hook to create a HTML5-compliant drag'n'drop zone for files.