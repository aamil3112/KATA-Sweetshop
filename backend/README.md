# Sweet Shop Backend API

Backend API for the Sweet Shop Management System built with Node.js, TypeScript, Express, and PostgreSQL.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (see `.env.example` for reference):
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sweet_shop
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
```

3. Run database migrations:
```bash
psql -U postgres -d sweet_shop -f migrations/001_initial_schema.sql
```

4. Start the server:
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## Testing

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

## API Documentation

See main README.md for API endpoint documentation.

