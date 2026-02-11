#!/bin/bash

# Deployment script for Roseboom Recording Site
# This script pulls latest changes from git and rebuilds the production environment

set -e  # Exit on any error

echo "=================================="
echo "Roseboom Recording Site Deployment"
echo "=================================="
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "Error: Not a git repository"
    exit 1
fi

# Pull latest changes from git
echo "📥 Pulling latest changes from git..."
git pull origin main || {
    echo "⚠️  Warning: Failed to pull from 'main' branch, trying 'master'..."
    git pull origin master || {
        echo "❌ Error: Failed to pull changes from git"
        exit 1
    }
}
echo "✅ Git pull completed"
echo ""

# Stop running containers
echo "🛑 Stopping running containers..."
docker-compose down || echo "⚠️  No containers were running"
echo ""

# Build and start containers
echo "🔨 Building and starting containers..."

# Create data directory for database
mkdir -p data

docker-compose build --no-cache
echo ""

echo "🚀 Starting containers..."
docker-compose up -d
echo ""

# Wait for containers to be ready
echo "⏳ Waiting for containers to be ready..."
sleep 3
echo ""

# Initialize database
echo "📊 Initializing database..."
docker-compose exec -T backend npm run init-db
echo ""

# Show container status
echo "📊 Container status:"
docker-compose ps
echo ""

# Show logs (last 20 lines)
echo "📋 Recent logs:"
docker-compose logs --tail=20
echo ""

echo "=================================="
echo "✅ Deployment completed successfully!"
echo "=================================="
echo ""
echo "You can view logs with: docker-compose logs -f"
echo "You can stop services with: docker-compose down"
