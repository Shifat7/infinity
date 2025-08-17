# Authentication and Authorization Flow

This document details the user authentication and authorization flow for the ComicCo application.

## 1. User Registration

-   **Endpoint:** `POST /api/auth/register`
-   **Request Body:**
    -   `email`
    -   `password`
    -   `first_name`
    -   `last_name`
    -   `role` ('parent' or 'therapist')
-   **Process:**
    1.  Validate the request body.
    2.  Check if a user with the given email already exists.
    3.  Hash the password using a strong hashing algorithm (e.g., bcrypt).
    4.  Create a new user record in the `Users` table.
    5.  Return a success message.

## 2. User Login

-   **Endpoint:** `POST /api/auth/login`
-   **Request Body:**
    -   `email`
    -   `password`
-   **Process:**
    1.  Find the user by email in the `Users` table.
    2.  If the user exists, compare the provided password with the stored hash.
    3.  If the password is correct, generate a JSON Web Token (JWT).
    4.  The JWT payload will include `user_id` and `role`.
    5.  Return the JWT to the client.

## 3. Session Management

-   The client (frontend) will store the JWT (e.g., in an HttpOnly cookie or local storage).
-   For subsequent requests to protected endpoints, the client will include the JWT in the `Authorization` header (e.g., `Authorization: Bearer <token>`).
-   The backend will have middleware to verify the JWT on protected routes.

## 4. Authorization (Role-Based Access Control)

-   The backend middleware will not only verify the JWT but also check the `role` from the token's payload.
-   Endpoints will be protected based on roles. For example:
    -   A therapist might have access to a dashboard with multiple children, while a parent can only see their own child's data.
    -   Creating new game content might be restricted to a future 'admin' role.

## 5. Parental Controls (Passcode Lock)

-   This will be primarily a frontend concern, but the backend can support it.
-   When a parent sets a passcode, the frontend will store a hash of it locally on the device/browser.
-   Access to the parental settings section in the UI will require entering the passcode. The frontend will verify it against the stored hash.
-   This provides a layer of security to prevent children from accessing sensitive settings without needing a full re-authentication.