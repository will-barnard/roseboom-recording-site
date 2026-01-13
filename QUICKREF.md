# Quick Reference Guide

## 🚀 Start the Application

```bash
./start.sh
```

OR

```bash
docker-compose -f docker-compose.dev.yml up -d
```

## 🌐 Access URLs

- **Public Site**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Admin Login**: http://localhost:5173/secret-admin-login

## 🔐 Default Login

```
Username: admin
Password: admin123
```

## 📋 Common Commands

### View Logs
```bash
# All services
docker-compose -f docker-compose.dev.yml logs -f

# Backend only
docker-compose -f docker-compose.dev.yml logs -f backend

# Frontend only
docker-compose -f docker-compose.dev.yml logs -f frontend
```

### Stop/Start Services
```bash
# Stop
docker-compose -f docker-compose.dev.yml stop

# Start
docker-compose -f docker-compose.dev.yml start

# Restart
docker-compose -f docker-compose.dev.yml restart

# Stop and remove
docker-compose -f docker-compose.dev.yml down
```

### Database
```bash
# Reinitialize database
docker-compose -f docker-compose.dev.yml exec backend npm run init-db

# Access database directly
sqlite3 backend/database.sqlite
```

### Backend Shell
```bash
docker-compose -f docker-compose.dev.yml exec backend sh
```

### Frontend Shell
```bash
docker-compose -f docker-compose.dev.yml exec frontend sh
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check what's using port 3000
lsof -i :3000

# Check what's using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>
```

### Container Won't Start
```bash
# View logs
docker-compose -f docker-compose.dev.yml logs backend

# Rebuild without cache
docker-compose -f docker-compose.dev.yml build --no-cache backend
docker-compose -f docker-compose.dev.yml up -d
```

### Clear Everything
```bash
# Stop and remove everything
docker-compose -f docker-compose.dev.yml down -v

# Remove images
docker-compose -f docker-compose.dev.yml down --rmi all

# Start fresh
./start.sh
```

## 📝 Admin Tasks

### Change Admin Password
1. Login to admin dashboard
2. Register a new admin user via `/api/auth/register`
3. Use the new credentials

### Add a Project
1. Go to Admin Dashboard
2. Click "Manage Projects"
3. Click "+ Add New Project"
4. Fill in details and upload image
5. Click "Create Project"

### Reorder Projects
1. Go to Admin Dashboard → Manage Projects
2. Use ↑ and ↓ buttons to reorder
3. Changes save automatically

### Add a Video
1. Go to Admin Dashboard
2. Click "Manage Videos"
3. Click "+ Add New Video"
4. Paste YouTube/Vimeo URL
5. Click "Add Video"

## 📚 Documentation

- **[README.md](README.md)** - Quick overview
- **[DOCKER.md](DOCKER.md)** - Detailed Docker guide
- **[SETUP.md](SETUP.md)** - Manual setup (no Docker)
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Complete feature list
- **[backend/README.md](backend/README.md)** - API documentation

## 🎯 API Testing

### Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Projects
```bash
curl http://localhost:3000/api/projects
```

### Get Videos
```bash
curl http://localhost:3000/api/videos
```

## 🔧 Development

### Frontend Development
```bash
cd vue
npm install
npm run dev
```

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Both with Docker
```bash
docker-compose -f docker-compose.dev.yml up
```
Changes to code will hot-reload automatically!

## 🚢 Production Deployment

1. **Update JWT Secret**
   ```bash
   # Generate secure secret
   openssl rand -base64 32
   
   # Update in backend/.env
   JWT_SECRET=<generated-secret>
   ```

2. **Build and Deploy**
   ```bash
   docker-compose up -d
   ```

3. **Set up Reverse Proxy** (nginx/Traefik)
   - Configure SSL/TLS
   - Point domain to frontend
   - Proxy API requests to backend

4. **Change Admin Password**
   - Login immediately
   - Create new admin user
   - Delete default admin

## 📧 Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Review documentation
3. Rebuild containers: `docker-compose build --no-cache`
4. Start fresh: `./start.sh`
