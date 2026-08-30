# CollabBoard API Contract

**Base URL:** `http://localhost:5000`

---

## 1. Authentication (`/api/auth`)

### Register a New User
*   **Method:** `POST`
*   **Endpoint:** `/api/auth/register`
*   **Description:** Creates a new user account.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "message": "User registered successfully"
    }
    ```

### Login
*   **Method:** `POST`
*   **Endpoint:** `/api/auth/login`
*   **Description:** Authenticates a user and returns a JWT.
*   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "securepassword123"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "email": "user@example.com"
    }
    ```

---

## 2. Tasks (`/api/tasks`)
*Note: All task routes require a valid JWT in the `Authorization` header (`Bearer <token>`).*

### Get All Tasks
*   **Method:** `GET`
*   **Endpoint:** `/api/tasks`
*   **Description:** Retrieves all tasks for the board.
*   **Request Body:** None
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "1716301200000",
        "title": "Design homepage",
        "tag": "Design",
        "column": "inprogress",
        "userId": 1,
        "createdAt": "2026-08-24T10:00:00.000Z"
      }
    ]
    ```

### Create a Task
*   **Method:** `POST`
*   **Endpoint:** `/api/tasks`
*   **Description:** Adds a new task to the board.
*   **Request Body:**
    ```json
    {
      "title": "Setup API Contract",
      "tag": "Planning",
      "column": "todo"
    }
    ```
*   **Success Response (201 Created):** Returns the created task object.

### Update a Task
*   **Method:** `PUT`
*   **Endpoint:** `/api/tasks/:id`
*   **Description:** Updates a task's details (e.g., moving it to a new column).
*   **Request Body:**
    ```json
    {
      "title": "Setup API Contract",
      "tag": "Planning",
      "column": "done"
    }
    ```
*   **Success Response (200 OK):** Returns the updated task object.

### Delete a Task
*   **Method:** `DELETE`
*   **Endpoint:** `/api/tasks/:id`
*   **Description:** Removes a task from the board.
*   **Request Body:** None
*   **Success Response (200 OK):**
    ```json
    {
      "message": "Task deleted successfully"
    }
    ```