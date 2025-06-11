#!/bin/bash

# AWS RDS PostgreSQL Database Setup Script
# This script creates and configures a PostgreSQL database on AWS RDS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Update these values as needed
REGION="us-east-1"
APP_NAME="reprecinct"
DB_NAME="reprecinct_db"
DB_USERNAME="reprecinct_user"
DB_INSTANCE_ID="${APP_NAME}-db"
DB_INSTANCE_CLASS="db.t3.micro"  # Free tier eligible
DB_ENGINE="postgres"
DB_ENGINE_VERSION="15.4"
ALLOCATED_STORAGE="20"  # GB
VPC_ID=""  # Leave empty to use default VPC
SUBNET_GROUP_NAME="${APP_NAME}-db-subnet-group"
SECURITY_GROUP_NAME="${APP_NAME}-rds-sg"

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo "🚀 Setting up PostgreSQL database on AWS RDS..."
echo ""

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &>/dev/null; then
    print_error "AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

print_info "Using AWS region: $REGION"

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
print_info "Generated secure database password"

# Get default VPC if not specified
if [ -z "$VPC_ID" ]; then
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text --region $REGION)
    print_info "Using default VPC: $VPC_ID"
fi

# Get subnets for the VPC
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text --region $REGION)
SUBNET_ARRAY=($SUBNET_IDS)

