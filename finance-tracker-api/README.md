# Finance Tracker API

A NestJS-based REST API for tracking personal finances, built with TypeScript and Prisma.

## Features

- User authentication with JWT
- Category management for transactions
- Source management (bank accounts, cash, etc.)
- Transaction tracking
- Budget planning and monitoring
- Swagger API documentation

## Prerequisites

- Node.js (v18 or later)
- PostgreSQL (v14 or later)
- Docker and Docker Compose (optional, for containerized deployment)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd finance-tracker-api
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/finance_tracker"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/finance_tracker"
DB_POOL_SIZE=10
DB_CONNECTION_TIMEOUT=5000
DB_IDLE_TIMEOUT=30000

# JWT
JWT_SECRET="your-secret-key"
JWT_EXPIRATION="24h"

# API
PORT=3000
NODE_ENV=development
```

4. Generate Prisma client:

```bash
npm run prisma:generate
```

5. Run database migrations:

```bash
npm run prisma:migrate
```

## Development

Start the development server:

```bash
npm run start:dev
```

The API will be available at `http://localhost:3000/api`.

## API Documentation

Swagger documentation is available at `http://localhost:3000/api/docs` when the server is running.

## Testing

Run unit tests:

```bash
npm run test
```

Run e2e tests:

```bash
npm run test:e2e
```

## Docker Deployment

1. Build and start the containers:

```bash
docker-compose up -d
```

2. Run database migrations:

```bash
docker-compose exec api npm run prisma:deploy
```

## Project Structure

```
src/
├── auth/           # Authentication module
├── budgets/        # Budget management module
├── categories/     # Transaction categories module
├── common/         # Common utilities and decorators
├── config/         # Configuration module
├── prisma/         # Prisma schema and migrations
├── sources/        # Financial sources module
├── transactions/   # Transaction management module
└── users/          # User management module
```

## Available Scripts

- `npm run build` - Build the application
- `npm run start` - Start the application
- `npm run start:dev` - Start the application in development mode
- `npm run start:debug` - Start the application in debug mode
- `npm run start:prod` - Start the application in production mode
- `npm run lint` - Lint the code
- `npm run test` - Run unit tests
- `npm run test:e2e` - Run e2e tests
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:deploy` - Deploy database migrations
- `npm run prisma:reset` - Reset the database

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
