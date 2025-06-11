# Reprecinct - AWS Deployment Guide

A full-stack application with Next.js frontend and Express.js backend, deployed on AWS.

## 🏗️ Architecture

- **Frontend**: Next.js deployed on AWS Amplify
- **Backend**: Express.js + Prisma deployed on AWS Amplify
- **Database**: PostgreSQL on AWS RDS
- **CI/CD**: GitHub Actions + AWS CodeBuild

## 🚀 Quick Start

### Prerequisites
- AWS CLI configured
- Node.js 18+
- GitHub account
- PostgreSQL (for local development)

### Local Development

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo>
   cd reprecinct-task
   
   # Install backend dependencies
   cd packages/backend-service
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

2. **Set up local environment**
   ```bash
   # Backend environment
   cd packages/backend-service
   cp .env.example .env
   # Edit .env with your local database URL
   
   # Frontend environment  
   cd ../frontend
   cp .env.example .env.local
   # Edit .env.local with your local API URL
   ```

3. **Run database setup**
   ```bash
   cd packages/backend-service
   npx prisma generate
   npx prisma migrate dev
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd packages/backend-service
   npm run dev
   
   # Terminal 2 - Frontend
   cd packages/frontend
   npm run dev
   ```

### Test Local Deployment
```bash
./scripts/test-deployment.sh
```

## ☁️ AWS Deployment

### 1. Infrastructure Setup

Run the automated setup script:
```bash
./scripts/setup-aws-infrastructure.sh
```

This creates:
- RDS PostgreSQL database
- ECR repository
- ECS cluster (optional)
- Amplify applications
- Security groups
- IAM roles

### 2. Amplify Configuration

#### Frontend App
1. Go to AWS Amplify Console
2. Create new app → Connect GitHub repository
3. Choose your repository and `main` branch
4. Build settings → Use `amplify-frontend.yml`
5. Environment variables:
   - `NEXT_PUBLIC_API_URL`: Your backend Amplify URL
   - `NODE_ENV`: production

#### Backend App
1. Create second Amplify app for backend
2. Connect same repository, choose `main` branch
3. Build settings → Use `amplify-backend.yml`
4. Environment variables:
   - `DATABASE_URL`: RDS connection string
   - `NODE_ENV`: production
   - `PORT`: 4000
   - `CORS_ORIGIN`: Frontend Amplify URL
   - `JWT_SECRET`: Secure random string

### 3. GitHub Actions Setup

Add these secrets to your GitHub repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AMPLIFY_APP_ID_FRONTEND`
- `AMPLIFY_APP_ID_BACKEND`
- `NEXT_PUBLIC_API_URL`

### 4. Database Migration

After deployment, run migrations:
```bash
# Connect to your deployed backend and run:
npx prisma migrate deploy
```

## 🔧 Configuration Files

### Environment Variables

**Local Development (.env)**
```bash
# Backend
DATABASE_URL=postgresql://user:password@localhost:5432/reprecinct
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:4000
```

**Production (.env.production)**
```bash
# Backend
DATABASE_URL=${DATABASE_URL}
NODE_ENV=production
PORT=4000
CORS_ORIGIN=${FRONTEND_URL}
JWT_SECRET=${JWT_SECRET}

# Frontend
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
```

### Build Configuration

- `amplify-frontend.yml`: Frontend build configuration
- `amplify-backend.yml`: Backend build configuration
- `buildspec-*.yml`: CodeBuild specifications
- `Dockerfile`: Backend containerization

## 📁 Project Structure

```
reprecinct-task/
├── packages/
│   ├── frontend/          # Next.js application
│   └── backend-service/   # Express.js API
├── scripts/
│   ├── setup-aws-infrastructure.sh
│   └── test-deployment.sh
├── .github/workflows/     # GitHub Actions
├── amplify-*.yml         # Amplify build configs
├── buildspec-*.yml       # CodeBuild configs
└── AWS_DEPLOYMENT.md     # Detailed deployment guide
```

## 🔄 CI/CD Pipeline

### Automatic Deployments

1. **Push to main branch** → Triggers GitHub Actions
2. **Frontend workflow** → Builds and deploys to Amplify
3. **Backend workflow** → Builds and deploys to Amplify/ECS
4. **Database migrations** → Automatically applied

### Manual Deployments

```bash
# Trigger manual deployment
aws amplify start-job --app-id <app-id> --branch-name main --job-type RELEASE
```

## 📊 Monitoring

- **Amplify Console**: Build logs and metrics
- **CloudWatch**: Application logs
- **RDS Monitoring**: Database performance

## 🔒 Security

- Environment variables encrypted in Amplify
- RDS in private subnets with security groups
- CORS properly configured
- Secrets managed via AWS Systems Manager

## 💰 Cost Estimation

**Monthly costs (approximate):**
- RDS t3.micro: $15-25
- Amplify: $0-15 (depending on traffic)
- Data transfer: $0-10
- **Total: ~$25-50/month**

## 🛠️ Troubleshooting

### Common Issues

1. **Build Failures**
   - Check environment variables in Amplify Console
   - Verify Node.js version compatibility
   - Review build logs

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check security group rules
   - Ensure RDS is in correct VPC

3. **CORS Errors**
   - Verify CORS_ORIGIN matches frontend URL
   - Check both http/https protocols

### Useful Commands

```bash
# Check build status
aws amplify list-jobs --app-id <app-id> --branch-name main

# View logs
aws logs describe-log-groups --log-group-name-prefix /aws/amplify

# Test database connection
cd packages/backend-service && npx prisma studio
```

## 📚 Additional Resources

- [AWS Amplify Documentation](https://docs.aws.amazon.com/amplify/)
- [AWS RDS Documentation](https://docs.aws.amazon.com/rds/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Test locally with `./scripts/test-deployment.sh`
4. Submit pull request
5. Automatic deployment on merge to main

---

For detailed deployment information, see [AWS_DEPLOYMENT.md](./AWS_DEPLOYMENT.md)
