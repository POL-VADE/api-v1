# Finance Tracker API

A NestJS-based API for tracking personal finances, built with Prisma and PostgreSQL.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Testing](#testing)
- [Contributing](#contributing)

## Features

- 🔐 Secure authentication with JWT
- 📱 Phone number verification
- 💰 Transaction management
- 📊 Budget tracking
- 🏷️ Category management
- 💳 Source management
- 👤 User profile management
- 🔄 Data synchronization
- 📈 Financial analytics

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Containerization**: Docker & Docker Compose

## Prerequisites

- Docker and Docker Compose
- Node.js 18 or later
- npm or yarn

## Project Structure

```
.
├── docker-compose.yml      # Main Docker Compose configuration
├── deploy.sh              # Deployment script
├── .env                   # Environment variables
└── finance-tracker-api/   # API application directory
    ├── Dockerfile        # API service Dockerfile
    ├── src/             # Source code
    ├── prisma/          # Database schema and migrations
    └── package.json     # Dependencies and scripts
```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Required Variables
JWT_SECRET=your-jwt-secret-key-here
SMS_API_KEY=your-sms-api-key-here
SMS_SENDER_ID=your-sms-sender-id-here

# Optional Variables (with defaults)
JWT_EXPIRATION=24h
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100
```

## Deployment

The application can be deployed using Docker Compose. The deployment script handles all necessary steps:

1. Clone the repository:

```bash
git clone [repository-url]
cd [repository-name]
```

2. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Run the deployment script:

```bash
./deploy.sh
```

The deployment script will:

- Load environment variables
- Check for required configurations
- Build and start Docker containers
- Run database migrations
- Verify service health

The API will be available at:

- API: http://localhost:3000
- API Documentation: http://localhost:3000/api

## API Documentation

The API documentation is available at `/api` when running the application.

### Authentication Endpoints

#### Register

- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "phoneNumber": "+1234567890"
  }
  ```

#### Login

- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

#### Verify Phone

- **POST** `/auth/verify-phone`
- **Body**:
  ```json
  {
    "phoneNumber": "+1234567890",
    "code": "123456"
  }
  ```

### Transaction Endpoints

#### Create Transaction

- **POST** `/transactions`
- **Body**:
  ```json
  {
    "amount": 100.5,
    "type": "expense",
    "categoryId": 1,
    "sourceId": 1,
    "date": "2024-03-20",
    "description": "Grocery shopping"
  }
  ```

#### Get Transactions

- **GET** `/transactions`
- **Query Parameters**:
  - `startDate`: Start date for filtering
  - `endDate`: End date for filtering
  - `type`: Transaction type (income/expense)
  - `categoryId`: Category ID
  - `sourceId`: Source ID

### Category Endpoints

#### Create Category

- **POST** `/categories`
- **Body**:
  ```json
  {
    "name": "Groceries",
    "type": "expense",
    "icon": "shopping-cart"
  }
  ```

#### Get Categories

- **GET** `/categories`
- **Query Parameters**:
  - `type`: Category type (income/expense)

### Source Endpoints

#### Create Source

- **POST** `/sources`
- **Body**:
  ```json
  {
    "name": "Main Bank Account",
    "type": "bank",
    "balance": 1000.0
  }
  ```

#### Get Sources

- **GET** `/sources`

### User Endpoints

#### Get Profile

- **GET** `/users/profile`

#### Update Profile

- **PATCH** `/users/profile`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "phoneNumber": "+1234567890"
  }
  ```

#### Change Password

- **POST** `/users/change-password`
- **Body**:
  ```json
  {
    "currentPassword": "oldpassword",
    "newPassword": "newpassword"
  }
  ```

## Project Structure

```
src/
├── auth/                 # Authentication module
├── users/               # User management module
├── transactions/        # Transaction management module
├── categories/          # Category management module
├── sources/            # Source management module
├── budgets/            # Budget management module
├── common/             # Shared utilities and constants
├── config/             # Configuration files
└── main.ts             # Application entry point
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Register or login to get a JWT token
2. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Data Models

### User

- id: UUID
- email: string
- password: string (hashed)
- name: string
- phoneNumber: string
- isPhoneVerified: boolean
- createdAt: Date
- updatedAt: Date

### Transaction

- id: UUID
- amount: number
- type: 'income' | 'expense'
- categoryId: UUID
- sourceId: UUID
- date: Date
- description: string
- userId: UUID
- createdAt: Date
- updatedAt: Date

### Category

- id: UUID
- name: string
- type: 'income' | 'expense'
- icon: string
- userId: UUID
- createdAt: Date
- updatedAt: Date

### Source

- id: UUID
- name: string
- type: 'bank' | 'cash' | 'credit'
- balance: number
- userId: UUID
- createdAt: Date
- updatedAt: Date

## Testing

Run tests:

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Development

1. Install dependencies:

   ```bash
   cd finance-tracker-api
   npm install
   ```

2. Start the development server:

   ```bash
   npm run start:dev
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

## Deployment

1. Make sure Docker and Docker Compose are installed on your system.

2. Create a `.env` file with the required environment variables.

3. Run the deployment script:
   ```bash
   chmod +x deploy.sh
   ./deploy.sh
   ```

The script will:

- Build and start the Docker containers
- Wait for the database to be ready
- Run database migrations
- Start the application

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

## Available Scripts

- `npm run start:dev` - Start the development server
- `npm run build` - Build the application
- `npm run start:prod` - Start the production server
- `npm run test` - Run tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Run linting

## Docker Commands

- Build and start containers:

  ```bash
  docker-compose up -d
  ```

- View logs:

  ```bash
  docker-compose logs -f
  ```

- Stop containers:

  ```bash
  docker-compose down
  ```

- Rebuild and restart containers:
  ```bash
  docker-compose up -d --build
  ```

## Database Management

- Access the database:

  ```bash
  docker-compose exec db psql -U postgres -d finance_tracker
  ```

- Run Prisma migrations:

  ```bash
  docker-compose exec api npx prisma migrate deploy
  ```

- Generate Prisma client:
  ```bash
  docker-compose exec api npx prisma generate
  ```

## Monitoring

The application exposes the following endpoints for monitoring:

- Health check: `GET /health`
- Metrics: `GET /metrics`

## Security

- All API endpoints (except login) require JWT authentication
- Passwords are hashed using bcrypt
- Environment variables are used for sensitive data
- CORS is enabled for specified origins
- Rate limiting is implemented for API endpoints
