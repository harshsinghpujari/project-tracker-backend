🧩 Project & Time Tracking System (Backend)

A backend system built with Node.js, Express, and Sequelize (MySQL) to manage projects, tasks, and time tracking for managers and employees with JWT-based authentication and role-based access control.

The primary focus of this submission is on secure Role-Based Access Control (RBAC), robust database relationships, and clear RESTful API design.

---------------------------------------------------------------------------------------------
### 1. 🚀 Setup and Local Run Instructions

Follow these steps to get the project environment operational on your machine.

#### Prerequisites

* **Node.js** (v18+) and **npm**
* **MySQL** or **PostgreSQL** database instance running locally.

#### Installation Steps

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/harshsinghpujari/project-tracker-backend/](https://github.com/harshsinghpujari/project-tracker-backend/)
    cd project-tracker-backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Configuration:**
    This step is crucial for security and connectivity. Create a file named **`.env`** in the root directory. This file stores sensitive information and is ignored by Git.

    **Populate the file with the following required variables, customizing the values:**

    | Variable | Purpose | Example Value |
    | :--- | :--- | :--- |
    | `PORT` | Local port for the Express server. | `5000` |
    | `DATABASE_NAME` | Name of your database instance. | `project_tracker_db` |
    | `DATABASE_USERNAME` | Username for accessing your database. | `root` or `postgres` |
    | `DATABASE_PASSWORD` | Password for your database user. | `mySecurePassword123` |
    | `SECRET_KEY` | **Crucial:** A long, random string used to sign (secure) **JWTs**. | `A_VERY_STRONG_RANDOM_SECRET_FOR_TOKEN_SIGNING` |

    ```bash
    # .env File Content (Copy and customize these lines)

    # Server Configuration
    PORT=5000

    # Database Configuration (Modify the dialect accordingly)
    DATABASE_NAME=[YOUR_DB_NAME]
    DATABASE_USERNAME=[YOUR_DB_USER]
    DATABASE_PASSWORD=[YOUR_DB_PASSWORD]

    # JWT Security Key (MUST be long and secret)
    SECRET_KEY=A_SECURE_RANDOM_STRING_FOR_JWT_SIGNING
    ```

4.  **Run the Server:**
    The server will connect to the database, automatically **synchronize and create all necessary tables (Users, Projects, Tasks, TimeLogs)**, and start listening on the specified port.

    ```bash
    npm start # Or your specific run command (e.g., node src/index.js)
    ```


### 2. 🛡️ Authentication and Permissions Handling (Key Deliverable)

The entire application relies on **JWT** for authentication and a strict **Two-Layer Authorization** policy.

### A. Role-Based Access Control (RBAC) Summary

| User Role | Access Scope and Permissions |
| :--- | :--- |
| **Manager** | Full CRUD control over **their own** Projects and Tasks. Full read access to *all* Time Logs and **Reports** under their managed projects. |
| **Employee**| Read/Update access to **only** Tasks assigned to them. Read/Write access to **only their own** Time Logs. |

### B. Authorization Logic

Access control is enforced via two distinct security layers:

| Security Layer | Implemented via | Enforcement Mechanism |
| :--- | :--- | :--- |
| **Layer 1: Role Restriction** | **`authorizeRole` Middleware** (Used for `POST/DELETE` tasks/projects) | Quickly denies access (403 Forbidden) if the authenticated user's role (`req.user.role`) is not in the required list (e.g., `"manager"`). |
| **Layer 2: Granular Ownership** | **Controller Logic** (e.g., in `updateTask`, `getAllProject`) | After role is verified, the controller performs a **database check** to ensure the resource's Foreign Key (`manager_id` or `assigned_to`) matches the authenticated user's `req.user.id`. This prevents managers from touching another manager's projects. |
### 3. 🌐 API Endpoints and Documentation

The base API URL is: `http://localhost:5000/api`.

| Feature | Endpoint | Method | Access | Security/Logic Implemented |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/users/register` | `POST` | Public | Creates Manager/Employee accounts. |
| | `/api/users/login` | `POST` | Public | Returns **JWT token**. |
| **Projects** | `/api/projects` | `POST` | Manager | Creates a project (Manager is assigned as owner). |
| | `/api/projects` | `GET` | Manager | **Manager:** Sees owned projects. **Employee:** Denied (Deferred scope feature). |
| **Tasks** | `/api/tasks` | `POST` | Manager | Creates task under an **owned project**. |
| | `/api/tasks` | `GET` | Manager/Employee | **Manager:** Sees tasks under owned projects. **Employee:** Sees only assigned tasks. Includes **Pagination & Filtering**. |
| | `/api/tasks/:id` | `PUT/PATCH` | Manager/Employee | **Manager:** Updates metadata (owner check). **Employee:** Updates `status`/`progress`. |
| **Time Logs** | `/api/timelogs` | `POST` | Employee | Logs hours against an **assigned task** (owner check). |
| | `/api/timelogs` | `GET` | Manager/Employee | **Manager:** Sees logs for their projects. **Employee:** Sees their own logs. |
| **Reports** | `/api/reports` | `GET` | Manager | Summarizes **Total Hours Logged per Project/Task** within the Manager's scope. |

4. 📝 Database Design Highlights

All models are defined using Sequelize, enforcing strong relational integrity.

    User: Contains the critical role ENUM (manager, employee).

    Project: One-to-Many relationship with User (manager_id).

    Task: One-to-Many relationships with Project (project_id) and User (assigned_to).

    TimeLog: One-to-Many relationships with Task (task_id) and User (user_id).

    Foreign Key Constraints: Explicitly defined using the references property to ensure data consistency at the database level.

