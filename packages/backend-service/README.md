# Reprecinct Backend Service

A serverless Express.js API built with TypeScript, Prisma, and PostgreSQL, designed for AWS deployment.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database URL

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start development server
npm run dev
```

### AWS Deployment

**🏃‍♂️ One-Command Deploy:**

```bash
export DATABASE_URL='postgresql://user:pass@host:5432/db'
export CORS_ORIGIN='https://your-frontend.com'
npm run deploy:quick
```

**📖 Detailed Setup:** See [QUICK_START.md](./QUICK_START.md) or [SERVERLESS_DEPLOYMENT.md](./SERVERLESS_DEPLOYMENT.md)

## 🏗️ Architecture

- **Runtime**: Node.js 18 on AWS Lambda
- **Database**: PostgreSQL on AWS RDS
- **API**: Express.js with AWS API Gateway
- **ORM**: Prisma
- **Documentation**: Swagger/OpenAPI

## 📖 API Documentation

- **Local**: http://localhost:4000/api-docs
- **Production**: https://your-api-url/api-docs

## 🛠️ Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

### Database

- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### AWS Deployment

- `npm run deploy:quick` - Quick deploy to Lambda + API Gateway
- `npm run setup:rds` - Create RDS PostgreSQL instance
- `npm run test:local` - Test with SAM CLI locally
- `npm run aws:logs` - View CloudWatch logs

### Testing

- `npm run test:swagger` - Test API endpoints

## 🌍 Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/database

# Server
PORT=4000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# API Documentation
API_BASE_URL=http://localhost:4000
```

## 📁 Project Structure

```
src/
├── app.ts              # Express app configuration
├── index.ts            # Local development server
├── lambda.js           # AWS Lambda handler
├── swagger.ts          # API documentation setup
├── accessors/          # Database access layer
├── interfaces/         # HTTP request handlers
├── services/           # Business logic
└── shared/             # Utilities and types
```

## 🔌 API Endpoints

### Attributes

- `POST /api/attribute` - Create attributes
- `GET /api/attribute` - List attributes (with search/limit)

### Health

- `GET /health` - Health check

## 🗄️ Database Schema

```prisma
model Attribute {
  id   String @id @default(uuid())
  name String @unique
}
```

## 🧪 Testing

### Local Testing with SAM

```bash
npm run test:local
# API available at http://localhost:3000
```

### Manual Testing

```bash
# Health check
curl http://localhost:4000/health

# Create attribute
curl -X POST http://localhost:4000/api/attribute \
  -H "Content-Type: application/json" \
  -d '{"attributes": "Color"}'

# Get attributes
curl http://localhost:4000/api/attribute
```

## 🚀 Deployment Options

### 1. Quick Deploy (Recommended)

- Uses existing RDS instance
- Creates Lambda + API Gateway
- Fast deployment (~2 minutes)

### 2. Complete Deploy

- Creates VPC, RDS, Lambda, API Gateway
- Full infrastructure setup
- Takes longer (~15 minutes)

### 3. Manual Deploy

- Step-by-step control
- Custom configuration options

## 📊 Monitoring

### CloudWatch Logs

```bash
npm run aws:logs
```

### Metrics

- Lambda invocations, duration, errors
- API Gateway requests, latency
- RDS connections, queries

## 💰 Cost Estimation

| Service      | Usage       | Monthly Cost |
| ------------ | ----------- | ------------ |
| Lambda       | 1M requests | ~$0.20       |
| API Gateway  | 1M requests | ~$3.50       |
| RDS t3.micro | Always on   | ~$15.00      |
| **Total**    |             | **~$20**     |

## 🔧 Troubleshooting

### Common Issues

**Build Errors:**

```bash
rm -rf dist node_modules
npm install && npm run build
```

**Database Connection:**

```bash
npx prisma db pull  # Test connection
```

**CORS Issues:**

- Verify `CORS_ORIGIN` matches frontend URL exactly

### Debugging

**Local Logs:**

```bash
npm run dev  # Check console output
```

**AWS Logs:**

```bash
npm run aws:logs
```

**Database Issues:**

```bash
npm run prisma:studio  # Visual database explorer
```

## 🧹 Cleanup

To remove AWS resources and avoid charges:

```bash
./cleanup.sh  # Remove Lambda + API Gateway
./cleanup.sh --delete-rds  # Also remove RDS (⚠️ deletes data)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally with `npm run test:local`
5. Deploy to test environment
6. Submit a pull request

## 📚 Documentation

- [QUICK_START.md](./QUICK_START.md) - Get started in 5 minutes
- [SERVERLESS_DEPLOYMENT.md](./SERVERLESS_DEPLOYMENT.md) - Detailed deployment guide
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

## 🆘 Support

- **Issues**: Open GitHub issue
- **AWS Problems**: Check CloudWatch logs
- **Database Issues**: Use Prisma Studio

---

Built with ❤️ using TypeScript, Express.js, Prisma, and AWS Serverless
