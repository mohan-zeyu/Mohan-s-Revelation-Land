# Personal Blog Website

A full-stack personal blog website built with Svelte (frontend) and Express (backend) using TypeScript. The blog features three main sections: Dynamics, Study Notes, and Daily Findings. It includes an admin panel for content management with authentication.

## Features

- **Comic Sans MS Font**: Unique, friendly typography throughout the site
- **Three Content Sections**:
  - Dynamics: Personal updates and life happenings
  - Study Notes: Learning materials and knowledge
  - Daily Findings: Interesting discoveries from everyday life
- **Admin Dashboard**: Secure content management system
- **Authentication**: Login system for admin access
- **Responsive Design**: Works on desktop and mobile devices
- **RESTful API**: Backend API for all data operations
- **SQLite Database**: Lightweight, file-based database

## Tech Stack

### Frontend
- SvelteKit
- TypeScript
- Vite
- CSS3

### Backend
- Express.js
- TypeScript
- SQLite (better-sqlite3)
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
.
├── frontend/               # Svelte frontend application
│   ├── src/
│   │   ├── routes/        # Page components
│   │   ├── lib/           # Shared components and utilities
│   │   └── app.css        # Global styles
│   └── package.json
│
├── backend/               # Express backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth middleware
│   │   ├── config/       # Database config
│   │   └── server.ts     # Main server file
│   └── package.json
│
└── package.json          # Root package.json
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Mohan-s-Revelation-Land
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` and set your values:
   ```
   PORT=3000
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=development
   ```

4. **Initialize the database**
   ```bash
   cd backend
   npm run init-db
   ```

   This will create the database and a default admin user:
   - Username: `admin`
   - Password: `admin123`

   **⚠️ IMPORTANT: Change the admin password after first login!**

## Development

Run both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Building for Production

1. **Build both frontend and backend**
   ```bash
   npm run build
   ```

2. **The frontend will be built to**: `frontend/build/`
3. **The backend will be compiled to**: `backend/dist/`

## Deployment

### Option 1: Deploy to Your Own Server (Linux)

1. **Prepare your server**
   - Ubuntu 20.04+ or similar Linux distribution
   - Node.js v18+ installed
   - nginx installed (optional, for reverse proxy)

2. **Transfer files to server**
   ```bash
   scp -r . user@your-server:/var/www/blog
   ```

3. **On your server, install dependencies and build**
   ```bash
   cd /var/www/blog
   npm run install:all
   npm run build
   ```

4. **Initialize the database**
   ```bash
   cd backend
   npm run init-db
   ```

5. **Set up environment variables**
   ```bash
   cd backend
   nano .env
   ```

   Set production values:
   ```
   PORT=3000
   JWT_SECRET=your-production-secret-key-very-long-and-random
   NODE_ENV=production
   ```

6. **Install PM2 for process management**
   ```bash
   npm install -g pm2
   ```

7. **Create a PM2 ecosystem file**

   Create `ecosystem.config.js` in the root directory:
   ```javascript
   module.exports = {
     apps: [
       {
         name: 'blog-backend',
         cwd: './backend',
         script: 'dist/server.js',
         env: {
           NODE_ENV: 'production'
         }
       },
       {
         name: 'blog-frontend',
         cwd: './frontend/build',
         script: 'index.js',
         env: {
           NODE_ENV: 'production',
           PORT: 5173
         }
       }
     ]
   };
   ```

8. **Start the application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

9. **Set up nginx reverse proxy (optional)**

   Create `/etc/nginx/sites-available/blog`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5173;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }

       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

10. **Set up SSL with Let's Encrypt (recommended)**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

### Option 2: Deploy with Docker

1. **Create Dockerfile for backend**

   Create `backend/Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   CMD ["npm", "start"]
   ```

2. **Create Dockerfile for frontend**

   Create `frontend/Dockerfile`:
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   CMD ["node", "build"]
   ```

3. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     backend:
       build: ./backend
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - JWT_SECRET=your-secret-key
       volumes:
         - ./backend/data:/app/data

     frontend:
       build: ./frontend
       ports:
         - "5173:5173"
       depends_on:
         - backend
   ```

4. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

## Admin Access

1. Navigate to `/login`
2. Login with default credentials:
   - Username: `admin`
   - Password: `admin123`
3. **Change your password immediately!**

To change the admin password, you can:
- Use the backend API directly
- Or modify the database using SQLite tools
- Or create a new admin user and delete the old one

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register new user (admin only)

### Posts (Public)
- `GET /api/posts` - Get all posts
- `GET /api/posts/category/:category` - Get posts by category
- `GET /api/posts/:id` - Get single post

### Posts (Admin - requires authentication)
- `POST /api/posts` - Create new post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

## Security Notes

1. **Change default admin credentials immediately**
2. **Use strong JWT_SECRET in production**
3. **Use HTTPS in production**
4. **Keep dependencies updated**
5. **Regular database backups**
6. **Set appropriate file permissions on server**

## Backup

The database is stored in `backend/data/blog.db`. Back it up regularly:

```bash
# Backup
cp backend/data/blog.db backend/data/blog.db.backup

# Or use SQLite backup command
sqlite3 backend/data/blog.db ".backup 'backup.db'"
```

## Troubleshooting

### Frontend can't connect to backend
- Check that backend is running on port 3000
- Check CORS settings in backend
- Verify API_URL in frontend configuration

### Database errors
- Ensure `backend/data/` directory exists
- Check file permissions
- Run `npm run init-db` to reinitialize

### Build errors
- Clear node_modules and reinstall
- Check Node.js version (v18+)
- Verify TypeScript is installed

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.