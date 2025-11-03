📂 Project Submission: Project & Time Tracking System Backend

This repository contains the backend API system for a Project and Time Tracking application, built using Node.js, Express, and Sequelize (ORM).

Key Features Implemented

    Authentication: Secure user signup and login using JWT (JSON Web Tokens) and bcrypt for password hashing.

    Role-Based Access Control (RBAC): Strict control over all API endpoints based on the Manager and Employee roles.

    Data Scoping: Managers only interact with projects they own; Employees only interact with tasks and time logs assigned to them.

    Task Management: Filtering and Pagination implemented for listing tasks.

    Reporting: Summarized analytics for total hours logged per project.

1. 💻 Setup Instructions

Follow these steps to get the project running locally.

    Prerequisites: Ensure you have Node.js and a MySQL/PostgreSQL database instance installed and running.

    Clone the Repository:
    Bash

git clone [YOUR_REPOSITORY_URL]
cd [YOUR_PROJECT_FOLDER]

Install Dependencies:
Bash

npm install

Database Configuration (.env file): Create a file named .env in the root directory and add your database credentials and a secret key:

PORT=5000
DATABASE_NAME=[YOUR_DB_NAME]
DATABASE_USERNAME=[YOUR_DB_USER]
DATABASE_PASSWORD=[YOUR_DB_PASSWORD]
SECRET_KEY=A_VERY_STRONG_RANDOM_SECRET

Run the Server: The server will connect to the database, automatically synchronize and create all necessary tables (Users, Projects, Tasks, TimeLogs), and start listening on the specified port.
Bash

    npm start  # Or whatever command you use to run index.js (e.g., node src/index.js)

2. 🌐 API Documentation & Endpoints

The base URL for the API is http://localhost:5000/api.
Feature	Endpoint	Method	Access	Description
Authentication	/api/users/register	POST	Public	Creates a new user (role: manager or employee).
	/api/users/login	POST	Public	Authenticates user and returns a JWT token.
Projects	/api/projects	POST	Manager	Creates a new project (Manager becomes the owner).
	/api/projects	GET	Manager/Employee	Manager sees owned projects. Employee sees their tasks/logs (Controller logic enforces this).
Tasks	/api/tasks	POST	Manager	Creates a task under an owned project.
	/api/tasks?page=1&limit=10	GET	Manager/Employee	Manager sees tasks under owned projects. Employee sees assigned tasks.
	/api/tasks/:id	PUT/PATCH	Manager/Employee	Manager updates metadata. Employee updates status/progress.
Time Tracking	/api/timelogs	POST	Employee	Logs work hours against a task assigned to the user.
	/api/timelogs	GET	Manager/Employee	Manager sees logs for their projects. Employee sees their own logs.
Reporting	/api/reports	GET	Manager	Summarized total hours per project/task managed by the user.

3. 🛡️ Role-Based Access Control (RBAC) Explanation

Access control is enforced via a two-layer system:

A. Authentication Layer (Middleware)

    verifyToken Middleware: Runs on every protected route. It validates the JWT token sent in the Authorization: Bearer <token> header.

    If valid, it extracts the user.id and user.role from the token payload and attaches them to the request object (req.user).

B. Authorization Layer (Middleware & Controller Logic)

    authorizeRole Middleware: Used on endpoints that require a specific role (e.g., POST /projects). It quickly denies access if req.user.role does not match the required role ("manager").

    Granular Controller Checks: For all CRUD operations (especially PUT/DELETE and GET), the controller performs a resource ownership check after the user is authenticated:

        Manager: Logic checks if the resource's manager_id or project_id matches the req.user.id.

        Employee: Logic checks if the resource's assigned_to or user_id matches the req.user.id.