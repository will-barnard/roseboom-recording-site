# Roseboom Recording Site - Setup Guide

This project now includes a Node.js backend with admin capabilities for managing featured projects and videos.

## 🏗️ Project Structure

```
roseboom-recording-site/
├── backend/          # Node.js Express API
│   ├── database/     # Database setup and connection
│   ├── middleware/   # Authentication middleware
│   ├── routes/       # API routes
│   ├── uploads/      # Uploaded images
│   └── server.js     # Main server file
├── vue/              # Vue.js frontend
└── java/             # Original Java backend (can be removed if not needed)
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. **IMPORTANT**: Edit `.env` and change `JWT_SECRET` to a secure random string:
```env
JWT_SECRET=your-very-secure-random-string-here
```

5. Initialize the database:
```bash
npm run init-db
```

This creates an admin user:
- Username: `admin`
- Password: `admin123`

6. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Vue directory:
```bash
cd vue
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will typically run on `http://localhost:5173`

## 🔐 Admin Access

The admin login page is **intentionally not linked** anywhere on the public site. To access it:

1. Go directly to: `http://localhost:5173/secret-admin-login`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. **Change the password immediately after first login!**

To change the admin password, you can either:
- Create a new admin user via the register endpoint
- Directly modify the database
- Add a password change feature to the admin dashboard (future enhancement)

## 📋 Features

### Admin Dashboard

Once logged in, admins can:

#### Manage Featured Projects
- ✅ Add new projects with cover images
- ✅ Edit project details (title, description, role, year, URL)
- ✅ Upload/change cover images (max 5MB)
- ✅ Delete projects
- ✅ Reorder projects with up/down buttons

#### Manage Videos
- ✅ Add video URLs (YouTube, Vimeo, or any embed URL)
- ✅ Edit video details
- ✅ Delete videos
- ✅ Reorder videos with up/down buttons

### Public Pages

- **Featured Projects**: Now loads dynamically from the API
- **Videos**: Now loads dynamically from the API
- All other pages remain the same

## 🔧 Configuration

### Backend Environment Variables

Edit `backend/.env`:

```env
PORT=3000                              # Server port
JWT_SECRET=change-this-in-production  # MUST change in production!
JWT_EXPIRES_IN=7d                      # Token expiration
NODE_ENV=development                   # Environment
```

### Frontend Environment Variables

The Vue app automatically uses `http://localhost:3000/api` in development.

For production, create `vue/.env.production`:
```env
VITE_API_URL=https://your-api-domain.com/api
```

## 📁 File Storage

Project cover images are stored in `backend/uploads/`. When deploying to production:

1. Ensure this directory has write permissions
2. Consider using a CDN or cloud storage (S3, Cloudinary, etc.) for production
3. The existing static images in `vue/public/img/` are preserved for backward compatibility

## 🚢 Deployment

### Backend

1. Set production environment variables
2. Change `JWT_SECRET` to a secure value
3. Run `npm start` (not `npm run dev`)
4. Consider using PM2 or similar for process management
5. Set up nginx or Apache as reverse proxy

### Frontend

1. Build the Vue app:
```bash
cd vue
npm run build
```

2. Serve the `dist` folder with any static hosting service
3. Update `VITE_API_URL` to point to your production API

### Database

The SQLite database (`backend/database.sqlite`) contains all data. For production:

1. Back it up regularly
2. Consider migrating to PostgreSQL or MySQL for better performance/scalability
3. The database structure is simple and can be easily migrated

## 🔒 Security Notes

1. **Change the default admin password immediately**
2. **Never commit `.env` to version control** (already in `.gitignore`)
3. The admin login URL (`/secret-admin-login`) is not linked publicly, but security through obscurity is not enough - always use strong passwords
4. Consider adding rate limiting to auth endpoints in production
5. Consider adding HTTPS in production
6. Review CORS settings in `backend/server.js` for production

## 📚 API Documentation

See [backend/README.md](backend/README.md) for full API documentation.

## 🐛 Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Ensure `.env` file exists
- Run `npm install` to ensure all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 3000
- Check browser console for CORS errors
- Verify `VITE_API_URL` in `.env.development`

### Images not uploading
- Check `backend/uploads/` directory exists and has write permissions
- Verify image is under 5MB and is JPG/PNG/GIF format
- Check backend logs for errors

### Can't login to admin
- Verify you've run `npm run init-db` in the backend
- Check backend logs for authentication errors
- Ensure JWT_SECRET is set in backend `.env`

## 🎯 Next Steps (Optional Enhancements)

- [ ] Add password change functionality for admin
- [ ] Add multiple admin user support
- [ ] Add image cropping/resizing
- [ ] Migrate to PostgreSQL for production
- [ ] Add search/filter to admin dashboard
- [ ] Add analytics to track views
- [ ] Add contact form backend
- [ ] Set up automated backups

## 📞 Support

For issues or questions, refer to the README files in each directory:
- [Backend README](backend/README.md)
- [Frontend README](vue/README.md)
