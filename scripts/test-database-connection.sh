#!/bin/bash

# Database Connection Test Script
# Tests connection to your AWS RDS PostgreSQL database

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

echo "🔍 Testing Database Connection..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL not set. Please provide it:"
    read -p "Enter DATABASE_URL: " DATABASE_URL
fi

# Extract connection details
DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')

print_info "Database Host: $DB_HOST"
print_info "Database Port: $DB_PORT"
print_info "Database Name: $DB_NAME"
print_info "Database User: $DB_USER"

echo ""

# Test 1: Network connectivity
print_info "Testing network connectivity..."
if nc -z -w5 $DB_HOST $DB_PORT 2>/dev/null; then
    print_success "Network connection to $DB_HOST:$DB_PORT successful"
else
    print_error "Cannot connect to $DB_HOST:$DB_PORT"
    echo "Possible issues:"
    echo "- Security group doesn't allow your IP"
    echo "- RDS instance is not running"
    echo "- Network connectivity issues"
    exit 1
fi

# Test 2: PostgreSQL connection (if psql is available)
if command -v psql &> /dev/null; then
    print_info "Testing PostgreSQL connection..."
    if psql "$DATABASE_URL" -c "SELECT version();" &>/dev/null; then
        print_success "PostgreSQL connection successful"
        
        # Test 3: Check Prisma schema
        print_info "Checking database schema..."
        TABLES=$(psql "$DATABASE_URL" -t -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public';" 2>/dev/null | wc -l)
        if [ $TABLES -gt 0 ]; then
            print_success "Found $TABLES tables in database"
            psql "$DATABASE_URL" -c "\dt"
        else
            print_info "No tables found. You may need to run migrations:"
            echo "cd packages/backend-service && npx prisma migrate deploy"
        fi
        
    else
        print_error "PostgreSQL connection failed"
        echo "Check your DATABASE_URL and credentials"
    fi
else
    print_info "psql not found. Install PostgreSQL client to test database connection:"
    echo "brew install postgresql  # On macOS"
    echo "apt-get install postgresql-client  # On Ubuntu"
fi

# Test 4: Test from Node.js (if in backend directory)
if [ -f "package.json" ] && grep -q "prisma" package.json; then
    print_info "Testing Prisma connection..."
    if npm run prisma:generate &>/dev/null && npx prisma db pull &>/dev/null; then
        print_success "Prisma can connect to database"
    else
        print_error "Prisma connection failed"
    fi
fi

echo ""
print_success "Database connection test completed"

# Provide helpful information
echo ""
echo "🛠️  Troubleshooting Tips:"
echo "• If connection fails, check AWS RDS security groups"
echo "• Ensure your IP is allowed in security group rules"
echo "• Verify the DATABASE_URL format is correct"
echo "• Check if RDS instance is in 'available' state"
echo ""
echo "📊 To monitor your database:"
echo "• AWS RDS Console: https://console.aws.amazon.com/rds/"
echo "• CloudWatch Metrics: Monitor CPU, connections, storage"
echo "• Enable Performance Insights for query analysis"