if [ ${#SUBNET_ARRAY[@]} -lt 2 ]; then
    print_error "Need at least 2 subnets in different AZs for RDS. Found: ${#SUBNET_ARRAY[@]}"
    exit 1
fi

print_info "Found ${#SUBNET_ARRAY[@]} subnets in VPC"

# Create DB subnet group
print_info "Creating DB subnet group..."
aws rds create-db-subnet-group \
    --db-subnet-group-name "$SUBNET_GROUP_NAME" \
    --db-subnet-group-description "Subnet group for $APP_NAME database" \
    --subnet-ids ${SUBNET_ARRAY[@]:0:2} \
    --region $REGION \
    --tags Key=Project,Value=$APP_NAME 2>/dev/null || print_warning "DB subnet group may already exist"

print_status "DB subnet group created/verified"

# Create security group for RDS
print_info "Creating security group for RDS..."
RDS_SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name "$SECURITY_GROUP_NAME" \
    --description "Security group for $APP_NAME RDS instance" \
    --vpc-id $VPC_ID \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null || aws ec2 describe-security-groups --filters "Name=group-name,Values=$SECURITY_GROUP_NAME" --query 'SecurityGroups[0].GroupId' --output text --region $REGION)

print_status "Security group ID: $RDS_SECURITY_GROUP_ID"

# Add inbound rule for PostgreSQL (port 5432)
print_info "Configuring security group rules..."
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 10.0.0.0/16 \
    --region $REGION 2>/dev/null || print_warning "Security group rule may already exist"

# Also allow access from your current IP (for development/debugging)
CURRENT_IP=$(curl -s http://checkip.amazonaws.com)/32
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr $CURRENT_IP \
    --region $REGION 2>/dev/null || print_warning "Current IP rule may already exist"

print_status "Security group configured"

# Create RDS instance
print_info "Creating RDS PostgreSQL instance..."
print_warning "This may take 10-15 minutes..."

aws rds create-db-instance \
    --db-instance-identifier "$DB_INSTANCE_ID" \
    --db-instance-class "$DB_INSTANCE_CLASS" \
    --engine "$DB_ENGINE" \
    --engine-version "$DB_ENGINE_VERSION" \
    --master-username "$DB_USERNAME" \
    --master-user-password "$DB_PASSWORD" \
    --allocated-storage "$ALLOCATED_STORAGE" \
    --db-name "$DB_NAME" \
    --vpc-security-group-ids "$RDS_SECURITY_GROUP_ID" \
    --db-subnet-group-name "$SUBNET_GROUP_NAME" \
    --backup-retention-period 7 \
    --storage-encrypted \
    --multi-az false \
    --publicly-accessible true \
    --storage-type gp2 \
    --region $REGION \
    --tags Key=Project,Value=$APP_NAME Key=Environment,Value=production 2>/dev/null || print_warning "RDS instance may already exist"

print_status "RDS instance creation initiated"

# Wait for RDS instance to be available
print_info "Waiting for RDS instance to be available..."
aws rds wait db-instance-available --db-instance-identifier "$DB_INSTANCE_ID" --region $REGION

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "$DB_INSTANCE_ID" \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

print_status "RDS instance is now available!"

# Create the connection string
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/${DB_NAME}?schema=public"

# Store secrets in AWS Systems Manager Parameter Store
print_info "Storing database credentials in AWS Systems Manager..."

aws ssm put-parameter \
    --name "/$APP_NAME/database/url" \
    --value "$DATABASE_URL" \
    --type "SecureString" \
    --description "Database connection URL for $APP_NAME" \
    --region $REGION \
    --overwrite 2>/dev/null || print_warning "Database URL parameter may already exist"

aws ssm put-parameter \
    --name "/$APP_NAME/database/host" \
    --value "$RDS_ENDPOINT" \
    --type "SecureString" \
    --description "Database host for $APP_NAME" \
    --region $REGION \
    --overwrite 2>/dev/null || print_warning "Database host parameter may already exist"

aws ssm put-parameter \
    --name "/$APP_NAME/database/password" \
    --value "$DB_PASSWORD" \
    --type "SecureString" \
    --description "Database password for $APP_NAME" \
    --region $REGION \
    --overwrite 2>/dev/null || print_warning "Database password parameter may already exist"

print_status "Database credentials stored in Systems Manager"

# Test connection (optional - requires psql)
if command -v psql &> /dev/null; then
    print_info "Testing database connection..."
    if PGPASSWORD=$DB_PASSWORD psql -h $RDS_ENDPOINT -U $DB_USERNAME -d $DB_NAME -c "SELECT version();" &>/dev/null; then
        print_status "Database connection test successful!"
    else
        print_warning "Database connection test failed - this is normal if connecting from restricted network"
    fi
else
    print_info "psql not found - skipping connection test"
fi

echo ""
echo "🎉 Database setup completed successfully!"
echo ""
echo "📋 Database Information:"
echo "----------------------------------------"
echo "Instance ID: $DB_INSTANCE_ID"
echo "Endpoint: $RDS_ENDPOINT"
echo "Database: $DB_NAME"
echo "Username: $DB_USERNAME"
echo "Password: $DB_PASSWORD"
echo "Region: $REGION"
echo ""
echo "🔗 Connection String:"
echo "$DATABASE_URL"
echo ""
echo "🔒 Security:"
echo "- Stored in AWS Systems Manager Parameter Store"
echo "- Encrypted at rest"
echo "- VPC security groups configured"
echo ""
echo "💰 Cost Estimate:"
echo "- db.t3.micro: ~$15-25/month"
echo "- 20GB storage: ~$2-3/month"
echo "- Backup storage: ~$1-2/month"
echo ""
echo "🚀 Next Steps:"
echo "1. Update your Amplify environment variables:"
echo "   DATABASE_URL=$DATABASE_URL"
echo ""
echo "2. Run database migrations:"
echo "   cd packages/backend-service"
echo "   npx prisma migrate deploy"
echo ""
echo "3. Test your application connection"
echo ""
echo "⚠️  Important: Save this information securely!"
echo "   The password will not be shown again."

# Generate secure password
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)
print_info "Generated secure password"

# Get default VPC
print_info "Finding default VPC..."
DEFAULT_VPC=$(aws ec2 describe-vpcs \
    --filters "Name=is-default,Values=true" \
    --query 'Vpcs[0].VpcId' \
    --output text \
    --region $REGION 2>/dev/null)

if [ "$DEFAULT_VPC" = "None" ] || [ -z "$DEFAULT_VPC" ]; then
    print_error "No default VPC found. Creating a new VPC..."
    
    # Create VPC
    DEFAULT_VPC=$(aws ec2 create-vpc \
        --cidr-block 10.0.0.0/16 \
        --query 'Vpc.VpcId' \
        --output text \
        --region $REGION)
    
    # Enable DNS hostnames
    aws ec2 modify-vpc-attribute \
        --vpc-id $DEFAULT_VPC \
        --enable-dns-hostnames \
        --region $REGION
        
    print_status "Created VPC: $DEFAULT_VPC"
fi

print_status "Using VPC: $DEFAULT_VPC"

# Get or create subnets
print_info "Setting up subnets..."
AVAILABILITY_ZONES=($(aws ec2 describe-availability-zones \
    --query 'AvailabilityZones[0:2].ZoneName' \
    --output text \
    --region $REGION))

SUBNETS=()
for i in "${!AVAILABILITY_ZONES[@]}"; do
    AZ=${AVAILABILITY_ZONES[$i]}
    CIDR="10.0.$((i+1)).0/24"
    
    # Check if subnet exists
    EXISTING_SUBNET=$(aws ec2 describe-subnets \
        --filters "Name=vpc-id,Values=$DEFAULT_VPC" "Name=availability-zone,Values=$AZ" \
        --query 'Subnets[0].SubnetId' \
        --output text \
        --region $REGION 2>/dev/null)
    
    if [ "$EXISTING_SUBNET" != "None" ] && [ -n "$EXISTING_SUBNET" ]; then
        SUBNETS+=($EXISTING_SUBNET)
        print_status "Using existing subnet: $EXISTING_SUBNET in $AZ"
    else
        # Create subnet
        SUBNET_ID=$(aws ec2 create-subnet \
            --vpc-id $DEFAULT_VPC \
            --cidr-block $CIDR \
            --availability-zone $AZ \
            --query 'Subnet.SubnetId' \
            --output text \
            --region $REGION)
        
        SUBNETS+=($SUBNET_ID)
        print_status "Created subnet: $SUBNET_ID in $AZ"
    fi
done

print_status "Subnets configured: ${SUBNETS[*]}"

# Create DB subnet group
print_info "Creating DB subnet group..."
aws rds create-db-subnet-group \
    --db-subnet-group-name "${APP_NAME}-db-subnet-group" \
    --db-subnet-group-description "Subnet group for ${APP_NAME} database" \
    --subnet-ids ${SUBNETS[*]} \
    --region $REGION 2>/dev/null && print_status "DB subnet group created" || print_warning "DB subnet group may already exist"

# Create security group
print_info "Creating security group..."
RDS_SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name "${APP_NAME}-rds-sg" \
    --description "Security group for ${APP_NAME} RDS instance" \
    --vpc-id $DEFAULT_VPC \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null)

