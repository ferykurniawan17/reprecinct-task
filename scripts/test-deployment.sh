#!/bin/bash

# Local deployment test script
# This script helps test the build process locally before deploying

set -e

echo "🧪 Testing local deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Test backend build
echo "🔧 Testing backend build..."
cd packages/backend-service

if [ ! -f ".env" ]; then
    print_warning "Backend .env file not found, copying from .env.example"
    cp .env.example .env
fi

print_status "Installing backend dependencies..."
npm install

print_status "Generating Prisma client..."
npx prisma generate

print_status "Building backend TypeScript..."
npm run build

print_status "Backend build successful!"

# Test frontend build
echo "🎨 Testing frontend build..."
cd ../frontend

if [ ! -f ".env.local" ]; then
    print_warning "Frontend .env.local file not found, creating with default values"
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > .env.local
fi

print_status "Installing frontend dependencies..."
npm install

print_status "Running type check..."
npm run type-check

print_status "Running linter..."
npm run lint

print_status "Building frontend application..."
npm run build

print_status "Frontend build successful!"

# Test Docker build (optional)
echo "🐳 Testing Docker build..."
cd ../backend-service

if command -v docker &> /dev/null; then
    print_status "Building Docker image..."
    docker build -t reprecinct-backend-test .
    print_status "Docker build successful!"
    
    # Clean up test image
    docker rmi reprecinct-backend-test
else
    print_warning "Docker not found, skipping Docker build test"
fi

cd ../../

echo ""
print_status "🎉 All build tests passed!"
echo ""
echo "📋 Next steps for deployment:"
echo "1. Set up AWS infrastructure using: ./scripts/setup-aws-infrastructure.sh"
echo "2. Configure environment variables in AWS Amplify Console"
echo "3. Connect GitHub repository to Amplify apps"
echo "4. Push to main branch to trigger deployment"
echo ""
