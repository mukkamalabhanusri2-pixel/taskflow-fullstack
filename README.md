# 🚀 TaskFlow — Full-Stack Task Management Application

A modern, production-ready task management SaaS application built with the MERN stack (MongoDB, Express.js, React.js, Node.js), featuring JWT authentication, real-time updates via Socket.IO, and a polished professional UI.

---

## 📁 Complete Folder Structure

Paste this **exactly** into VS Code:

```
taskflow/
│
├── backend/                          # Node.js + Express API Server
│   ├── config/
│   │   └── db.js                     # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # Register, login, profile logic
│   │   └── taskController.js         # Task CRUD + stats logic
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT protect + role authorize
│   │   └── validationMiddleware.js   # Input validation rules
│   ├── models/
│   │   ├── User.js                   # User schema (bcrypt + JWT)
│   │   └── Task.js                   # Task schema with indexes
│   ├── routes/
│   │   ├── authRoutes.js             # /api/auth/*
│   │   ├── taskRoutes.js             # /api/tasks/*
│   │   └── userRoutes.js             # /api/users/* (admin)
│   ├── utils/
│   │   └── seed.js                   # DB seed script (demo data)
│   ├── .env.example                  # Environment variable template
│   ├── package.json
│   └── server.js                     # App entry point + Socket.IO
│
├── frontend/                         # React.js Application
│   ├── public/
│   │   └── index.html                # HTML template + Google Fonts
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                 # (reserved for future auth components)
│   │   │   ├── dashboard/            # (reserved for future dashboard widgets)
│   │   │   ├── layout/
│   │   │   │   ├── AppLayout.jsx     # Main layout wrapper
│   │   │   │   ├── Sidebar.jsx       # Navigation sidebar
│   │   │   │   └── Header.jsx        # Top header + theme toggle
│   │   │   ├── tasks/
│   │   │   │   ├── TaskCard.jsx      # Individual task card
│   │   │   │   ├── TaskFormModal.jsx # Create/Edit modal
│   │   │   │   └── TaskFilters.jsx   # Search + filter bar
│   │   │   └── ui/
│   │   │       └── LoadingScreen.jsx # Spinner, EmptyState, Badges, etc.
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # Global auth state
│   │   │   └── ThemeContext.jsx      # Dark/light mode
│   │   ├── hooks/
│   │   │   └── useTasks.js           # Task state + CRUD hook
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx         # Login form
│   │   │   ├── RegisterPage.jsx      # Registration form
│   │   │   ├── DashboardPage.jsx     # Stats + recent tasks
│   │   │   ├── TasksPage.jsx         # Full task list + CRUD
│   │   │   └── ProfilePage.jsx       # User profile + settings
│   │   ├── services/
│   │   │   └── api.js                # Axios instance + all API calls
│   │   ├── utils/                    # (reserved for helper functions)
│   │   ├── App.jsx                   # Router + route protection
│   │   ├── index.js                  # React DOM entry point
│   │   └── index.css                 # Tailwind + custom styles
│   ├── .env.example
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

---

## ⚡ Quick Start (Step-by-Step)

### Prerequisites

Make sure you have installed:
- **Node.js** v18+ → https://nodejs.org
- **MongoDB** (local) → https://www.mongodb.com/try/download/community  
  OR use **MongoDB Atlas** (free cloud) → https://cloud.mongodb.com
- **Git** → https://git-scm.com

---

### Step 1 — Clone / Download the Project

```bash
# If using git:
git clone https://github.com/yourname/taskflow.git
cd taskflow

# Or just extract the ZIP and open in VS Code
```

---

### Step 2 — Set Up the Backend

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# Create your .env file from the template
cp .env.example .env
```

Now **open `backend/.env`** and fill in your values:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/taskflow
JWT_SECRET=replace_this_with_a_long_random_secret_key_min32chars
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

> 💡 **MongoDB Atlas users**: Replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://username:password@cluster.mongodb.net/taskflow`

