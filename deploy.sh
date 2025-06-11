#!/bin/bash

# Exit on error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Load environment variables
if [ -f .env ]; then
    print_message "Loading environment variables from .env file..." "${YELLOW}"
    source .env
else
    print_message "No .env file found. Using default values where available." "${YELLOW}"
fi

# Check required environment variables
print_message "Checking required environment variables..." "${YELLOW}"

# Required variables
required_vars=("JWT_SECRET" "SMS_API_KEY" "SMS_SENDER_ID")

# Optional variables with defaults
optional_vars=(
    "JWT_EXPIRATION=24h"
    "CORS_ORIGIN=http://localhost:3000"
    "RATE_LIMIT_TTL=60"
    "RATE_LIMIT_MAX=100"
)

# Check required variables
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_message "Error: $var is not set" "${RED}"
        exit 1
    fi
done

# Set optional variables if not set
for var in "${optional_vars[@]}"; do
    IFS='=' read -r name default_value <<< "$var"
    if [ -z "${!name}" ]; then
        print_message "Setting default value for $name: $default_value" "${YELLOW}"
        export "$name=$default_value"
    fi
done

# Pull latest changes if in a git repository
if [ -d .git ]; then
    print_message "Pulling latest changes..." "${YELLOW}"
    git pull origin main
fi

# Install dependencies if package.json exists
if [ -f package.json ]; then
    print_message "Installing dependencies..." "${YELLOW}"
    npm ci

    print_message "Generating Prisma client..." "${YELLOW}"
    npx prisma generate

    print_message "Building application..." "${YELLOW}"
    npm run build
fi

# Stop and remove existing containers
print_message "Cleaning up existing containers..." "${YELLOW}"
docker-compose down --remove-orphans

# Build and start containers
print_message "Building and starting containers..." "${YELLOW}"
docker-compose up -d --build

# Wait for database to be ready
print_message "Waiting for database to be ready..." "${YELLOW}"
until docker-compose exec db pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done

# Run database migrations
print_message "Running database migrations..." "${YELLOW}"
docker-compose exec api npx prisma migrate deploy

# Wait for services to be healthy
print_message "Waiting for services to be healthy..." "${YELLOW}"
sleep 10

# Check if services are healthy
if ! docker-compose ps | grep -q "healthy"; then
    print_message "Error: Services are not healthy" "${RED}"
    exit 1
fi

# Check if the API is healthy
print_message "Checking API health..." "${YELLOW}"
until curl -s http://localhost:3000/health > /dev/null; do
    sleep 1
done

print_message "Deployment completed successfully!" "${GREEN}"
print_message "API is available at: http://localhost:3000" "${GREEN}"
print_message "API documentation is available at: http://localhost:3000/api" "${GREEN}" 