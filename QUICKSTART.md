# Quick Start Guide

Get your personal blog up and running in minutes!

## Prerequisites

- Node.js v18 or higher
- npm or yarn

## Quick Setup

1. **Install all dependencies**
   ```bash
   npm run install:all
   ```

2. **Set up backend environment**
   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env` and change the JWT_SECRET:
   ```
   PORT=3000
   JWT_SECRET=change-this-to-a-long-random-string
   NODE_ENV=development
   ```

3. **Initialize the database**
   ```bash
   npm run init-db
   cd ..
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Admin Login: http://localhost:5173/login

## Default Admin Credentials

```
Username: admin
Password: admin123
```

**⚠️ IMPORTANT**: Change these credentials immediately after first login!

## What's Next?

1. Login to the admin panel at `/login`
2. Create your first blog post
3. Customize the site title in `frontend/src/lib/components/Header.svelte`
4. Add your content to the three sections:
   - **Dynamics**: Personal updates and life happenings
   - **Study Notes**: Learning materials and knowledge
   - **Daily Findings**: Interesting discoveries from everyday life

## Common Commands

```bash
# Development
npm run dev              # Run both frontend and backend
npm run dev:frontend     # Run only frontend
npm run dev:backend      # Run only backend

# Building
npm run build            # Build both frontend and backend
npm run build:frontend   # Build only frontend
npm run build:backend    # Build only backend

# Production
npm start                # Start production server (backend)
```

## Troubleshooting

### "Cannot connect to backend"
- Make sure backend is running on port 3000
- Check that you're running `npm run dev` from the root directory

### "Database not found"
- Run `cd backend && npm run init-db`

### "Port already in use"
- Frontend (5173) or Backend (3000) port might be in use
- Change the ports in the respective config files

## Need Help?

Check the full [README.md](README.md) for detailed documentation and deployment instructions.
