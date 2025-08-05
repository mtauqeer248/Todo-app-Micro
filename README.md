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
# Edit .env file with your configurations
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
- 🗄️ Database: localhost:5432

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

### Building Services
```bash
# Build TypeScript to JavaScript
cd user-service && npm run build
cd ../todo-service && npm run build
```

## 🔐 Security Features

- Password hashing with bcryptjs (12 salt rounds)
- JWT authentication with configurable expiration
- Input validation using Joi
- Rate limiting (100 requests per 15 minutes)
- CORS and security headers with Helmet
- SQL injection prevention with parameterized queries

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Todos Table
```sql
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_uuid UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);
```

## 🛠️ API Endpoints

### User Service (Port 3001)
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /health` - Health check

### Todo Service (Port 3002)
- `GET /api/todos` - Get user's todos
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /health` - Health check

## 🧪 Testing

The application includes comprehensive unit tests for all user stories:

### User Service Tests
- User registration with validation
- User login with JWT token generation
- Error handling for invalid inputs

### Todo Service Tests
- CRUD operations with authentication
- JWT token validation
- User authorization for todo ownership

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🐳 Docker Configuration

### Services
- **postgres**: PostgreSQL 15 database
- **user-service**: Node.js authentication service
- **todo-service**: Node.js todo management service
- **frontend**: Static file server for client

### Networks
- `todo-network`: Bridge network for inter-service communication

### Volumes
- `postgres_data`: Persistent database storage

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

## 🔄 CI/CD Ready

The project is structured for easy integration with CI/CD pipelines:

- Dockerfile for each service
- Docker Compose for orchestration
- Comprehensive test suite
- Environment-based configuration
- Health check endpoints

## 🛡️ Production Considerations

Before deploying to production:

1. **Environment Variables**: Update `.env` with production values
2. **Database**: Use managed PostgreSQL service
3. **Secrets**: Use proper secret management
4. **HTTPS**: Configure SSL/TLS certificates
5. **Load Balancing**: Add load balancer for high availability
6. **Monitoring**: Implement proper logging and monitoring
7. **Backup**: Set up database backup strategy

## 📚 API Documentation

Detailed API documentation is available in:
- `api-docs/openapi.yaml` - OpenAPI 3.0 specification
- `api-docs/postman-collection.json` - Postman collection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL container is running
docker-compose ps postgres

# View database logs
docker-compose logs postgres
```

**Service Not Starting**
```bash
# Rebuild containers
docker-compose up --build --force-recreate

# Check service logs
docker-compose logs [service-name]
```

**Port Conflicts**
```bash
# Check if ports are in use
netstat -an | grep :3001
netstat -an | grep :3002
netstat -an | grep :5432
```

### Support

For support, please create an issue in the GitHub repository or contact the development team.

# .env.example
# Database Configuration
POSTGRES_USER=todoapp
POSTGRES_PASSWORD=todoapp123
POSTGRES_DB=todoapp
DB_HOST=postgres
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-please
JWT_EXPIRES_IN=24h

# Service Ports
USER_SERVICE_PORT=3001
TODO_SERVICE_PORT=3002
FRONTEND_PORT=3000

# Environment
NODE_ENV=development

# Makefile
.PHONY: build up down logs test clean help

# Default target
help:
	@echo "Available commands:"
	@echo "  build     - Build all Docker images"
	@echo "  up        - Start all services"
	@echo "  down      - Stop all services"
	@echo "  logs      - View service logs"
	@echo "  test      - Run all tests"
	@echo "  clean     - Clean up containers and images"
	@echo "  help      - Show this help message"

# Build all services
build:
	docker-compose build

# Start all services
up:
	docker-compose up -d

# Stop all services
down:
	docker-compose down

# View logs
logs:
	docker-compose logs -f

# Run tests
test:
	cd user-service && npm test
	cd todo-service && npm test

# Clean up
clean:
	docker-compose down -v
	docker system prune -f

# Development setup
dev-setup:
	cd user-service && npm install
	cd todo-service && npm install
	cd frontend && npm install

# Start services in development mode
dev:
	docker-compose -f docker-compose.dev.yml up

# Production build
prod-build:
	docker-compose -f docker-compose.prod.yml build