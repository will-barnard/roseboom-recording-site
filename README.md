# Roseboom Recording Site

A modern recording studio website with admin management capabilities built with Vue.js frontend and Node.js backend.

Website for Roseboom Recording, recording studio in Chicago, IL

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# 1. Create environment file
cp .env.example .env

# 2. Create backend environment file
cp backend/.env.example backend/.env
# Edit backend/.env and set a secure JWT_SECRET

# 3. Start with Docker Compose (Development)
docker-compose -f docker-compose.dev.yml up -d

# 4. Initialize the database (first time only)
docker-compose -f docker-compose.dev.yml exec backend npm run init-db
```

Access the site:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Login**: http://localhost:5173/secret-admin-login
  - Username: `admin`
  - Password: `admin123`

**Full Docker documentation**: See [DOCKER.md](DOCKER.md)

### Manual Setup (Without Docker)

See [SETUP.md](SETUP.md) for detailed manual installation instructions.

## 📋 Features

### Public Site
- **Featured Projects**: Dynamic gallery of recording projects
- **Video Showcase**: Embedded video player for portfolio videos
- **Contact Page**: Information and contact details
- **Responsive Design**: Mobile-friendly layout

### Admin Dashboard
- **Secure Login**: JWT-based authentication (not publicly linked)
- **Project Management**: Add, edit, delete, and reorder featured projects
- **Image Upload**: Upload cover images for projects (max 5MB)
- **Video Management**: Add, edit, delete, and reorder portfolio videos
- **Order Control**: Drag-free ordering with up/down buttons

## 🛠️ Technology Stack

### Frontend
- Vue 3 (Composition API)
- Vue Router
- Vuex (State Management)
- Axios
- Vite

### Backend
- Node.js
- Express
- SQLite3
- JWT Authentication
- Multer (File Upload)
- bcryptjs

## 📚 Documentation

- **[DOCKER.md](DOCKER.md)** - Complete Docker setup and usage guide
- **[SETUP.md](SETUP.md)** - Manual installation without Docker
- **[backend/README.md](backend/README.md)** - Backend API documentation

## 🔒 Security

- Admin login is at `/secret-admin-login` (not linked publicly)
- JWT-based authentication
- Bcrypt password hashing
- Change default admin password after first login!

## 🚢 Deployment

### Development
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### Production
```bash
# Update JWT_SECRET in backend/.env
docker-compose up -d
```

See [DOCKER.md](DOCKER.md) for detailed deployment instructions.

## 📞 Support

For issues or questions:
1. Check [DOCKER.md](DOCKER.md) for Docker-specific issues
2. Check [SETUP.md](SETUP.md) for manual setup issues
3. Review logs: `docker-compose logs -f`

## 📝 License

Private project for Roseboom Recording.
