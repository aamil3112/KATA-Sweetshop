# Quick Setup Guide

## Prerequisites
- Node.js v18+
- MongoDB v6+ (or use MongoDB Atlas for cloud)
- npm or yarn

## Step-by-Step Setup

### 1. Database Setup
```bash
# Make sure MongoDB is running locally
# For macOS with Homebrew:
brew services start mongodb-community

# For Linux:
sudo systemctl start mongod

# For Windows:
# Start MongoDB service from Services panel

# MongoDB will create the database automatically on first connection
# No migrations needed - Mongoose handles schema creation
```

### 2. Backend Setup
```bash
cd backend
npm install

# Copy environment file
cp env.example .env
# Edit .env with your MongoDB connection string
# Default: mongodb://localhost:27017/sweet_shop

# (Optional) Seed database with sample data
npm run seed
# This adds 12 sample sweets and creates an admin user

# Start backend (in development mode)
npm run dev
```

Backend will run on `http://localhost:3001`

### 3. Frontend Setup
```bash
# In a new terminal
cd frontend
npm install

# Start frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Test the Application

1. Open `http://localhost:3000` in your browser
2. Register a new account
3. Login with your credentials
4. Start browsing and managing sweets!

### 5. Create an Admin User (Optional)

To create an admin user, you can use MongoDB shell:
```javascript
// Connect to MongoDB
mongosh sweet_shop

// Update user role
db.users.updateOne(
  { email: 'your-email@example.com' },
  { $set: { role: 'admin' } }
)
```

Or use MongoDB Compass or any MongoDB client to update the user document.

## Running Tests

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Troubleshooting

### Database Connection Issues
- Ensure MongoDB is running
- Check your `.env` file has correct MONGODB_URI
- Verify MongoDB connection: `mongosh` or `mongo` (older versions)
- For MongoDB Atlas, ensure your IP is whitelisted

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/vite.config.ts`

### CORS Issues
- Ensure backend is running before frontend
- Check `backend/src/app.ts` has CORS enabled

