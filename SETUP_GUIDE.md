# Reprecinct Task - Local Development Setup Guide

Welcome! This guide will help you set up and run the Reprecinct application on your local machine.

## 📋 Overview

This is a full-stack monorepo application consisting of:

- **Frontend**: Next.js with TypeScript, Tailwind CSS, and Radix UI
- **Backend**: Express.js with TypeScript, Prisma ORM, and PostgreSQL
- **Database**: PostgreSQL (AWS RDS for production)
- **Deployment**:
  - Frontend: AWS Amplify
  - Backend: AWS App Runner
  - Database: AWS RDS PostgreSQL

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Yarn** package manager - [Install here](https://yarnpkg.com/getting-started/install)
- **Git** - [Download here](https://git-scm.com/)

## 🚀 Quick Setup

### 1. Clone the Repository

```bash
git clone git@github.com:ferykurniawan17/reprecinct-task.git
cd reprecinct-task
```

### 2. Install Dependencies

This is a monorepo using Lerna and Yarn workspaces. Install all dependencies from the root:

```bash
# Install all dependencies for both frontend and backend
yarn install
```

### 3. Environment Variables Setup

#### Backend Environment Variables

```bash
cd packages/backend-service
cp .env.example .env
```

Edit the `.env` file with the following configuration:

```bash
# Database Configuration
DATABASE_URL=<Ask @fery>

# Server Configuration
PORT=4000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# API Configuration
API_BASE_URL=http://localhost:4000

# Security (optional for local development)
JWT_SECRET=your-local-jwt-secret
```

#### Frontend Environment Variables

```bash
cd packages/frontend
cp .env.example .env.local
```

Edit the `.env.local` file:

```bash
# Local Development API URL
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 4. Database Setup

The application is configured to use our AWS RDS PostgreSQL database. The database connection is already configured in the environment variables above.

Generate Prisma client:

```bash
cd packages/backend-service
yarn prisma:generate
```

### 5. Running the Application

#### Option A: Run Both Services Simultaneously (Recommended)

From the root directory:

```bash
# Start both frontend and backend in development mode
yarn dev
```

This will start:

- Backend server at: http://localhost:4000
- Frontend server at: http://localhost:3000

#### Option B: Run Services Separately

**Terminal 1 - Backend:**

```bash
cd packages/backend-service
yarn dev
```

**Terminal 2 - Frontend:**

```bash
cd packages/frontend
yarn dev
```

## 📱 Accessing the Application

Once both services are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **API Documentation (Swagger)**: http://localhost:4000/api-docs
- **Health Check**: http://localhost:4000/health

## 🔌 API Testing

### Swagger Documentation

The complete API documentation is available at:

- **Local**: http://localhost:4000/api-docs
- **Production**: https://pqjjudv6gn.ap-southeast-2.awsapprunner.com/api-docs

### cURL Examples

#### 1. Health Check

```bash
curl -X GET http://localhost:4000/health
```

#### 2. Create Attribute (Single)

```bash
curl -X POST http://localhost:4000/api/attribute \
  -H "Content-Type: application/json" \
  -d '{
    "attributes": "Color"
  }'
```

#### 3. Create Multiple Attributes

```bash
curl -X POST http://localhost:4000/api/attribute \
  -H "Content-Type: application/json" \
  -d '{
    "attributes": ["Size", "Brand", "Material"]
  }'
```

#### 4. Get All Attributes

```bash
curl -X GET http://localhost:4000/api/attribute
```

#### 5. Get Attributes with Search

```bash
curl -X GET "http://localhost:4000/api/attribute?search=color"
```

#### 6. Get Attributes with Limit

```bash
curl -X GET "http://localhost:4000/api/attribute?limit=10"
```

#### 7. Get Attributes with Search and Limit

```bash
curl -X GET "http://localhost:4000/api/attribute?search=size&limit=5"
```

## 🌐 Production URLs

### Frontend (AWS Amplify)

- **Production URL**: _[Your Amplify URL will be here]_

### Backend (AWS App Runner)

- **Production API**: https://pqjjudv6gn.ap-southeast-2.awsapprunner.com
- **Production Swagger**: https://pqjjudv6gn.ap-southeast-2.awsapprunner.com/api-docs

### Database (AWS RDS)

- **Engine**: PostgreSQL
- **Region**: ap-southeast-2 (Asia Pacific - Sydney)
- **Connection**: Already configured in environment variables

## 🛠️ Available Scripts

### Root Level (Monorepo)

```bash
yarn dev      # Start both frontend and backend in development
yarn build    # Build both applications for production
yarn test     # Run tests for both applications
```

### Backend Scripts

```bash
cd packages/backend-service

yarn dev                    # Start development server with auto-reload
yarn build                  # Build for production
yarn start                  # Start production server
yarn prisma:generate        # Generate Prisma client
yarn prisma:migrate         # Run database migrations
yarn prisma:studio          # Open Prisma Studio (database GUI)
yarn test:swagger           # Test API endpoints
```

### Frontend Scripts

```bash
cd packages/frontend

yarn dev          # Start Next.js development server
yarn build        # Build for production
yarn start        # Start production server
yarn lint         # Run ESLint
yarn type-check   # Run TypeScript type checking
```

## 🗂️ Project Structure

```
reprecinct-task/
├── packages/
│   ├── backend-service/          # Express.js API server
│   │   ├── src/
│   │   │   ├── accessors/        # Database access layer
│   │   │   ├── interfaces/       # HTTP request handlers
│   │   │   ├── services/         # Business logic
│   │   │   ├── shared/           # Shared utilities
│   │   │   ├── app.ts            # Express app configuration
│   │   │   ├── index.ts          # Development server
│   │   │   └── swagger.ts        # API documentation
│   │   ├── prisma/               # Database schema and migrations
│   │   └── package.json
│   └── frontend/                 # Next.js React application
│       ├── src/
│       │   ├── app/              # Next.js app router
│       │   ├── components/       # Shared components
│       │   ├── modules/          # Feature modules
│       │   └── lib/              # Utilities
│       └── package.json
├── package.json                  # Root package.json (monorepo)
└── lerna.json                    # Lerna configuration
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**

   ```bash
   # Kill process on port 4000 (backend)
   lsof -ti:4000 | xargs kill -9

   # Kill process on port 3000 (frontend)
   lsof -ti:3000 | xargs kill -9
   ```

2. **Database Connection Issues**

   - Ensure the DATABASE_URL in your `.env` file is correct
   - Check if your IP is whitelisted for the RDS instance
   - Verify the database is running

3. **Prisma Client Issues**

   ```bash
   cd packages/backend-service
   yarn prisma:generate
   ```

4. **Node Modules Issues**
   ```bash
   # Clean install
   rm -rf node_modules packages/*/node_modules
   yarn install
   ```

### Getting Help

If you encounter any issues:

1. Check the console output for error messages
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that both services are running on the correct ports

## 📊 Tech Stack

### Frontend

- Next.js 14 (React Framework)
- TypeScript
- Tailwind CSS
- Radix UI Components
- TanStack Query (React Query)
- Lucide Icons

### Backend

- Express.js (Node.js Framework)
- TypeScript
- Prisma ORM
- PostgreSQL
- Swagger/OpenAPI
- Helmet.js (Security)
- CORS

### Deployment & Infrastructure

- **Frontend**: AWS Amplify
- **Backend**: AWS App Runner
- **Database**: AWS RDS PostgreSQL
- **Region**: Asia Pacific (Sydney) - ap-southeast-2

---

**Happy coding! 🚀**

If you have any questions or need assistance, please don't hesitate to reach out.
