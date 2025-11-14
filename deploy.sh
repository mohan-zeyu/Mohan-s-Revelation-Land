#!/bin/bash

echo "🚀 Starting deployment..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Install dependencies
echo "${YELLOW}📦 Installing dependencies...${NC}"
npm run install:all

# Build frontend and backend
echo "${YELLOW}🔨 Building application...${NC}"
npm run build

# Initialize database if it doesn't exist
if [ ! -f "backend/data/blog.db" ]; then
    echo "${YELLOW}🗄️  Initializing database...${NC}"
    cd backend && npm run init-db && cd ..
fi

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "${YELLOW}⚠️  Warning: backend/.env not found. Creating from example...${NC}"
    cp backend/.env.example backend/.env
    echo "${YELLOW}⚠️  Please edit backend/.env with your production settings!${NC}"
fi

echo "${GREEN}✅ Build completed successfully!${NC}"
echo ""
echo "To start the application:"
echo "  Development: npm run dev"
echo "  Production:  pm2 start ecosystem.config.js"
echo ""
echo "Default admin credentials:"
echo "  Username: admin"
echo "  Password: admin123"
echo "  ${YELLOW}⚠️  CHANGE THESE IMMEDIATELY!${NC}"
