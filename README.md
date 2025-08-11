# Todo Application - Microservices Architecture

A full-stack todo application built with Node.js, TypeScript, PostgreSQL, and Docker, following microservices architecture principles.

## 🏗️ Architecture Overview

This application consists of three main services:

- **User Service** - Handles user authentication and JWT token management
- **Todo Service** - Manages todo CRUD operations with JWT validation
- **Frontend** - Simple HTML/JavaScript client interface

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Git

### 1. Clone the Repository
```bash
git clone <https://github.com/mtauqeer248/Todo-app-Micro.git>
cd todo-app
```

### 2. Environment Setup
```bash
cp .env.example .env
# Database Configuration
POSTGRES_USER=<your_postgres_username>
POSTGRES_PASSWORD=<your_postgres_password>
POSTGRES_DB=<your_postgres_database_name>
DB_HOST=<your_database_host>
DB_PORT=<your_database_port>

# JWT Configuration
JWT_SECRET=<your_jwt_secret_key>
JWT_EXPIRES_IN=<jwt_token_expiration_time>

# Services Ports
USER_SERVICE_PORT=<user_service_port>
TODO_SERVICE_PORT=<todo_service_port>
FRONTEND_PORT=<frontend_port>

# Node Environment
NODE_ENV=<development_or_production>
```

### 3. Run with Docker
```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### 4. Access the Application
- 🌐 Frontend: http://localhost:3000
- 👤 User Service: http://localhost:3001
- 📝 Todo Service: http://localhost:3002

## 📁 Project Structure

```
todo-app/
├── user-service/          # Authentication microservice
├── todo-service/          # Todo management microservice
├── frontend/              # Client application
├── api-docs/             # API documentation
├── docker-compose.yml    # Docker orchestration
└── .env                  # Environment variables
```

## 🔧 Development

### Local Development Setup
```bash
# Install dependencies for each service
cd user-service && npm install
cd ../todo-service && npm install
cd ../frontend && npm install
```

### Running Tests
```bash
# User service tests
cd user-service && npm test

# Todo service tests
cd todo-service && npm test
```

## 📈 Monitoring & Logging

### Health Checks
Each service exposes a `/health` endpoint for monitoring:
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
```

### Logs
```bash
# View all service logs
docker-compose logs

# View specific service logs
docker-compose logs user-service
docker-compose logs todo-service
```


Detailed API documentation is available in:
- `api-docs/openapi.yaml` - OpenAPI 3.0 specification


