# AWS Deployment Configuration

This document outlines the deployment setup for the Reprecinct application on AWS.

## Architecture Overview

- **Frontend**: Next.js app deployed on AWS Amplify
- **Backend**: Express.js API deployed on AWS Amplify (or ECS for advanced use)
- **Database**: PostgreSQL on AWS RDS
- **CI/CD**: GitHub Actions with AWS CodeBuild

## Prerequisites

1. AWS CLI configured with appropriate permissions
2. GitHub repository connected to AWS Amplify
3. Node.js 18+ installed locally

## Environment Variables

### Frontend (.env.production)
```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.amplifyapp.com
```

### Backend (.env.production)
```bash
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/database?schema=public
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend-domain.amplifyapp.com
JWT_SECRET=your-super-secure-jwt-secret
```

## AWS Resources Setup

### 1. RDS PostgreSQL Database
- Instance: `db.t3.micro` (can be upgraded later)
- Engine: PostgreSQL 15.4
- Storage: 20GB (can be expanded)
- Backup: 7 days retention
- Security: VPC security groups configured

### 2. Amplify Applications

#### Frontend App
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 18

#### Backend App
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 18

### 3. Environment Variables in Amplify Console

#### Frontend Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NODE_ENV`: production

#### Backend Environment Variables
- `DATABASE_URL`: RDS connection string
- `NODE_ENV`: production
- `PORT`: 4000
- `CORS_ORIGIN`: Frontend URL
- `JWT_SECRET`: JWT signing secret

## Deployment Steps

### Initial Setup

1. **Run AWS Infrastructure Setup**
   ```bash
   ./scripts/setup-aws-infrastructure.sh
   ```

2. **Create Amplify Apps**
   - Go to AWS Amplify Console
   - Create new apps for frontend and backend
   - Connect to your GitHub repository
   - Configure build settings using the provided amplify.yml files

3. **Configure Environment Variables**
   - Set environment variables in Amplify Console
   - Use AWS Systems Manager Parameter Store for sensitive data

### Continuous Deployment

1. **GitHub Actions Setup**
   - Add AWS credentials to GitHub Secrets
   - Configure repository secrets:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`
     - `AWS_REGION`
     - `AMPLIFY_APP_ID_FRONTEND`
     - `AMPLIFY_APP_ID_BACKEND`
     - `NEXT_PUBLIC_API_URL`

2. **Branch Protection**
   - Protect main branch
   - Require PR reviews
   - Enable automatic deployments on merge

## Database Management

### Running Migrations
```bash
# For production deployment
cd packages/backend-service
npx prisma migrate deploy

# For development
npx prisma migrate dev
```

### Database Connection
The application uses Prisma as the ORM. Connection is configured via `DATABASE_URL` environment variable.

## Monitoring and Logging

- **Amplify Console**: Build logs and deployment status
- **CloudWatch**: Application logs and metrics
- **RDS Monitoring**: Database performance and metrics

## Security Considerations

1. **Environment Variables**: Stored securely in Amplify Console
2. **Database**: Encrypted at rest, VPC security groups
3. **CORS**: Configured to allow only frontend domain
4. **Secrets**: JWT secrets stored in AWS Systems Manager

## Cost Optimization

- **RDS**: Start with `db.t3.micro`, scale as needed
- **Amplify**: Pay-per-use model
- **Data Transfer**: Monitor and optimize API calls

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Amplify Console
   - Verify environment variables
   - Check dependency versions

2. **Database Connection Issues**
   - Verify security group rules
   - Check DATABASE_URL format
   - Ensure RDS instance is running

3. **CORS Errors**
   - Verify CORS_ORIGIN environment variable
   - Check frontend and backend URLs match

### Logs Access
- Amplify build logs: Amplify Console → App → Branch → Build details
- Runtime logs: CloudWatch → Log groups
- Database logs: RDS → Monitoring

## Scaling

### Frontend Scaling
- Amplify automatically scales frontend
- Consider CloudFront for global distribution

### Backend Scaling
- For higher traffic, consider migrating to ECS Fargate
- Implement load balancing
- Use RDS read replicas for database scaling

## Backup and Recovery

### Database Backups
- Automated daily backups (7 days retention)
- Point-in-time recovery available
- Manual snapshots for major deployments

### Application Backups
- Source code in GitHub
- Build artifacts in Amplify
- Environment configurations documented
