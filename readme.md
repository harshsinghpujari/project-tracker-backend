📂 README: Project & Time Tracking System Backend

This repository contains the backend API system for a Project and Time Tracking application. It is built using Node.js, Express, and Sequelize (ORM) with MySQL/PostgreSQL support.

The primary focus of this submission is on secure Role-Based Access Control (RBAC), robust database relationships, and clear RESTful API design.

1. 🚀 Setup and Local Run Instructions

Follow these steps to get the project environment operational on your machine.

Prerequisites

    Node.js (v18+) and npm

    MySQL or PostgreSQL database instance running locally.

Installation Steps

    Clone the Repository:
    Bash

git clone [YOUR_REPOSITORY_URL]
cd [YOUR_PROJECT_FOLDER_NAME]

Install Dependencies:
Bash

npm install

Environment Configuration: Create a file named .env in the root directory and configure your database credentials and security keys.
Bash

# Database Configuration (Modify dialect if using PostgreSQL)
DATABASE_NAME=[YOUR_DB_NAME]
DATABASE_USERNAME=[YOUR_DB_USER]
DATABASE_PASSWORD=[YOUR_DB_PASSWORD]

# Server & Security
PORT=5000
SECRET_KEY=A_SECURE_RANDOM_STRING_FOR_JWT

Start the Server: The server will automatically connect to the database and synchronize all models (creating tables) upon startup.
Bash

    npm start # Or your specific run command (e.g., node src/index.js)
    # Console output should show: "Database connected successfully" and "Tables synced with database"

2. 🛡️ Authentication and Permissions Handling (Key Deliverable)

The entire application relies on JWT for authentication and a strict Two-Layer Authorization policy.

A. Authentication (JWT)

    Upon successful login (POST /api/users/login), the server issues a JSON Web Token (JWT) containing the user's id and role.

    The verifyToken middleware runs on all protected routes, validating the token and attaching req.user.id and req.user.role to the request object.

B. Role-Based Access Control (RBAC)

User Role	Permissions Granted
Manager	Full CRUD control over their own Projects and Tasks. Full read access to all Time Logs and Reports under their managed projects.
Employee	Read/Update access to only Tasks assigned to them. Read/Write access to only their own Time Logs.

C. Authorization Logic

Security Layer	Implemented via	Enforcement
Role Restriction	authorizeRole("manager") Middleware (Used for POST/DELETE /tasks and POST/DELETE/PUT /projects)	Denies access if the role is not 'manager' before the controller runs.
Ownership Scope	Controller Logic (e.g., in updateTask, getAllProject)	After the role is verified, the controller performs a database check to ensure the resource's foreign key (manager_id or assigned_to) matches req.user.id.

3. 🌐 API Endpoints and Documentation

Feature,Endpoint,Method,Access,Security/Logic Implemented
Auth,/api/users/register,POST,Public,Creates Manager/Employee accounts.
,/api/users/login,POST,Public,Returns JWT token.
Projects,/api/projects,POST,Manager,Creates a project (Manager is assigned as owner).
,/api/projects,GET,Manager,Manager: Sees owned projects. Employee: Denied (Deferred scope feature).
Tasks,/api/tasks,POST,Manager,Creates task under an owned project.
,/api/tasks,GET,Manager/Employee,Manager: Sees tasks under owned projects. Employee: Sees only assigned tasks. Includes Pagination & Filtering.
,/api/tasks/:id,PUT/PATCH,Manager/Employee,Manager: Updates metadata (owner check). Employee: Updates status/progress.
Time Logs,/api/timelogs,POST,Employee,Logs hours against an assigned task (owner check).
,/api/timelogs,GET,Manager/Employee,Manager: Sees logs for their projects. Employee: Sees their own logs.
Reports,/api/reports,GET,Manager,Summarizes Total Hours Logged per Project/Task within the Manager's scope.

4. 📝 Database Design Highlights

All models are defined using Sequelize, enforcing strong relational integrity.

    User: Contains the critical role ENUM (manager, employee).

    Project: One-to-Many relationship with User (manager_id).

    Task: One-to-Many relationships with Project (project_id) and User (assigned_to).

    TimeLog: One-to-Many relationships with Task (task_id) and User (user_id).

    Foreign Key Constraints: Explicitly defined using the references property to ensure data consistency at the database level.

Step 3: Final Submission

    Replace the placeholder [YOUR_REPOSITORY_URL] with your actual URL.

    Submit the email to Aviral Pathak with the link to this completed GitHub repository.
