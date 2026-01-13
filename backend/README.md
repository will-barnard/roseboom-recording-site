# Roseboom Recording Backend

This is the Node.js backend API for the Roseboom Recording site.

## Features

- JWT-based authentication
- RESTful API for managing featured projects
- RESTful API for managing videos
- Image upload support for project covers
- SQLite database
- Protected admin endpoints

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update the `.env` file with your configuration, especially:
   - `JWT_SECRET`: Change this to a secure random string
   - `PORT`: Default is 3000

4. Initialize the database:
```bash
npm run init-db
```

This will create the database with tables and seed an admin user:
- Username: `admin`
- Password: `admin123`

**IMPORTANT**: Change the admin password after first login!

## Running the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:3000` (or the port specified in `.env`).

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/verify` - Verify token validity

### Projects (Featured Work)
- `GET /api/projects` - Get all projects (public)
- `GET /api/projects/:id` - Get single project (public)
- `POST /api/projects` - Create project (requires auth)
- `PUT /api/projects/:id` - Update project (requires auth)
- `DELETE /api/projects/:id` - Delete project (requires auth)
- `POST /api/projects/reorder` - Reorder projects (requires auth)

### Videos
- `GET /api/videos` - Get all videos (public)
- `GET /api/videos/:id` - Get single video (public)
- `POST /api/videos` - Create video (requires auth)
- `PUT /api/videos/:id` - Update video (requires auth)
- `DELETE /api/videos/:id` - Delete video (requires auth)
- `POST /api/videos/reorder` - Reorder videos (requires auth)

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Uploads

Project cover images are uploaded to the `/uploads` directory and served statically via `/uploads/:filename`.

Supported formats: JPG, PNG, GIF
Maximum file size: 5MB

## Database

The application uses SQLite with the following tables:
- `users` - Admin users
- `projects` - Featured projects
- `videos` - Video URLs

Database file: `database.sqlite`

## Project Structure

```
backend/
├── database/
│   ├── db.js              # Database connection
│   └── init-db.js         # Database initialization
├── middleware/
│   └── auth.js            # JWT authentication middleware
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── projects.js        # Projects routes
│   └── videos.js          # Videos routes
├── uploads/               # Uploaded images
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Main server file
```

## Development

The backend is designed to work with the Vue.js frontend. Make sure to:

1. Update CORS settings in `server.js` if deploying to production
2. Set `VITE_API_URL` in the Vue frontend to point to this backend
3. Keep the JWT_SECRET secure and never commit it to version control
