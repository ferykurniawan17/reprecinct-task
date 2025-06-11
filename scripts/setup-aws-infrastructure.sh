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

# Create DB subnet group
aws rds create-db-subnet-group \
    --db-subnet-group-name "${APP_NAME}-db-subnet-group" \
    --db-subnet-group-description "Subnet group for ${APP_NAME} database" \
    --subnet-ids subnet-12345678 subnet-87654321 \
    --region $REGION || echo "DB subnet group may already exist"

# Create security group for RDS
RDS_SECURITY_GROUP_ID=$(aws ec2 create-security-group \
    --group-name "${APP_NAME}-rds-sg" \
    --description "Security group for ${APP_NAME} RDS instance" \
    --vpc-id vpc-12345678 \
    --region $REGION \
    --query 'GroupId' \
    --output text 2>/dev/null || echo "Security group may already exist")

# Add inbound rule for PostgreSQL
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SECURITY_GROUP_ID \
    --protocol tcp \
    --port 5432 \
    --cidr 10.0.0.0/16 \
    --region $REGION || echo "Security group rule may already exist"

# Create RDS instance
aws rds create-db-instance \
    --db-instance-identifier "${APP_NAME}-db" \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --engine-version 15.4 \
    --master-username $DB_USERNAME \
    --master-user-password $DB_PASSWORD \
    --allocated-storage 20 \
    --db-name $DB_NAME \
    --vpc-security-group-ids $RDS_SECURITY_GROUP_ID \
    --db-subnet-group-name "${APP_NAME}-db-subnet-group" \
    --backup-retention-period 7 \
    --storage-encrypted \
    --region $REGION || echo "RDS instance may already exist"

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
