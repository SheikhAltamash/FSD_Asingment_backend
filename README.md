# Task Management Application - Backend API

This repository contains the backend API server for the MERN Task Management application. It handles user authentication, task management (CRUD operations), and data persistence using Node.js, Express, and MongoDB.

## Features

*   User Registration & Login (Email/Password)
*   JWT-based Authentication & Authorization
*   CRUD operations for Tasks (Create, Read, Update, Delete)
*   Task association with users
*   Protected API routes requiring authentication

## Tech Stack

*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Authentication:** JSON Web Tokens (jsonwebtoken)
*   **Password Hashing:** bcryptjs
*   **Middleware:** cors, dotenv

## Architecture & Technical Choices

*   **Framework (Express.js):** Chosen for its robustness, widespread adoption, extensive middleware ecosystem, and simplicity in building RESTful APIs.
*   **Database (MongoDB with Mongoose):** A NoSQL document database selected for its flexibility in handling task data, which can have varying fields (like optional descriptions or future additions). Mongoose provides valuable object data modeling (ODM), schema definition, validation, and business logic hooks.
*   **Authentication (JWT):** Stateless JWT authentication was implemented. Upon successful login, a token is issued to the client. The client sends this token in the `Authorization` header for subsequent requests to protected routes. The server verifies the token using a middleware (`authMiddleware.js`) without needing to maintain session state, making the API scalable.
*   **Password Security:** `bcryptjs` is used to hash user passwords before storing them in the database, ensuring passwords are not stored in plain text.
*   **Folder Structure:** The code is organized into logical directories (config, controllers, middleware, models, routes) to promote separation of concerns, making the codebase easier to understand, maintain, and scale.
*   **Environment Variables:** Sensitive information (Database URI, JWT Secret, Port) is managed using environment variables via the `dotenv` package, keeping configuration separate from the code.

## Database Schema

The application uses two main Mongoose models:

### 1. User (`models/User.js`)

| Field     | Type   | Constraints                                  | Description                   |
| :-------- | :----- | :------------------------------------------- | :---------------------------- |
| `_id`     | ObjectId | Auto-generated                             | Unique identifier for the user |
| `email`   | String | Required, Unique, Valid Email Format | User's login email address     |
| `password`| String | Required, Minlength 6, Select: false       | Hashed user password          |
| `createdAt`| Date   | Default: `Date.now`                        | Timestamp of user creation    |

### 2. Task (`models/Task.js`)

| Field         | Type     | Constraints                                    | Description                     |
| :------------ | :------- | :--------------------------------------------- | :------------------------------ |
| `_id`         | ObjectId | Auto-generated                               | Unique identifier for the task  |
| `user`        | ObjectId | Required, Ref: 'User'                        | ID of the user who owns the task |
| `title`       | String   | Required, Trim, Maxlength 100                | The title of the task           |
| `description` | String   | Maxlength 500                                | Optional details about the task |
| `status`      | String   | Enum: ['Active', 'Completed'], Default: 'Active' | Current status of the task      |
| `priority`    | String   | Enum: ['Low', 'Medium', 'High'], Default: 'Medium' | Priority level of the task      |
| `createdAt`   | Date     | Default: `Date.now`                          | Timestamp of task creation      |

## Prerequisites

Before you begin, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js) or [yarn](https://yarnpkg.com/)
*   A running [MongoDB](https://www.mongodb.com/) instance (either locally or a cloud service like MongoDB Atlas)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-backend-repository-url>
    cd <repository-folder-name>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Create Environment File:**
    Create a `.env` file in the root of the backend project directory.

4.  **Configure Environment Variables:**
    Add the following variables to your `.env` file, replacing the placeholder values with your actual configuration:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_strong_and_secret_jwt_key_please_change
    PORT=8080
    ```
    *   `MONGO_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A long, random, secret string used to sign JWTs.
    *   `PORT`: The port number the server will run on (default is 5001 if not specified).

## Running the Application Locally

  **Start the development server (with Nodemon for auto-reloading):**
    ```bash
    node server.js
    ```

The API server should now be running, typically on `http://localhost:5001` (or the port specified in your `.env` file).

## API Endpoints

The following API endpoints are available:

### Authentication (`/api/auth`)

*   **`POST /register`**: Register a new user.
    *   Body: `{ "email": "user@example.com", "password": "password123" }`
*   **`POST /login`**: Authenticate a user and receive a JWT.
    *   Body: `{ "email": "user@example.com", "password": "password123" }`
*   **`GET /me`**: Get the details of the currently logged-in user. (`Protected`)

### Tasks (`/api/tasks`)

*All task routes are protected and require a valid JWT in the `Authorization: Bearer <token>` header.*

*   **`GET /`**: Get all tasks for the logged-in user.
*   **`POST /`**: Create a new task for the logged-in user.
    *   Body: `{ "title": "New Task Title", "description": "(Optional)", "priority": "Medium", "status": "Active" }`
*   **`PUT /:id`**: Update an existing task by its ID.
    *   Body: Can include any combination of `{ "title", "description", "priority", "status" }` fields to update.
*   **`DELETE /:id`**: Delete a task by its ID.

## Seed Data for Testing

This project doesn't include an automated seeding script. To test the application with sample data:

1.  Run both the frontend and backend applications.
2.  Use the registration form on the frontend to create 2-3 test users with different email addresses (e.g., `test1@example.com`, `test2@example.com`) and passwords.
3.  Log in as one of the test users.
4.  Use the "Add Task" form to create several sample tasks with varying titles, descriptions, priorities, and statuses for that user.
5.  Log out and log in as another test user to add tasks specific to them.

This will allow you to test fetching tasks specific to a user, updating statuses, filtering, etc.
