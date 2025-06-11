#!/bin/bash

# AWS Infrastructure Setup Script for Reprecinct Application
# This script sets up the necessary AWS resources for the application

set -e

# Configuration
REGION="us-east-1"
APP_NAME="reprecinct"
DB_NAME="reprecinct_db"
DB_USERNAME="reprecinct_user"

echo "🚀 Setting up AWS infrastructure for Reprecinct..."

# Generate random password for database
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-25)

# 1. Create RDS PostgreSQL Database
echo "📊 Creating RDS PostgreSQL database..."

# Get default VPC and subnets
echo "🔍 Finding default VPC and subnets..."
DEFAULT_VPC=$(aws ec2 describe-vpcs \
    --filters "Name=is-default,Values=true" \
    --query 'Vpcs[0].VpcId' \
    --output text \
    --region $REGION)

if [ "$DEFAULT_VPC" = "None" ] || [ -z "$DEFAULT_VPC" ]; then
    echo "❌ No default VPC found. Please create a VPC first."
    exit 1
fi

echo "✅ Using VPC: $DEFAULT_VPC"

# Get subnets in different AZs
SUBNETS=$(aws ec2 describe-subnets \
    --filters "Name=vpc-id,Values=$DEFAULT_VPC" \
    --query 'Subnets[*].SubnetId' \
    --output text \
    --region $REGION)

if [ -z "$SUBNETS" ]; then
    echo "❌ No subnets found in VPC. Please create subnets first."
    exit 1
fi

# Convert to array for easier handling
SUBNET_ARRAY=($SUBNETS)
echo "✅ Found ${#SUBNET_ARRAY[@]} subnets"

# Create DB subnet group (needs at least 2 subnets in different AZs)
if [ ${#SUBNET_ARRAY[@]} -lt 2 ]; then
    echo "❌ Need at least 2 subnets in different AZs for RDS"
    exit 1
fi

aws rds create-db-subnet-group \
    --db-subnet-group-name "${APP_NAME}-db-subnet-group" \
    --db-subnet-group-description "Subnet group for ${APP_NAME} database" \
    --subnet-ids ${SUBNET_ARRAY[0]} ${SUBNET_ARRAY[1]} \
    --region $REGION 2>/dev/null || echo "DB subnet group may already exist"

# Create security group for RDS
echo "🔒 Creating security group for RDS..."
RDS_SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name "${APP_NAME}-rds-sg" \
    --description "Security group for ${APP_NAME} RDS instance" \
    --vpc-id $DEFAULT_VPC \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null)

if [ -z "$RDS_SECURITY_GROUP_ID" ]; then
    # Security group might already exist, get its ID
    RDS_SECURITY_GROUP_ID=$(aws ec2 describe-security-groups \
        --filters "Name=group-name,Values=${APP_NAME}-rds-sg" "Name=vpc-id,Values=$DEFAULT_VPC" \
        --query 'SecurityGroups[0].GroupId' \
        --output text \
        --region $REGION)
fi

echo "✅ Security Group ID: $RDS_SECURITY_GROUP_ID"

# Add inbound rule for PostgreSQL (allow from anywhere in VPC)
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $RDS_SECURITY_GROUP_ID \
    --region $REGION 2>/dev/null || echo "Security group rule may already exist"

# Also allow from common CIDR blocks (adjust as needed)
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 10.0.0.0/8 \
    --region $REGION 2>/dev/null || echo "CIDR rule may already exist"

# Create RDS instance
echo "🚀 Creating RDS PostgreSQL instance..."
aws rds create-db-instance \
    --db-instance-identifier "${APP_NAME}-db" \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage 20 \
    --storage-type gp2 \
    --db-name $DB_NAME \
    --vpc-security-group-ids $RDS_SECURITY_GROUP_ID \
    --db-subnet-group-name "${APP_NAME}-db-subnet-group" \
    --backup-retention-period 7 \
    --storage-encrypted \
    --multi-az false \
    --publicly-accessible false \
    --auto-minor-version-upgrade true \
    --deletion-protection false \
    --region $REGION 2>/dev/null || echo "RDS instance may already exist"

echo "⏳ Waiting for RDS instance to be available..."
aws rds wait db-instance-available --db-instance-identifier "${APP_NAME}-db" --region $REGION

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "${APP_NAME}-db" \
    --region $REGION \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)

# 2. Create ECR Repository for backend
echo "🐳 Creating ECR repository..."
aws ecr create-repository \
    --repository-name "${APP_NAME}-backend" \
    --region $REGION || echo "ECR repository may already exist"

# 3. Create ECS Cluster
echo "⚙️ Creating ECS cluster..."
aws ecs create-cluster \
    --cluster-name "${APP_NAME}-cluster" \
    --region $REGION || echo "ECS cluster may already exist"

# 4. Create Amplify Apps
echo "🌐 Creating Amplify applications..."

# Frontend Amplify App
FRONTEND_APP_ID=$(aws amplify create-app \
    --name "${APP_NAME}-frontend" \
    --repository "https://github.com/your-username/your-repo" \
    --platform WEB \
    --region $REGION \
    --query 'app.appId' \
    --output text 2>/dev/null || echo "Frontend app may already exist")

# Backend Amplify App (for API hosting)
BACKEND_APP_ID=$(aws amplify create-app \
    --name "${APP_NAME}-backend" \
    --repository "https://github.com/your-username/your-repo" \
    --platform WEB \
    --region $REGION \
    --query 'app.appId' \
    --output text 2>/dev/null || echo "Backend app may already exist")

# 5. Create Systems Manager Parameters for secrets
echo "🔐 Creating Systems Manager parameters..."

aws ssm put-parameter \
    --name "/${APP_NAME}/database/url" \
    --value "postgresql://${DB_USERNAME}:${DB_PASSWORD}@${RDS_ENDPOINT}:5432/${DB_NAME}?schema=public" \
    --type "SecureString" \
    --region $REGION || echo "Database URL parameter may already exist"

aws ssm put-parameter \
    --name "/${APP_NAME}/jwt/secret" \
    --value $(openssl rand -base64 64) \
    --type "SecureString" \
    --region $REGION || echo "JWT secret parameter may already exist"

# 6. Output important information
echo ""
echo "✅ AWS Infrastructure Setup Complete!"
echo ""
echo "📋 Important Information:"
echo "Region: $REGION"
echo "RDS Endpoint: $RDS_ENDPOINT"
echo "Database Name: $DB_NAME"
echo "Database Username: $DB_USERNAME"
echo "Database Password: $DB_PASSWORD"
echo ""
echo "Amplify Frontend App ID: $FRONTEND_APP_ID"
echo "Amplify Backend App ID: $BACKEND_APP_ID"
echo ""
echo "🔧 Next Steps:"
echo "1. Update your GitHub repository URL in the Amplify apps"
echo "2. Set up branch connections in Amplify Console"
echo "3. Configure environment variables in Amplify Console"
echo "4. Update your .env files with the RDS endpoint"
echo "5. Run database migrations"
echo ""
echo "💾 Save this information securely!"
