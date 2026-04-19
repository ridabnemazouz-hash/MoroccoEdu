# Morocco Higher Education Platform - Setup Guide

## Overview
This is a full-featured educational content-sharing platform for Moroccan higher education institutions. Students can explore schools and academic structures, while professors can upload and manage educational content.

## Features Completed

### Backend
- ✅ JWT Authentication system (Login, Register, Profile)
- ✅ Role-based access control (Student, Professor, Admin)
- ✅ Academic hierarchy: School → Field → Semester → Module
- ✅ Resource management with Cloudinary file upload (PDF, Video, Image, Notes)
- ✅ Interaction system: Comments, Reactions (Like/Dislike), View tracking
- ✅ MySQL database with optimized schema and indexes
- ✅ Secure password hashing with bcrypt
- ✅ File upload validation and cloud storage

### Frontend
- ✅ React + Vite with modern UI
- ✅ Authentication context and protected routes
- ✅ Academic navigation system
- ✅ Resource display with interactions
- ✅ User profiles
- ✅ Toast notifications
- ✅ Responsive design
- ✅ Dark/Light theme support

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- Cloudinary account (for file uploads)

### 1. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE morocco_schools;
exit;

# Run schema
mysql -u root -p morocco_schools < database/schema.sql
```

### 2. Backend Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and Cloudinary keys

# Seed schools data
node scripts/seed.js

# Seed academic data (fields, semesters, modules)
node scripts/seed_academic.js
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Cloudinary Setup

1. Create a free account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Add them to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 5. Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=morocco_schools
DB_PORT=3306
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Running the Application

### Start Backend
```bash
node app.js
# or
npm start
```
Backend runs on: http://localhost:5000

### Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)

### Academic Navigation
- `GET /api/schools/:schoolId/fields` - Get fields for a school
- `GET /api/fields/:fieldId/semesters` - Get semesters for a field
- `GET /api/semesters/:semesterId/modules` - Get modules for a semester
- `GET /api/modules/:moduleId` - Get module details

### Resources (Protected routes marked with 🔒)
- `GET /api/modules/:moduleId/resources` - Get resources for a module
- `POST /api/modules/:moduleId/resources` 🔒 (Professor+) - Upload resource
- `GET /api/resources/:resourceId` - Get resource details
- `DELETE /api/resources/:resourceId` 🔒 (Owner/Admin) - Delete resource

### Interactions
- `GET /api/resources/:resourceId/comments` - Get comments
- `POST /api/resources/:resourceId/comments` 🔒 - Add comment
- `POST /api/resources/:resourceId/reactions` 🔒 - Add/Update reaction
- `DELETE /api/resources/:resourceId/reactions` 🔒 - Remove reaction
- `POST /api/resources/:resourceId/views` - Track view

## User Roles

### Student (Default)
- Browse schools, fields, semesters, modules
- View resources
- Comment on resources
- React (like/dislike) to resources

### Professor
- All student permissions
- Upload resources (PDF, Video, Image, Notes)
- Manage own resources

### Admin
- All professor permissions
- Manage all resources
- Manage users

## Database Schema

### Main Tables
- `schools` - Educational institutions
- `users` - Platform users with roles
- `roles` - User roles (student, professor, admin)
- `fields` - Fields of study per school
- `semesters` - Academic semesters per field
- `modules` - Course modules per semester
- `resources` - Educational content (PDFs, videos, images, notes)
- `comments` - User comments on resources
- `reactions` - Like/dislike reactions
- `views` - Resource view tracking

## Technology Stack

### Backend
- Node.js + Express
- MySQL (mysql2)
- JWT Authentication
- Bcrypt (password hashing)
- Multer (file upload)
- Cloudinary (cloud storage)

### Frontend
- React 19
- Vite
- React Router v7
- Axios
- Framer Motion (animations)
- Lucide React (icons)
- React Toastify (notifications)

## Next Steps (Future Enhancements)

- [ ] Rich text editor for notes
- [ ] Advanced search and filtering
- [ ] Resource download tracking
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Resource rating system (1-5 stars)
- [ ] Bookmark/favorite resources
- [ ] User profiles with avatars
- [ ] Social sharing
- [ ] Analytics dashboard for professors
- [ ] Mobile app (React Native)

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check credentials in `.env`
- Ensure database exists

### File Upload Issues
- Verify Cloudinary credentials
- Check file size limits (100MB max)
- Ensure correct file types

### Authentication Issues
- Clear localStorage if token is invalid
- Verify JWT_SECRET in `.env`
- Check expiration settings

## License
MIT

## Support
For issues or questions, please create an issue in the repository.
