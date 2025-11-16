import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test_secret_key';
process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop_test';

// Connect to test database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