---

### Step 3 — Seed the Database (Optional but Recommended)

This creates a demo user + 10 sample tasks so you can explore immediately:

```bash
# From inside the backend/ folder:
npm run seed
```

Output you'll see:
```
✅ MongoDB Connected
🌱 Starting database seed...
🗑️  Cleared existing data
👤 Created demo user: demo@taskflow.com
✅ Created 10 sample tasks
🎉 Database seeded successfully!
📧 Demo login: demo@taskflow.com
🔑 Demo password: demo1234
```

---

### Step 4 — Start the Backend Server

```bash
# Development (auto-restarts on file changes):
npm run dev

# OR Production:
npm start
```

You should see:
```
🚀 TaskFlow Server running on port 5000
📡 Environment: development
🔗 Health check: http://localhost:5000/api/health
✅ MongoDB Connected: localhost
```

---

### Step 5 — Set Up the Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend folder
cd frontend

# Install all dependencies
npm install

# Create your .env file
cp .env.example .env
```

The default `frontend/.env` works out-of-the-box:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

---

### Step 6 — Start the Frontend

```bash
npm start
```

React will open your browser at **http://localhost:3000** automatically! 🎉

---

## 🔐 Demo Login Credentials

After running the seed script:

| Field    | Value                  |
|----------|------------------------|
| Email    | demo@taskflow.com      |
| Password | demo1234               |

> You can also click **"Try Demo Account"** on the login page to auto-fill credentials.

---

## 🌐 API Endpoints Documentation

Base URL: `http://localhost:5000/api`

### Authentication Routes

| Method | Endpoint                  | Auth Required | Description              |
|--------|---------------------------|---------------|--------------------------|
| POST   | `/auth/register`          | ❌            | Register new user        |
| POST   | `/auth/login`             | ❌            | Login + get JWT token    |
| GET    | `/auth/me`                | ✅            | Get current user profile |
| PUT    | `/auth/profile`           | ✅            | Update name/avatar       |
| PUT    | `/auth/change-password`   | ✅            | Change password          |

### Task Routes

| Method | Endpoint                  | Auth Required | Description                          |
|--------|---------------------------|---------------|--------------------------------------|
| GET    | `/tasks`                  | ✅            | Get all tasks (with filters)         |
| POST   | `/tasks`                  | ✅            | Create new task                      |
| GET    | `/tasks/stats`            | ✅            | Get dashboard statistics             |
| GET    | `/tasks/:id`              | ✅            | Get single task by ID                |
| PUT    | `/tasks/:id`              | ✅            | Update task                          |
| DELETE | `/tasks/:id`              | ✅            | Delete task                          |
| PATCH  | `/tasks/bulk-update`      | ✅            | Bulk update task statuses            |

### Query Parameters for GET `/tasks`

| Parameter | Values                              | Example                    |
|-----------|-------------------------------------|----------------------------|
| status    | pending, in-progress, completed     | `?status=pending`          |
| priority  | low, medium, high                   | `?priority=high`           |
| search    | any text                            | `?search=frontend`         |
| category  | any category name                   | `?category=Design`         |
| tag       | any tag name                        | `?tag=urgent`              |
| sortBy    | createdAt, dueDate, priority, title | `?sortBy=dueDate`          |
| order     | asc, desc                           | `?order=asc`               |
| page      | number                              | `?page=2`                  |
| limit     | number                              | `?limit=10`                |

### Example API Requests

