# Progress Tracking and Reporting Feature Plan

This document outlines the plan for the progress tracking and reporting feature in the ComicCo application.

## 1. Backend (API Endpoints)

The backend will provide endpoints for the frontend to fetch aggregated and detailed progress data.

-   **`GET /api/children/:child_id/progress/summary`**
    -   **Description:** Returns a summary of a child's overall progress.
    -   **Response Data:**
        -   `total_games_played`
        -   `average_score`
        -   `most_played_game_type`
        -   `recent_achievements` (e.g., "Highest score in [Game]!").

-   **`GET /api/children/:child_id/progress/history`**
    -   **Description:** Returns a detailed history of all game results for a child.
    -   **Query Parameters:**
        -   `game_type` (e.g., 'dyslexia')
        -   `date_range` (e.g., 'last_7_days')
    -   **Response Data:** An array of game result objects, including `game_title`, `score`, `time_taken`, and `completed_at`.

-   **`GET /api/children/:child_id/feedback`**
    -   **Description:** Returns all parent feedback and observations for a child.
    -   **Response Data:** An array of feedback objects, including `observation_notes`, `behavior_tags`, and `created_at`.

## 2. Frontend (Dashboard Components)

The frontend will have a dedicated "My Progress" section with the following components:

-   **Progress Summary Widget:**
    -   Displays the key metrics from the `/progress/summary` endpoint in a visually appealing way (e.g., using Claymorphism-style cards).
-   **Progress History Chart:**
    -   A line chart or bar chart visualizing the child's scores over time.
    -   Users will be able to filter the chart by game type and date range.
    -   This will use a charting library (e.g., Recharts or Chart.js) styled to fit the Claymorphism aesthetic.
-   **Parent Feedback Log:**
    -   A scrollable list of all parent observations, displayed in a clear and easy-to-read format.
    -   Each entry will show the notes, tags, and date.

## 3. Data Visualization

-   All charts and graphs will be designed with the soft, rounded, and colorful Claymorphism style.
-   Data will be presented in a way that is easy for parents and therapists to understand at a glance.
-   Visual cues (like colors and icons) will be used to highlight trends and important data points.