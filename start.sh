#!/bin/bash

# Roseboom Recording Site - Quick Start Script

echo "🎸 Roseboom Recording Site - Quick Start"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/get-started"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Check if .env files exist
if [ ! -f ".env" ]; then
    echo "📝 Creating root .env file..."
    cp .env.example .env
    JWT_SECRET=$(openssl rand -base64 32)
    echo "JWT_SECRET=$JWT_SECRET" >> .env
    echo "✅ Created .env"
fi

if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/.env.example backend/.env
    JWT_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/your-secret-key-change-this-in-production/$JWT_SECRET/" backend/.env
    rm backend/.env.bak 2>/dev/null
    echo "✅ Created backend/.env with secure JWT secret"
fi

echo ""
echo "🔧 Building Docker containers..."
docker-compose -f docker-compose.dev.yml build

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 5

echo ""
echo "📊 Initializing database..."
docker-compose -f docker-compose.dev.yml exec -T backend npm run init-db

echo ""
echo "✨ Setup complete!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend:    http://localhost:5173"
echo "   Backend API: http://localhost:3000"
echo "   Admin Login: http://localhost:5173/secret-admin-login"
echo ""
echo "🔐 Default Admin Credentials:"
echo "   Username: admin"
echo "   Password: admin123"
echo "   ⚠️  CHANGE THIS PASSWORD AFTER FIRST LOGIN!"
echo ""
echo "📝 Useful commands:"
echo "   View logs:      docker-compose -f docker-compose.dev.yml logs -f"
echo "   Stop services:  docker-compose -f docker-compose.dev.yml down"
echo "   Restart:        docker-compose -f docker-compose.dev.yml restart"
echo ""
echo "📚 For more information, see DOCKER.md"