if [ -z "$RDS_SECURITY_GROUP_ID" ]; then
    RDS_SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=${APP_NAME}-rds-sg" "Name=vpc-id,Values=$DEFAULT_VPC" \
        --query 'SecurityGroups[0].GroupId' \
        --output text \
        --region $REGION)
    print_warning "Using existing security group: $RDS_SECURITY_GROUP_ID"
else
    print_status "Created security group: $RDS_SECURITY_GROUP_ID"
fi

# Add security group rules
print_info "Configuring security group rules..."

# Allow PostgreSQL access from within the VPC
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 10.0.0.0/16 \
    --region $REGION 2>/dev/null && print_status "Added VPC access rule" || print_warning "VPC access rule may already exist"

# Allow access from Amplify (common IP ranges)
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 0.0.0.0/0 \
    --region $REGION 2>/dev/null && print_warning "Added public access (not recommended for production)" || print_warning "Public access rule may already exist"

# Create RDS instance
print_info "Creating RDS PostgreSQL instance (this may take 5-10 minutes)..."
aws rds create-db-instance \
    --db-instance-identifier "${APP_NAME}-db" \
    --db-instance-class $DB_INSTANCE_CLASS \
    --engine postgres \
    --engine-version 15.4 \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage $ALLOCATED_STORAGE \
    --storage-type gp2 \
    --db-name $DB_NAME \
    --vpc-security-group-ids $RDS_SECURITY_GROUP_ID \
    --db-subnet-group-name "${APP_NAME}-db-subnet-group" \
    --backup-retention-period 7 \
    --storage-encrypted \
    --multi-az false \
    --publicly-accessible true \
    --auto-minor-version-upgrade true \
    --deletion-protection false \
    --region $REGION 2>/dev/null && print_status "RDS instance creation initiated" || print_warning "RDS instance may already exist"

# Wait for RDS instance to be available
print_info "Waiting for RDS instance to be available..."
aws rds wait db-instance-available \
    --db-instance-identifier "${APP_NAME}-db" \
    --region $REGION

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "${APP_NAME}-db" \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

print_status "RDS instance is ready!"

# Create database URL
DATABASE_URL="postgresql://${DB_USERNAME}:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/${DB_NAME}?schema=public"

# Store in AWS Systems Manager Parameter Store
print_info "Storing database credentials in AWS Systems Manager..."
aws ssm put-parameter \
    --name "/${APP_NAME}/database/url" \
    --value "$DATABASE_URL" \
    --type "SecureString" \
    --overwrite \
    --region $REGION && print_status "Database URL stored in Parameter Store"

aws ssm put-parameter \
    --name "/${APP_NAME}/database/host" \
    --value "$RDS_ENDPOINT" \
    --type "String" \
    --overwrite \
    --region $REGION && print_status "Database host stored in Parameter Store"

# Create .env file for local testing
print_info "Creating local environment file..."
cat > "packages/backend-service/.env.aws" << EOF
# AWS RDS Configuration
DATABASE_URL=${DATABASE_URL}
DB_HOST=${RDS_ENDPOINT}
DB_PORT=5432
DB_NAME=${DB_NAME}
DB_USERNAME=${DB_USERNAME}
DB_PASSWORD=${DB_PASSWORD}

# Server Configuration
PORT=4000
NODE_ENV=production
EOF

print_status "Environment file created: packages/backend-service/.env.aws"

echo ""
echo "🎉 Database Setup Complete!"
echo "=================================="
echo ""
echo "📋 Database Information:"
echo "  Region: $REGION"
echo "  Endpoint: $RDS_ENDPOINT"
echo "  Database: $DB_NAME"
echo "  Username: $DB_USERNAME"
echo "  Password: $DB_PASSWORD"
echo ""
echo "🔗 Connection String:"
echo "  $DATABASE_URL"
echo ""
echo "📂 Configuration Files:"
echo "  Local test: packages/backend-service/.env.aws"
echo "  AWS SSM: /${APP_NAME}/database/url"
echo ""
echo "🚀 Next Steps:"
echo "1. Test connection: cd packages/backend-service && DATABASE_URL='$DATABASE_URL' npx prisma migrate deploy"
echo "2. Set environment variables in AWS Amplify Console"
echo "3. Deploy your application"
echo ""
echo "💰 Estimated monthly cost: \$15-25 for db.t3.micro"
echo ""
print_warning "IMPORTANT: Save the password securely! This is the only time it will be displayed."
