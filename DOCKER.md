# Roseboom Recording Site - Docker Setup

## Quick Start

### Development Mode (with hot reload)

```bash
# Start all services
docker-compose -f docker-compose.dev.yml up

# Or run in background
docker-compose -f docker-compose.dev.yml up -d

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop services
docker-compose -f docker-compose.dev.yml down
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Admin Login: http://localhost:5173/secret-admin-login

### Production Mode

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## Initial Setup

### 1. Create Environment File

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and set a secure JWT_SECRET:
```env
JWT_SECRET=your-very-secure-random-string-here
PORT=3000
JWT_EXPIRES_IN=7d
NODE_ENV=production
```

### 2. Initialize Database

Before first run, initialize the database:

```bash
# If not using Docker yet
cd backend
npm install
npm run init-db
cd ..

# Or inside the running container
docker-compose exec backend npm run init-db
```

This creates the admin user:
- Username: `admin`
- Password: `admin123`

**IMPORTANT**: Change the password after first login!

### 3. Start the Application

```bash
# Development mode (recommended for development)
docker-compose -f docker-compose.dev.yml up -d

# Production mode
docker-compose up -d
```

## Docker Commands Reference

### Build Services
```bash
# Rebuild all services
docker-compose build

# Rebuild specific service
docker-compose build backend
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Manage Services
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, networks, and volumes
docker-compose down -v

# Restart specific service
docker-compose restart backend
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend

# Last 100 lines
docker-compose logs --tail=100 backend
```

### Execute Commands in Containers
```bash
# Access backend shell
docker-compose exec backend sh

# Access frontend shell
docker-compose exec frontend sh

# Run npm commands
docker-compose exec backend npm install new-package
docker-compose exec frontend npm install new-package

# Initialize database
docker-compose exec backend npm run init-db
```

### View Running Containers
```bash
docker-compose ps
```

## Project Structure in Docker

```
roseboom-recording-site/
├── docker-compose.yml           # Production configuration
├── docker-compose.dev.yml       # Development configuration
├── backend/
│   ├── Dockerfile              # Backend production Dockerfile
│   ├── .env                    # Backend environment variables
│   ├── database.sqlite         # SQLite database (persisted)
│   └── uploads/                # Uploaded images (persisted)
└── vue/
    ├── Dockerfile              # Frontend production Dockerfile
    └── Dockerfile.dev          # Frontend development Dockerfile
```

## Volumes and Data Persistence

The following data is persisted outside containers:

### Development Mode
- `./backend` → `/app` (live code reload)
- `./vue` → `/app` (live code reload)
- `./backend/database.sqlite` → `/app/database.sqlite` (database)
- `./backend/uploads` → `/app/uploads` (uploaded images)

### Production Mode
- `./backend/database.sqlite` → `/app/database.sqlite` (database)
- `./backend/uploads` → `/app/uploads` (uploaded images)

## Networking

All services communicate through the `roseboom-network` bridge network:
- Backend is accessible to frontend via `http://backend:3000`
- Both services are accessible from host via their exposed ports

## Environment Variables

### Backend
Set in `backend/.env`:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - **REQUIRED** - Secret for JWT tokens
- `JWT_EXPIRES_IN` - Token expiration (default: 7d)
- `NODE_ENV` - Environment (development/production)

### Frontend
Set in docker-compose:
- `VITE_API_URL` - Backend API URL (default: http://localhost:3000/api)

## Troubleshooting

### Port Already in Use
If you get port errors:
```bash
# Stop conflicting services
docker-compose down

# Or change ports in docker-compose.yml
```

### Database Not Initialized
```bash
# Initialize database in running container
docker-compose exec backend npm run init-db
```

### Container Won't Start
```bash
# View logs for errors
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

### Changes Not Reflecting (Dev Mode)
```bash
# Restart the service
docker-compose restart frontend
docker-compose restart backend
```

### Clear Everything and Start Fresh
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove images
docker-compose down --rmi all

# Rebuild and start
docker-compose build
docker-compose up -d
```

## Production Deployment

For production deployment:

1. **Update Environment Variables**
   ```bash
   # Set secure JWT_SECRET in backend/.env
   JWT_SECRET=$(openssl rand -base64 32)
   ```

2. **Build Production Images**
   ```bash
   docker-compose build
   ```

3. **Update API URL**
   Edit `docker-compose.yml` to set production API URL:
   ```yaml
   frontend:
     environment:
       - VITE_API_URL=https://api.yourdomain.com/api
   ```

4. **Use Reverse Proxy**
   Consider using nginx or Traefik as a reverse proxy for:
   - SSL/TLS termination
   - Domain routing
   - Load balancing

5. **Set up Backups**
   - Backup `backend/database.sqlite` regularly
   - Backup `backend/uploads/` directory

## Development Workflow

1. Start development environment:
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. Make code changes (hot reload enabled for both frontend and backend)

3. View logs to debug:
   ```bash
   docker-compose -f docker-compose.dev.yml logs -f
   ```

4. Stop when done:
   ```bash
   docker-compose -f docker-compose.dev.yml down
   ```

## Security Notes

- Change default admin password immediately
- Use strong JWT_SECRET in production
- Never commit `.env` files to version control
- Keep Docker images updated
- Use HTTPS in production
- Set up proper firewall rules

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- See [SETUP.md](SETUP.md) for non-Docker setup instructions
- See [backend/README.md](backend/README.md) for API documentation
