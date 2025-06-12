# Reprecinct Backend Service API Documentation

## Overview

This is the backend service for the Reprecinct application, providing REST API endpoints for managing attributes and other application data.

## API Documentation

The API documentation is available via Swagger UI at:

- **Development**: `http://localhost:4000/api-docs`
- **Production**: `{BASE_URL}/api-docs`

You can also access the raw OpenAPI specification at:

- **JSON format**: `{BASE_URL}/api-docs.json`

## Available Endpoints

### Attributes

#### Create Attributes

- **POST** `/api/attribute`
- Creates one or more attributes
- Supports both single string and array of strings
- Returns lists of created and skipped attributes

#### Get Attributes

- **GET** `/api/attribute`
- Retrieves attributes with optional filtering
- Query parameters:
  - `limit` (number): Maximum number of results (0 = no limit)
  - `search` (string): Search term to filter by name

### Health Check

#### Health Status

- **GET** `/health`
- Returns service health status and timestamp

## Data Models

### Attribute

```typescript
{
  id: string; // UUID
  name: string; // Attribute name (unique)
}
```

### Create Attribute Request

```typescript
{
  attributes: string | string[];  // Single attribute or array of attributes
}
```

### Create Attribute Response

```typescript
{
  data: {
    created: string[];   // Successfully created attributes
    skipped: string[];   // Skipped attributes (already exist)
  }
}
```

### Attributes List Response

```typescript
{
  data: Attribute[];  // Array of attribute objects
  total: number;      // Total count
}
```

## Development

### Running the Server

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

### Database Operations

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio
npm run prisma:studio

# Reset database
npm run prisma:reset
```

## Environment Variables

- `PORT` - Server port (default: 4000)
- `DATABASE_URL` - PostgreSQL connection string
- `CORS_ORIGIN` - Allowed CORS origin (default: http://localhost:3000)
- `API_BASE_URL` - Base URL for API documentation

## CORS Configuration

The API supports CORS with the following configuration:

- **Origin**: Configurable via `CORS_ORIGIN` environment variable
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization
- **Credentials**: Enabled

## Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

Error responses follow this format:

```json
{
  "error": "Error message description"
}
```

## Security

The API includes the following security measures:

- **Helmet.js** for setting security headers
- **CORS** configuration for cross-origin requests
- Input validation for request bodies
- Environment-based configuration
