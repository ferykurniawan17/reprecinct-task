# Amplify Build Troubleshooting Guide

## The Issue You Encountered

The error you saw:
```
cd: packages/frontend: No such file or directory
```

This happens because AWS Amplify's build environment doesn't recognize the monorepo structure correctly when using the `applications` configuration in `amplify.yml`.

## Solution

I've fixed your `amplify-frontend.yml` configuration. The key changes:

### ❌ Before (Incorrect):
```yaml
version: 1
applications:
  - appRoot: packages/frontend  # This doesn't work correctly
    frontend:
      phases:
        preBuild:
          commands:
            - cd packages/frontend  # Fails because path is wrong
```

### ✅ After (Correct):
```yaml
version: 1
frontend:  # Direct frontend configuration
  phases:
    preBuild:
      commands:
        - ls -la                    # Debug: show current directory
        - pwd                       # Debug: show current path
        - cd packages/frontend      # Navigate to frontend
        - npm install
```

## How AWS Amplify Handles Database Hosting

Since you asked about database hosting, here's how to properly set it up:

### 1. **Set Up AWS RDS PostgreSQL**

Run the database setup script:
```bash
chmod +x scripts/setup-database.sh
./scripts/setup-database.sh
```

This will create:
- RDS PostgreSQL instance (`db.t3.micro` - free tier eligible)
- Security groups with proper access rules
- Subnet groups for high availability
- Encrypted storage
- Automated backups (7 days retention)

### 2. **Configure Amplify Environment Variables**

In your AWS Amplify Console, set these environment variables:

**Frontend App:**
- `NEXT_PUBLIC_API_URL`: `https://your-backend-amplify-url.amplifyapp.com`
- `NODE_ENV`: `production`

**Backend App:**
- `DATABASE_URL`: `postgresql://username:password@your-rds-endpoint:5432/database?schema=public`
- `NODE_ENV`: `production`
- `PORT`: `4000`
- `CORS_ORIGIN`: `https://your-frontend-amplify-url.amplifyapp.com`
- `JWT_SECRET`: `your-secure-jwt-secret`

### 3. **Database Connection Flow**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │───▶│   Backend API    │───▶│   RDS Postgres  │
│   (Amplify)     │    │   (Amplify)      │    │   Database      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### 4. **Security Configuration**

- **VPC**: Database in private subnets with security groups
- **Access**: Only backend can connect to database
- **Encryption**: Data encrypted at rest and in transit
- **Secrets**: Stored in AWS Systems Manager Parameter Store

## Step-by-Step Deployment Process

### 1. **Prepare Your Repository**
```bash
# Test the build locally first
./scripts/test-deployment.sh
```

### 2. **Set Up Database**
```bash
# Create RDS PostgreSQL instance
./scripts/setup-database.sh
```

### 3. **Create Amplify Apps**

**Frontend App:**
1. Go to AWS Amplify Console
2. Choose "Host web app"
3. Connect your GitHub repository
4. Select branch: `main`
5. Build settings: Upload `amplify-frontend.yml`
6. Advanced settings: Add environment variables
7. Save and deploy

**Backend App:**
1. Create second Amplify app
2. Same repository, `main` branch
3. Build settings: Upload `amplify-backend.yml`
4. Environment variables: Add database connection details
5. Save and deploy

### 4. **Run Database Migrations**

After backend deployment, run migrations:
```bash
# Option 1: Through Amplify Console (add to postBuild)
npx prisma migrate deploy

# Option 2: Locally (connect to RDS)
cd packages/backend-service
DATABASE_URL="your-rds-connection-string" npx prisma migrate deploy
```

## Database Management Best Practices

### 1. **Environment Separation**
- **Development**: Local PostgreSQL
- **Staging**: Smaller RDS instance
- **Production**: Full RDS instance with backups

### 2. **Monitoring**
- Enable RDS Performance Insights
- Set up CloudWatch alarms
- Monitor connection pool usage

### 3. **Backup Strategy**
- Automated daily backups (7-30 days)
- Manual snapshots before major deployments
- Point-in-time recovery for production

### 4. **Cost Optimization**
- Start with `db.t3.micro` (free tier)
- Scale up based on usage
- Use reserved instances for production

## Common Issues and Solutions

### Issue: "Database connection failed"
**Solution:**
1. Check security group rules
2. Verify DATABASE_URL format
3. Ensure RDS instance is running
4. Test connection from same VPC

### Issue: "Amplify build fails with dependencies"
**Solution:**
1. Clear Amplify cache
2. Update Node.js version in build settings
3. Check package.json dependencies

### Issue: "CORS errors in production"
**Solution:**
1. Verify CORS_ORIGIN environment variable
2. Check both frontend and backend URLs
3. Ensure proper protocol (https)

## Monitoring and Logs

### Amplify Logs
- Build logs: Amplify Console → App → Build details
- Runtime logs: CloudWatch → Log groups

### Database Logs
- RDS Console → Monitoring tab
- CloudWatch → RDS metrics

### Application Monitoring
- CloudWatch Application Insights
- AWS X-Ray for distributed tracing

## Next Steps After Database Setup

1. **Update Environment Variables** in Amplify Console
2. **Deploy Both Apps** (frontend and backend)
3. **Run Database Migrations**
4. **Test the Application**
5. **Set Up Monitoring** and alerts
6. **Configure Custom Domains** (optional)

Your database will be hosted securely on AWS RDS with automatic backups, monitoring, and scaling capabilities.
