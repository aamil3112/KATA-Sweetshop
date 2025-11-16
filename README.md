# Sweet Shop Management System

A full-stack web application for managing a sweet shop inventory, built with Node.js/TypeScript, React, and MongoDB. This project follows Test-Driven Development (TDD) principles and demonstrates modern software development practices.

## 🎯 Project Overview

The Sweet Shop Management System is a comprehensive solution that allows users to:
- Register and authenticate securely
- Browse and search for sweets
- Purchase sweets (decreasing inventory)
- Manage inventory (admin users can add, update, delete, and restock sweets)

## 🏗️ Architecture

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest with Supertest
- **Architecture**: MVC pattern with Service layer

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router
- **Styling**: CSS Modules with modern responsive design
- **State Management**: React Context API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (v6 or higher) or MongoDB Atlas account
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd KATA-Sweetshop-1
```

### 2. Database Setup

1. Make sure MongoDB is running locally:
   - **macOS (Homebrew)**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
   - **Windows**: Start MongoDB service from Services panel
   - **Cloud**: Use MongoDB Atlas connection string

2. MongoDB will automatically create the database on first connection. No migrations needed - Mongoose handles schema creation.

### 3. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `backend` directory:
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/sweet_shop

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=3001
NODE_ENV=development
```

4. (Optional) Seed the database with sample data:
```bash
npm run seed
```
This will add 12 sample sweets and create an admin user (email: `admin@sweetshop.com`, password: `admin123`).

5. Start the backend server:
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

The backend API will be available at `http://localhost:3001`

### 4. Frontend Setup

1. Navigate to the frontend directory (in a new terminal):
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the `frontend` directory (optional):
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend application will be available at `http://localhost:3000`

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm test
```

To run tests in watch mode:
```bash
npm run test:watch
```

To generate coverage report:
```bash
npm run test:coverage
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Sweets (Protected - Requires Authentication)
- `GET /api/sweets` - Get all sweets
- `GET /api/sweets/:id` - Get a specific sweet by ID
- `GET /api/sweets/search` - Search sweets (query params: name, category, minPrice, maxPrice)
- `POST /api/sweets` - Create a new sweet
- `PUT /api/sweets/:id` - Update a sweet
- `DELETE /api/sweets/:id` - Delete a sweet (Admin only)

### Inventory (Protected - Requires Authentication)
- `POST /api/sweets/:id/purchase` - Purchase a sweet (decreases quantity)
- `POST /api/sweets/:id/restock` - Restock a sweet (Admin only, increases quantity)

### Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 🎨 Features

### User Features
- User registration and login
- Browse all available sweets
- Search and filter sweets by name, category, and price range
- Purchase sweets (with automatic inventory management)
- View stock availability

### Admin Features
- All user features plus:
- Add new sweets to inventory
- Edit existing sweets
- Delete sweets
- Restock inventory

## 📸 Screenshots

_Note: Add screenshots of your application here after running it locally_

1. Login Page
2. Dashboard with Sweet List
3. Search and Filter Interface
4. Admin Panel (Add/Edit/Delete sweets)

## 🏗️ Project Structure

```
KATA-Sweetshop-1/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Auth and error middleware
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utility functions
│   │   └── app.ts           # Express app setup
│   ├── tests/               # Test files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React context providers
│   │   ├── services/        # API service layer
│   │   └── App.tsx          # Main app component
│   └── package.json
└── README.md
```

## 🔒 Security Features

- Password hashing using bcrypt
- JWT-based authentication
- Protected API routes
- Role-based access control (Admin vs User)
- Input validation using express-validator
- NoSQL injection prevention through Mongoose validation and sanitization

## 🧪 Test Coverage

The project includes comprehensive test coverage for:
- Authentication (register, login)
- Sweets CRUD operations
- Inventory management (purchase, restock)
- Authorization and access control
- Input validation

Run `npm run test:coverage` in the backend directory to see detailed coverage reports.

## 🚀 Deployment

### Backend Deployment

1. Set environment variables on your hosting platform
2. Build the project: `npm run build`
3. Start the server: `npm start`

### Frontend Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting platform (Vercel, Netlify, etc.)
3. Set the `VITE_API_URL` environment variable to point to your backend API

## 📝 Development Workflow

This project follows TDD (Test-Driven Development) principles:
1. **Red**: Write a failing test
2. **Green**: Write minimal code to make the test pass
3. **Refactor**: Improve the code while keeping tests green

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes with clear messages
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational purposes as part of a coding kata.

---

## My AI Usage

During the development of this project, I used AI coding assistants to help with:

- Code suggestions and boilerplate generation
- Debugging and error resolution
- Documentation formatting
- Test structure suggestions

AI tools were used as development aids to enhance productivity while maintaining full code ownership and architectural control.

## 📧 Contact

For questions or issues, please open an issue in the repository.

---

**Note**: This project was developed as part of a TDD kata exercise. All code follows TDD principles with tests written before implementation.

