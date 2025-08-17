# Database Schema

This document outlines the database schema for the ComicCo application.

## Tables

### 1. Users

Stores information about all users of the platform.

-   `user_id` (Primary Key)
-   `email` (Unique)
-   `password_hash`
-   `first_name`
-   `last_name`
-   `role` (e.g., 'parent', 'therapist')
-   `created_at`
-   `updated_at`

### 2. Children

Stores profiles for the children using the app. Linked to a parent user.

-   `child_id` (Primary Key)
-   `parent_user_id` (Foreign Key to Users)
-   `first_name`
-   `date_of_birth`
-   `learning_profile` (JSONB to store details about disorders like dyslexia, dysgraphia, etc.)
-   `created_at`
-   `updated_at`

### 3. GameContent

Stores the actual content for the interactive games and exercises.

-   `game_id` (Primary Key)
-   `title`
-   `description`
-   `disorder_type` (e.g., 'dyslexia', 'dyscalculia')
-   `content_data` (JSONB for game-specific data)
-   `difficulty_level`
-   `created_at`

### 4. GameResults

Tracks a child's performance in each game session.

-   `result_id` (Primary Key)
-   `child_id` (Foreign Key to Children)
-   `game_id` (Foreign Key to GameContent)
-   `score`
-   `time_taken_seconds`
-   `completed_at`
-   `feedback_data` (JSONB for detailed performance metrics)

### 5. ParentFeedback

Stores qualitative feedback and observations from parents.

-   `feedback_id` (Primary Key)
-   `child_id` (Foreign Key to Children)
-   `parent_user_id` (Foreign Key to Users)
-   `observation_notes` (Text)
-   `behavior_tags` (Array of strings)
-   `created_at`