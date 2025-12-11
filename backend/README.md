# Sweet Shop Backend API

Backend API for the Sweet Shop Management System built with Node.js, TypeScript, Express, and MongoDB.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (see `.env.example` for reference):
```env
MONGODB_URI=mongodb://localhost:27017/sweet_shop
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=24h
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

3. Start the server:
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

