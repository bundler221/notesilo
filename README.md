# Notesilo - A Note-Taking Application

A modern note-taking application built with React (frontend) and Node.js (backend), with MongoDB for data storage.

## 🚀 Quick Start with Docker

The easiest way to run Notesilo is using Docker and Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your system
- Git

### Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd notesilo
   ```

2. **Start all services:**
   ```bash
   docker-compose up -d
   ```

3. **Access the application:**
   - Frontend: http://localhost:2000
   - Backend API: http://localhost:2001
   - MongoDB: localhost:27017

4. **Stop the application:**
   ```bash
   docker-compose down
   ```

### Docker Services

The application consists of the following services:

- **Frontend**: React application served by Nginx (Port 2000)
- **Backend**: Node.js Express API server (Port 2001)
- **MongoDB**: Database for storing user data and notes (Port 27017)

## 🔧 Local Development

If you prefer to develop locally without Docker:

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)
- Git

### Running the Application

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd notesilo
   ```

2. **Install dependencies:**
   ```bash
   # Backend dependencies
   cd backend
   npm install
   
   # Frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Set up environment variables:**
   
   **Backend (.env):**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/notesilo
   JWT_SECRET=your-super-secret-jwt-key
   CORS_ORIGIN=http://localhost:2000
   ```
   
   **Frontend (.env):**
   ```env
   VITE_API_URL=http://localhost:2001
   ```

4. **Start the services:**
   
   **Start MongoDB (if running locally):**
   ```bash
   mongod
   ```
   
   **Start the backend:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Start the frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

5. **Access the application:**
   - Frontend: http://localhost:2000
   - Backend API: http://localhost:2001

## 📁 Project Structure

```
notesilo/
├── frontend/                 # React frontend application
│   ├── src/                 # Source code
│   ├── public/              # Static assets
│   ├── Dockerfile           # Frontend Docker configuration
│   ├── nginx.conf           # Nginx configuration
│   ├── .dockerignore        # Docker ignore file
│   ├── package.json         # Frontend dependencies
│   └── vite.config.js       # Vite configuration
├── backend/                 # Node.js backend API
│   ├── controllers/         # Route controllers
│   ├── model/              # Data models
│   ├── routes/             # API routes
│   ├── middlewares/        # Custom middlewares
│   ├── utils/              # Utility functions
│   ├── Dockerfile          # Backend Docker configuration
│   ├── .dockerignore       # Docker ignore file
│   ├── package.json        # Backend dependencies
│   └── index.js            # Backend entry point
├── docker-compose.yml      # Docker Compose configuration
├── mongo-init.js          # MongoDB initialization script
└── README.md              # This file
```

## 🔧 Development Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 📝 API Documentation

### Authentication Routes

| Route                       | Method | Description                                        | Protected        |
| --------------------------- | ------ | -------------------------------------------------- | ---------------- |
| `/api/auth/register`        | POST   | Register a new user with email/username & password | ❌               |
| `/api/auth/login`           | POST   | Login user and receive JWT token                   | ❌               |
| `/api/auth/me`              | GET    | Get current logged-in user details                 | ✅ (JWT required) |
| `/api/auth/update-profile`  | PUT    | Update username (and other profile fields)         | ✅ (JWT required) |
| `/api/auth/update-password` | PUT    | Update user password (email/password users only)   | ✅ (JWT required) |
| `/api/auth/delete-account`  | DELETE | Delete current user account                        | ✅ (JWT required) |

### Notes Routes

| Route        | Method | Description                           | Protected        |
| ------------ | ------ | ------------------------------------- | ---------------- |
| `/api/notes` | POST   | Create a new note                     | ✅ (JWT required) |
| `/api/notes` | GET    | Get all notes of the logged-in user   | ✅ (JWT required) |

### 🔑 Authentication

For all protected routes, include the header:

```
Authorization: Bearer <JWT_TOKEN>
```

## 🛠️ Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/notesilo
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:2000
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
VITE_API_URL=http://localhost:2001
```

## � Docker Commands

### Useful Docker Commands

- **View logs for all services:**
  ```bash
  docker-compose logs -f
  ```

- **View logs for a specific service:**
  ```bash
  docker-compose logs -f backend
  docker-compose logs -f frontend
  ```

- **Rebuild a specific service:**
  ```bash
  docker-compose up -d --build backend
  ```

- **Execute commands in a container:**
  ```bash
  docker-compose exec backend sh
  docker-compose exec frontend sh
  ```

- **Remove all containers and volumes:**
  ```bash
  docker-compose down -v
  ```

## �� Troubleshooting

### Common Issues

1. **Port conflicts:** Make sure ports 2000, 2001, and 27017 are not already in use.

2. **MongoDB connection issues:** Check if MongoDB is running and accessible.

3. **Build failures:** Ensure all dependencies are properly installed and Node.js version is compatible.

4. **Permission issues:** On Linux/Mac, you might need to adjust file permissions for the MongoDB data directory.

### Health Checks

All services include health checks. You can view their status with:

```bash
docker-compose ps
```

## 📚 Technologies Used

### Frontend
- React 19
- Vite
- TailwindCSS
- React Router
- Axios
- Various UI libraries (Heroicons, Lucide React, etc.)

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- Passport.js
- bcrypt
- Various utility libraries

### DevOps
- Docker
- Docker Compose
- Nginx

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

💡 **Notes:**

* Requests tested using **Postman / Thunder Client**.
* Notes content can be plain text or Markdown.
* For production deployment, remember to change all default passwords and secrets.
* Always use HTTPS in production environments.
