# TaskMaster — Premium Team Task Management System

<div align="center">

![TaskMaster Banner](https://img.shields.io/badge/TaskMaster-Premium%20Task%20Management-1F4E5F?style=for-the-badge&logo=checkmarx&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-v19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-v7-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-v5-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

**A production-ready, full-stack task management web application with role-based access control, glassmorphic UI, and real-time dashboard analytics.**

[Features](#-features) · [Tech Stack](#-tech-stack) · [Folder Structure](#-folder-structure) · [Setup Guide](#-local-setup-guide) · [API Docs](#-api-documentation) · [Deployment](#-deployment-railway)

</div>

---

## 📖 Project Overview

**TaskMaster** is a full-stack web application that enables teams to collaborate effectively through structured project and task management. It implements **Role-Based Access Control (RBAC)** with two roles — **Admin** and **Member** — so organizations can manage projects, assign tasks, and track progress in a secure environment.

Built for small to medium-sized teams who need a lightweight, self-deployable task management solution with an elegant premium UI.

### Key Highlights

- **Secure JWT Authentication** — Signup, login, and protected routes with bcrypt password hashing
- **Role-Based Access Control** — Admins manage everything; Members manage their own tasks
- **Project Management** — Create projects, add members, track deadlines and status
- **Task Tracking** — Assign tasks, set priorities, track overdue items with visual indicators
- **Team Management** — Create teams, invite members via email, assign lead roles
- **Live Dashboard** — Real-time stats, overdue task alerts, recent activity feed
- **Global Search** — Search projects and tasks from any page
- **Notification System** — Live overdue task alerts in the navbar
- **Premium Glassmorphic UI** — Framer Motion animations, responsive on all screen sizes

---

## ✨ Features

### For Admins

- Create, edit, and delete **Projects** with priorities, tags, and deadlines
- Create and assign **Tasks** to team members with priorities and due dates
- Add or remove **Members** from projects and teams
- Create **Teams**, invite members by email, assign lead or member roles
- View **all** projects, tasks, and full dashboard analytics
- Delete projects (auto-cascades to remove associated tasks)

### For Members

- View **assigned projects** and their tasks
- Update **task status** (Todo → In Progress → In Review → Completed)
- View personal **My Tasks** dashboard section
- Access **team information** and fellow member details

### Dashboard

- Total projects and task count overview cards
- Overdue task alerts with project and due date
- Recent task activity feed
- Task priority breakdown
- Role-scoped data (admins see all; members see their own)

---

## 🛠 Tech Stack

### Frontend

| Technology           | Version | Purpose                                        |
| -------------------- | ------- | ---------------------------------------------- |
| **React**            | 19.x    | Component-based UI                             |
| **Vite**             | 8.x     | Build tool and dev server                      |
| **React Router DOM** | 7.x     | Client-side routing and protected routes       |
| **Axios**            | 1.x     | HTTP client with request/response interceptors |
| **Tailwind CSS**     | 4.x     | Utility-first responsive styling               |
| **Framer Motion**    | 12.x    | Smooth page and component animations           |
| **Lucide React**     | 1.x     | Clean, consistent icon set                     |
| **jwt-decode**       | 4.x     | Token decoding on the client                   |

### Backend

| Technology            | Version | Purpose                             |
| --------------------- | ------- | ----------------------------------- |
| **Node.js**           | 18+ LTS | JavaScript runtime                  |
| **Express.js**        | 5.x     | REST API framework                  |
| **MongoDB**           | 7.x     | NoSQL database                      |
| **Mongoose**          | 9.x     | ODM with schema validation          |
| **jsonwebtoken**      | 9.x     | JWT generation and verification     |
| **bcryptjs**          | 3.x     | Password hashing (salt rounds: 12)  |
| **express-validator** | 7.x     | Request validation and sanitization |
| **Helmet**            | 8.x     | HTTP security headers               |
| **Morgan**            | 1.x     | HTTP request logging                |
| **cors**              | 2.x     | Cross-Origin Resource Sharing       |
| **dotenv**            | 17.x    | Environment variable management     |

---

## 📁 Folder Structure

```
TaskMaster/
├── backend/                        # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Signup, Login, GetMe, UpdateProfile, GetAllUsers
│   │   │   ├── project.controller.js   # CRUD Projects + Member management
│   │   │   ├── task.controller.js      # CRUD Tasks + My Tasks + Tasks by Project
│   │   │   ├── team.controller.js      # CRUD Teams + Member management
│   │   │   ├── dashboard.controller.js # Aggregated stats and analytics
│   │   │   └── search.controller.js    # Global search across projects and tasks
│   │   ├── middleware/
│   │   │   ├── auth.js             # JWT verification + user attachment
│   │   │   ├── roleCheck.js        # Role-based access (authorize middleware)
│   │   │   ├── validate.js         # express-validator result handler
│   │   │   └── errorHandler.js     # Global error handler
│   │   ├── models/
│   │   │   ├── User.js             # User schema (name, email, password, role, avatar)
│   │   │   ├── Project.js          # Project schema (name, owner, members, status, tags)
│   │   │   ├── Task.js             # Task schema (title, project, assignee, status, priority)
│   │   │   └── Team.js             # Team schema (name, owner, members[{user, role}])
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── project.routes.js
│   │   │   ├── task.routes.js
│   │   │   ├── team.routes.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── search.routes.js
│   │   ├── utils/
│   │   │   ├── ApiResponse.js      # Standardized success/error response helpers
│   │   │   └── ApiError.js         # Custom error class with static factory methods
│   │   └── validators/
│   │       ├── auth.validator.js
│   │       ├── project.validator.js
│   │       ├── task.validator.js
│   │       └── team.validator.js
│   ├── server.js                   # App entry point — wires Express, DB, and middleware
│   ├── .env.example                # Environment variable template
│   ├── test-api.ps1                # PowerShell API test script (Phase 2 testing)
│   └── package.json
│
├── frontend/                       # React + Vite SPA
│   ├── public/
│   ├── src/
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with JWT interceptors
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Global auth state (user, login, signup, logout)
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Sidebar, Navbar, Search, Notifications
│   │   │   └── ProtectedRoute.jsx  # Auth guard for private routes
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx       # Stats, recent tasks, overdue alerts
│   │   │   ├── Projects.jsx        # Grid/list view, create project modal
│   │   │   ├── Tasks.jsx           # Task list with filters, status updates
│   │   │   └── Teams.jsx           # Team cards, invite members by email
│   │   ├── App.jsx                 # Route definitions
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Tailwind + custom CSS variables + glass-card
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## ⚙️ Local Setup Guide

### Prerequisites

Make sure the following are installed on your machine:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9 or higher (comes with Node.js)
- **MongoDB** — either a local instance or a free [MongoDB Atlas](https://cloud.mongodb.com) cluster
- **Git** — [Download](https://git-scm.com)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

---

### Step 2 — Backend Setup

```bash
# Navigate into the backend folder
cd backend

# Install all dependencies
npm install

# Create your environment file from the example
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key_minimum_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5175
```

> **MongoDB Atlas setup:** Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com), whitelist your IP (or `0.0.0.0/0` for all), and paste your connection string into `MONGO_URI`.

Start the backend server:

```bash
# Development mode (with nodemon auto-reload)
npm run dev

# Production mode
npm start
```

You should see:

```
✅ MongoDB Connected: cluster0.xxxxx.mongodb.net
🚀 Server running in development mode on port 5000
```

Verify the API is alive:

```
GET http://localhost:5000/api/health
```

---

### Step 3 — Frontend Setup

Open a **new terminal** and navigate to the frontend folder:

```bash
cd frontend

# Install all dependencies
npm install

# Create your environment file
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

Start the frontend dev server:

```bash
npm run dev
```

The app will be available at **http://localhost:5175** (or whichever port Vite assigns).

---

### Step 4 — Create Your First Admin

1. Open **http://localhost:5175/signup** and register a new account (e.g., `admin@example.com`)
2. By default, all new users are created with the `member` role
3. Open **MongoDB Atlas** → your cluster → Collections → `users`
4. Find your user document and change `"role": "member"` to `"role": "admin"`
5. Save the document, then log back in — you now have full admin access

> **Tip:** You can also use Compass (GUI) or mongosh (CLI) to update the role locally.

---

## 🔐 Environment Variables Reference

### Backend (`backend/.env`)

| Variable     | Required | Description                                | Example                        |
| ------------ | -------- | ------------------------------------------ | ------------------------------ |
| `PORT`       | No       | Server port (Railway overrides this)       | `5000`                         |
| `MONGO_URI`  | **Yes**  | MongoDB connection string                  | `mongodb+srv://...`            |
| `JWT_SECRET` | **Yes**  | Secret key for signing JWTs (min 32 chars) | `my_super_secret_32char_key!!` |
| `JWT_EXPIRE` | No       | Token expiry duration                      | `7d`                           |
| `NODE_ENV`   | No       | Environment mode                           | `development` / `production`   |
| `CLIENT_URL` | **Yes**  | Frontend origin for CORS                   | `http://localhost:5175`        |

### Frontend (`frontend/.env`)

| Variable       | Required | Description          | Example                     |
| -------------- | -------- | -------------------- | --------------------------- |
| `VITE_API_URL` | **Yes**  | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Documentation

### Base URL

```
http://localhost:5000/api
```

### Standard Response Format

```json
// Success
{ "success": true, "message": "...", "data": { ... } }

// Error
{ "success": false, "message": "...", "errors": [] }
```

---

### 🔐 Authentication — `/api/auth`

| Method | Endpoint        | Description              | Access        |
| ------ | --------------- | ------------------------ | ------------- |
| `POST` | `/auth/signup`  | Register a new user      | Public        |
| `POST` | `/auth/login`   | Login and receive JWT    | Public        |
| `GET`  | `/auth/me`      | Get current user profile | Authenticated |
| `PUT`  | `/auth/profile` | Update name/avatar       | Authenticated |
| `GET`  | `/auth/users`   | List all users           | Admin only    |

**Signup body:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "secret123",
  "role": "member"
}
```

**Login body:**

```json
{
  "email": "jane@example.com",
  "password": "secret123"
}
```

**Login / Signup response:**

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "member"
    },
    "token": "eyJhbGciOiJIUzI1..."
  }
}
```

> **Using the token:** Pass it as a header on every protected request:
> `Authorization: Bearer <your_token>`

---

### 📁 Projects — `/api/projects`

| Method   | Endpoint                        | Description                             | Access        |
| -------- | ------------------------------- | --------------------------------------- | ------------- |
| `GET`    | `/projects`                     | List projects (admin: all; member: own) | Authenticated |
| `POST`   | `/projects`                     | Create a new project                    | Admin only    |
| `GET`    | `/projects/:id`                 | Get project details + tasks             | Authenticated |
| `PUT`    | `/projects/:id`                 | Update project metadata                 | Admin / Owner |
| `DELETE` | `/projects/:id`                 | Delete project and its tasks            | Admin only    |
| `POST`   | `/projects/:id/members`         | Add a user to project                   | Admin / Owner |
| `DELETE` | `/projects/:id/members/:userId` | Remove a user from project              | Admin / Owner |

**Create project body:**

```json
{
  "name": "Website Redesign",
  "description": "Revamp the company website",
  "status": "active",
  "priority": "high",
  "startDate": "2026-01-01",
  "endDate": "2026-06-30",
  "tags": ["design", "frontend"]
}
```

**Status values:** `planning` | `active` | `on-hold` | `completed` | `archived`

**Priority values:** `low` | `medium` | `high` | `critical`

---

### ✅ Tasks — `/api/tasks`

| Method   | Endpoint                    | Description                                 | Access               |
| -------- | --------------------------- | ------------------------------------------- | -------------------- |
| `GET`    | `/tasks`                    | List tasks (admin: all; member: own)        | Authenticated        |
| `POST`   | `/tasks`                    | Create a new task                           | Authenticated        |
| `GET`    | `/tasks/my-tasks`           | Get tasks assigned to current user          | Authenticated        |
| `GET`    | `/tasks/project/:projectId` | Get all tasks for a project                 | Authenticated        |
| `GET`    | `/tasks/:id`                | Get single task detail                      | Authenticated        |
| `PUT`    | `/tasks/:id`                | Update task (member can only update status) | Authenticated        |
| `DELETE` | `/tasks/:id`                | Delete a task                               | Admin / Task Creator |

**Create task body:**

```json
{
  "title": "Design the hero section",
  "description": "Create responsive hero with CTA",
  "project": "64f3a...",
  "assignee": "64f2b...",
  "priority": "high",
  "status": "todo",
  "dueDate": "2026-03-15",
  "tags": ["design", "ui"]
}
```

**Status values:** `todo` | `in-progress` | `in-review` | `completed`

**Query filters:** `GET /tasks?status=in-progress&priority=high&project=:id&assignee=:id`

---

### 👥 Teams — `/api/teams`

| Method   | Endpoint                     | Description                          | Access        |
| -------- | ---------------------------- | ------------------------------------ | ------------- |
| `GET`    | `/teams`                     | List teams (admin: all; member: own) | Authenticated |
| `POST`   | `/teams`                     | Create a new team                    | Admin only    |
| `GET`    | `/teams/:id`                 | Get team details with members        | Authenticated |
| `PUT`    | `/teams/:id`                 | Update team name/description         | Admin / Owner |
| `DELETE` | `/teams/:id`                 | Delete a team                        | Admin only    |
| `POST`   | `/teams/:id/members`         | Add member by userId or email        | Admin / Owner |
| `DELETE` | `/teams/:id/members/:userId` | Remove member from team              | Admin / Owner |

**Add member by email:**

```json
{ "email": "jane@example.com", "role": "member" }
```

**Member roles:** `lead` | `member`

---

### 📊 Dashboard — `/api/dashboard`

| Method | Endpoint     | Description                        | Access        |
| ------ | ------------ | ---------------------------------- | ------------- |
| `GET`  | `/dashboard` | Get aggregated stats and analytics | Authenticated |

**Response:**

```json
{
  "overview": {
    "totalProjects": 5,
    "totalTasks": 23,
    "completedTasks": 9,
    "pendingTasks": 14,
    "totalUsers": 8
  },
  "tasksByStatus": { "todo": 5, "in-progress": 6, "in-review": 3, "completed": 9 },
  "tasksByPriority": { "low": 4, "medium": 11, "high": 8 },
  "projectsByStatus": { "active": 3, "planning": 2 },
  "recentTasks": [ ... ],
  "overdueTasks": [ ... ]
}
```

---

### 🔍 Search — `/api/search`

| Method | Endpoint               | Description                       | Access        |
| ------ | ---------------------- | --------------------------------- | ------------- |
| `GET`  | `/search?query=design` | Search projects and tasks by name | Authenticated |

---

## 🗄️ Data Models

### User

```javascript
{
  name: String,           // required, 2-50 chars
  email: String,          // required, unique, lowercase
  password: String,       // required, min 6 chars, select:false (hidden in queries)
  role: String,           // enum: ['admin', 'member'], default: 'member'
  avatar: String,         // optional profile image URL
  createdAt: Date,
  updatedAt: Date
}
```

### Project

```javascript
{
  name: String,           // required, 2-100 chars
  description: String,    // max 500 chars
  status: String,         // planning | active | on-hold | completed | archived
  priority: String,       // low | medium | high | critical
  owner: ObjectId,        // ref: User
  team: ObjectId,         // ref: Team (optional)
  members: [ObjectId],    // ref: User[]
  startDate: Date,
  endDate: Date,
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Task

```javascript
{
  title: String,          // required, 2-200 chars
  description: String,    // max 1000 chars
  status: String,         // todo | in-progress | in-review | completed
  priority: String,       // low | medium | high | critical
  project: ObjectId,      // required, ref: Project
  assignee: ObjectId,     // ref: User (optional)
  createdBy: ObjectId,    // ref: User
  dueDate: Date,
  completedAt: Date,      // auto-set when status → completed
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Team

```javascript
{
  name: String,           // required, 2-100 chars
  description: String,    // max 500 chars
  owner: ObjectId,        // ref: User
  members: [{
    user: ObjectId,       // ref: User
    role: String,         // lead | member
    joinedAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔒 Security

- Passwords are **never stored in plain text** — bcrypt with 12 salt rounds
- JWT tokens are signed with a secret stored only in environment variables
- The `password` field is excluded from all queries by default (`select: false`)
- **Helmet.js** sets secure HTTP headers on every response
- **CORS** is restricted to the configured `CLIENT_URL` in production
- `express-validator` sanitizes and validates all user inputs
- Role checks (`authorize('admin')`) are applied at the route level
- Mongoose `CastError` (invalid ObjectId) is caught globally and returns a clean 400

---

## 🧪 Backend API Testing

A complete PowerShell test script is included at `backend/test-api.ps1`. It automatically creates users, projects, tasks, and teams, then validates all CRUD operations and RBAC rules.

**Before running the script:**

1. Start the backend server (`npm run dev`)
2. Manually create two users via signup — `admin@test.com` (set to admin in DB) and `member@test.com`

**Run the script:**

```powershell
cd backend
./test-api.ps1
```

The script tests all of the following scenarios and prints pass/fail output:

- Auth: signup, login, get-me, invalid credentials, validation errors
- Projects: create (admin), create (member → 403), get-all, get-by-id, update, add member, remove member
- Tasks: create (admin), get-all, get-my-tasks, get-by-project, update status (member), full update (admin), delete
- Teams: create, add member, update, get-all, get-by-id
- Dashboard: admin and member scoped responses
- Edge cases: invalid ObjectId (400), non-existent resource (404), member trying to delete (403)

---

## 🚀 Deployment — Railway

### One-Time Setup

1. Push your code to a **public GitHub repository**
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub Repo**
3. Select your repository

### Deploy the Backend

1. In Railway, add a **New Service** → GitHub Repo → select the repo
2. Set the **Root Directory** to `backend`
3. Railway auto-detects Node.js and uses `npm start`
4. Add the following **environment variables** in the Railway dashboard:

| Variable     | Value                                                    |
| ------------ | -------------------------------------------------------- |
| `MONGO_URI`  | Your MongoDB Atlas connection string                     |
| `JWT_SECRET` | A long random secret (32+ characters)                    |
| `JWT_EXPIRE` | `7d`                                                     |
| `NODE_ENV`   | `production`                                             |
| `CLIENT_URL` | Your frontend Railway URL (set after deploying frontend) |

5. Railway gives you a public URL like `https://taskmaster-backend.up.railway.app`

### Deploy the Frontend

1. Add another **New Service** → GitHub Repo → same repo
2. Set the **Root Directory** to `frontend`
3. Set **Build Command** to `npm run build`
4. Set **Start Command** to `npx serve dist -s`
5. Add environment variable:

| Variable       | Value                             |
| -------------- | --------------------------------- |
| `VITE_API_URL` | Your backend Railway URL + `/api` |

6. After frontend deploys, copy its public URL and **update** the backend's `CLIENT_URL` environment variable

### Verify Live Deployment

Visit your live frontend URL and confirm:

- Signup / login works
- Admin can create projects and tasks
- Member can log in and update task status
- Dashboard stats load correctly

---

## 📝 Available Scripts

### Backend

```bash
npm run dev     # Start with nodemon (auto-reload on file changes)
npm start       # Start in production mode
```

### Frontend

```bash
npm run dev     # Start Vite dev server (HMR enabled)
npm run build   # Build optimized production bundle → /dist
npm run preview # Preview the production build locally
```

---

## 🗺️ Application Workflow

```
User Registration
      ↓
   Login → JWT Token stored in localStorage
      ↓
   Dashboard (scoped by role)
      ↓
  ┌───────────────────────────────────┐
  │  ADMIN                MEMBER      │
  │  ─────                ──────      │
  │  Create Project       View        │
  │  Add Members     →   Project      │
  │  Create Tasks         Tasks       │
  │  Assign Tasks    →   Update       │
  │  Manage Teams         Status      │
  └───────────────────────────────────┘
      ↓
   Dashboard refreshes with new stats
```

---

## 🎨 UI Design System

The frontend uses a custom design system built on Tailwind CSS v4:

| Token           | Color     | Usage                              |
| --------------- | --------- | ---------------------------------- |
| `brand-dark`    | `#1F4E5F` | Sidebar, primary buttons, headings |
| `brand-muted`   | `#4D727E` | Secondary text, icons, borders     |
| `brand-primary` | `#79A8A9` | Active states, links, accents      |
| `brand-light`   | `#F4F7F7` | Page background                    |

**Glassmorphism card:** Used throughout the app — `rgba(255,255,255,0.7)` background with `backdrop-filter: blur(10px)` and subtle white border.

**Framer Motion** is used for page transitions, modal enter/exit animations, and card list animations with staggered delays.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push the branch: `git push origin feature/your-feature-name`
5. Open a **Pull Request** against `main`

Please follow the existing code style — async/await, ApiResponse helpers, express-validator for all inputs.

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 👤 Author

Developed by Mohit Bohra

---

<div align="center">

**If this project helped you, please give it a ⭐ on GitHub!**

</div>
