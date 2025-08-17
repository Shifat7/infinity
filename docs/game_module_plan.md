# Interactive Game Module Plan

This document outlines the architecture for the interactive game module in the ComicCo application.

## 1. Core Architecture

-   **Component-Based Design:** The game module will be built as a collection of reusable React components.
-   **Game Engine/Controller:** A central `GameController` component will manage the overall game state, including the current game, score, timer, and progression.
-   **Dynamic Game Loading:** The `GameController` will dynamically load the appropriate game component based on the `game_id` or `disorder_type` fetched from the backend. This will allow for easy addition of new games in the future.

## 2. State Management

-   **Local State:** Game-specific state (e.g., current question, user input) will be managed within the individual game components using React hooks (`useState`, `useReducer`).
-   **Global State (Optional):** If needed, a global state management library (like Redux Toolkit or Zustand) could be used to manage state that needs to be shared across the application (e.g., the child's overall progress).

## 3. Data Flow

1.  The user selects a game from the main dashboard.
2.  The `GameController` component is mounted and fetches the game content from the backend API (e.g., `GET /api/games/:game_id`).
3.  The backend will return the `content_data` (from the `GameContent` table) for the selected game.
4.  The `GameController` dynamically renders the appropriate game component, passing the `content_data` as props.
5.  As the user plays, the game component updates its local state.
6.  When the game is completed, the game component sends the results (score, time taken, etc.) up to the `GameController`.
7.  The `GameController` then sends the results to the backend to be saved in the `GameResults` table (e.g., `POST /api/results`).

## 4. Game Types

The architecture will be designed to support various game types, such as:

-   **Multiple Choice Quizzes:** For reading comprehension.
-   **Drag-and-Drop:** For matching words to pictures (dyslexia) or arranging numbers (dyscalculia).
-   **Tracing Games:** For practicing letter and number formation (dysgraphia).

Each game type will be its own React component, adhering to a common interface for easy integration with the `GameController`.