**Register:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "mypassword123"
}
```

**Create Task:**
```json
POST /api/tasks
Authorization: Bearer <your_jwt_token>
{
  "title": "Design new homepage",
  "description": "Create wireframes and mockups",
  "status": "in-progress",
  "priority": "high",
  "category": "Design",
  "tags": ["design", "ui"],
  "dueDate": "2024-12-31"
}
```

---

## 🗄️ MongoDB Schema Design

### User Schema
```js
{
  name:      String (required, max 50),
  email:     String (required, unique, lowercase),
  password:  String (required, min 6, hashed with bcrypt salt=12),
  role:      Enum ['user', 'admin'] (default: 'user'),
  avatar:    String (URL),
  isActive:  Boolean (default: true),
  lastLogin: Date,
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Task Schema
```js
{
  title:       String (required, max 100),
  description: String (max 1000),
  status:      Enum ['pending', 'in-progress', 'completed'] (default: 'pending'),
  priority:    Enum ['low', 'medium', 'high'] (default: 'medium'),
  category:    String (default: 'General'),
  tags:        [String],
  dueDate:     Date,
  completedAt: Date (auto-set when status → completed),
  user:        ObjectId ref 'User' (required),
  isArchived:  Boolean (default: false),
  createdAt:   Date (auto),
  updatedAt:   Date (auto),
  // Virtual:
  isOverdue:   Boolean (computed)
}
```

---

## 🔧 Available Scripts

### Backend (`/backend`)
```bash
npm run dev      # Start with nodemon (hot reload)
npm start        # Start production server
npm run seed     # Seed database with demo data
```

### Frontend (`/frontend`)
```bash
npm start        # Start development server (port 3000)
npm run build    # Build for production
npm test         # Run tests
```

---

## 🧰 Tech Stack Summary

| Layer        | Technology              | Purpose                          |
|--------------|-------------------------|----------------------------------|
| Frontend     | React.js 18             | UI framework                     |
| Styling      | Tailwind CSS            | Utility-first CSS                |
| HTTP Client  | Axios                   | API requests + interceptors      |
| Routing      | React Router v6         | Client-side navigation           |
| Notifications| react-hot-toast         | Toast notifications              |
| Date Utils   | date-fns                | Date formatting                  |
| Backend      | Node.js + Express.js    | REST API server                  |
| Database     | MongoDB + Mongoose      | NoSQL database + ODM             |
| Auth         | JWT + bcryptjs          | Authentication + password hashing|
| Real-time    | Socket.IO               | WebSocket updates                |
| Validation   | express-validator       | Input validation                 |

---

## 🛡️ Security Features

- ✅ Passwords hashed with **bcrypt** (salt rounds: 12)
- ✅ **JWT tokens** with expiry (7 days)
- ✅ JWT verification **middleware** on all protected routes
- ✅ Users can only access **their own tasks** (scoped queries)
- ✅ **Input validation** on all routes (express-validator)
- ✅ **CORS** configured for specific origin
- ✅ Error messages don't leak stack traces in production
- ✅ **Role-based authorization** middleware (user/admin)

---

## 🚀 Production Deployment

### Backend (Railway / Render / Heroku)
1. Set environment variables in your platform dashboard
2. Set `NODE_ENV=production`
3. Update `MONGO_URI` to your Atlas connection string
4. Update `CLIENT_URL` to your deployed frontend URL
5. Deploy: `npm start`

### Frontend (Vercel / Netlify)
1. Set `REACT_APP_API_URL` to your deployed backend URL
2. Run: `npm run build`
3. Deploy the `build/` folder

---

## 🐛 Troubleshooting

**MongoDB connection refused?**
```bash
# Make sure MongoDB is running locally:
sudo systemctl start mongod        # Linux
brew services start mongodb-community  # Mac
# Or use MongoDB Atlas (cloud) instead
```

**Port 3000 or 5000 already in use?**
```bash
# Kill the process using the port:
lsof -i :5000
kill -9 <PID>
# Or change PORT in backend/.env
```

**CORS errors in browser?**
- Make sure `CLIENT_URL` in backend `.env` exactly matches your frontend URL
- Ensure backend is running before starting frontend

**`npm install` fails?**
```bash
# Clear npm cache:
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📄 License

MIT License — free for personal and commercial use.

---

Built with ❤️ using the MERN Stack
