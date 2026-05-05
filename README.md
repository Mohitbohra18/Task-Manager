# TaskMaster — Premium Task Management System

A production-ready, full-stack Task Management application built with Node.js, Express, MongoDB, and React. Featuring a premium glassmorphic UI, role-based access control, and real-time dashboard statistics.

## 🚀 Features
- **Premium UI/UX**: Modern glassmorphic design with Framer Motion animations.
- **Authentication**: Secure JWT-based auth with password hashing (bcrypt).
- **Role-Based Access Control (RBAC)**: Admin vs. Member permissions.
- **Project Management**: Create, track, and manage team projects with priorities and tags.
- **Task Management**: Assign tasks, update statuses, and track deadlines.
- **Team Collaboration**: Manage team members and roles.
- **Dynamic Dashboard**: Real-time aggregation of project and task statistics.

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS v4, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express 5, MongoDB, Mongoose.
- **Security**: JWT, Helmet, Morgan, Express-Validator.

## 📦 Project Structure
```text
Task Manager/
├── backend/            # Express Server
│   ├── src/
│   │   ├── controllers/ # Logic handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth & Error handlers
│   │   └── utils/       # Helpers
│   └── .env             # Server config
└── frontend/           # React App
    ├── src/
    │   ├── pages/       # Dashboard, Tasks, Projects
    │   ├── components/  # Layout, Protected Routes
    │   ├── context/     # Auth State
    │   └── services/    # API (Axios)
    └── .env             # Client config
```

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
# Create .env based on .env.example
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/taskmanager
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5175
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📝 API Documentation Summary
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login user | Public |
| GET | `/api/dashboard` | Get stats & recent data | Private |
| GET | `/api/projects` | List all projects | Private |
| POST | `/api/projects` | Create new project | Admin |
| GET | `/api/tasks` | List all tasks | Admin |
| GET | `/api/tasks/my-tasks` | List user's tasks | Private |
| PUT | `/api/tasks/:id` | Update task status | Private |

---

Developed with ❤️ by Antigravity AI.
