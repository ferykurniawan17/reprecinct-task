#!/bin/bash

# Amplify Deployment Troubleshooting Script
# This script helps diagnose common issues with Amplify deployments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "🔍 Amplify Deployment Troubleshooting..."
echo ""

# Check if we're in the right directory
if [ ! -f "packages/frontend/package.json" ]; then
    print_error "Not in the correct project directory. Please run from the project root."
    exit 1
fi

# Test local build
print_info "Testing local Next.js build..."
cd packages/frontend

print_info "Installing dependencies..."
yarn install

print_info "Building Next.js application..."
if yarn build; then
    print_success "Local build successful"
else
    print_error "Local build failed - check your code for errors"
    exit 1
fi

# Check build output
print_info "Checking build output..."
if [ -d ".next" ]; then
    print_success ".next directory exists"
    
    # Check for static files
    if [ -d ".next/static" ]; then
        print_success "Static files generated"
    else
        print_warning "No static files found"
    fi
    
    # Check for app directory build
    if [ -d ".next/server/app" ]; then
        print_success "App Router build found"
    else
        print_warning "App Router build not found"
    fi
    
    # List build contents
    print_info "Build directory contents:"
    ls -la .next/
    
else
    print_error ".next directory not found"
    exit 1
fi

# Check for Next.js export compatibility
print_info "Checking Next.js configuration..."
if grep -q "output.*export" next.config.js 2>/dev/null; then
    print_info "Static export configuration found"
else
    print_info "Using server-side rendering (default)"
fi

# Test local server
print_info "Testing local server..."
if command -v npx &> /dev/null; then
    echo "Starting Next.js server for 5 seconds..."
    timeout 5s yarn start &>/dev/null && print_success "Local server starts successfully" || print_warning "Local server test timed out (this is normal)"
else
    print_warning "npx not found, skipping server test"
fi

cd ../../

echo ""
print_info "📋 Common 404 Issues and Solutions:"
echo ""
echo "1. 🔧 Build Artifacts Issue:"
echo "   - Check if .next directory is properly included in artifacts"
echo "   - Verify baseDirectory is set correctly"
echo ""
echo "2. 🌐 Next.js App Router Issue:"
echo "   - Ensure your pages are in src/app/ directory"
echo "   - Check if page.tsx files exist in route directories"
echo ""
echo "3. 🔄 Cache Issue:"
echo "   - Clear Amplify build cache"
echo "   - Redeploy from Amplify console"
echo ""
echo "4. 🚀 Environment Variables:"
echo "   - Check if NEXT_PUBLIC_API_URL is set correctly"
echo "   - Verify all required environment variables"
echo ""
echo "5. 📁 File Structure Issue:"
echo "   - Ensure src/app/page.tsx exists (homepage)"
echo "   - Check if layout.tsx is present"
echo ""

print_info "🔧 Recommended Next Steps:"
echo ""
echo "1. Update your amplify.yml with the corrected configuration"
echo "2. Clear build cache in Amplify console"
echo "3. Trigger a new deployment"
echo "4. Check Amplify build logs for specific errors"
echo ""

print_success "Troubleshooting completed!"

echo ""
echo "🌐 If the issue persists, check:"
echo "- Amplify Console → Your App → Build settings"
echo "- Environment variables in Amplify Console"
echo "- Build logs for specific error messages"
