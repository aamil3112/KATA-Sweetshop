import request from 'supertest';
import app from '../src/app';
import mongoose from '../src/config/database';
import UserModel from '../src/models/User';
import SweetModel from '../src/models/Sweet';
import { generateToken } from '../src/utils/jwt';

describe('Sweets API', () => {
  let authToken: string;
  let adminToken: string;
  let testUserId: string;
  let testAdminId: string;

  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop_test');
    }

    // Create test user
    const user = await UserModel.create({
      email: 'sweetsuser@test.com',
      password_hash: 'hashed',
      role: 'user',
    });
    testUserId = user._id.toString();
    authToken = generateToken({
      userId: testUserId,
      email: 'sweetsuser@test.com',
      role: 'user',
    });

    // Create test admin
    const admin = await UserModel.create({
      email: 'sweetsadmin@test.com',
      password_hash: 'hashed',
      role: 'admin',
    });
    testAdminId = admin._id.toString();
    adminToken = generateToken({
      userId: testAdminId,
      email: 'sweetsadmin@test.com',
      role: 'admin',
    });

    // Clean up test sweets
    await SweetModel.deleteMany({ name: { $regex: /^Test/ } });
  });

  afterAll(async () => {
    await UserModel.deleteMany({ _id: { $in: [testUserId, testAdminId] } });
    await SweetModel.deleteMany({ name: { $regex: /^Test/ } });
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet with authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Chocolate',
          category: 'Chocolate',
          price: 5.99,
          quantity: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body.name).toBe('Test Chocolate');
      expect(response.body.category).toBe('Chocolate');
      expect(response.body.price).toBe(5.99);
      expect(response.body.quantity).toBe(10);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .send({
          name: 'Test Sweet',
          category: 'Candy',
          price: 3.99,
          quantity: 5,
        });

      expect(response.status).toBe(401);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Sweet',
          // Missing category and price
        });

      expect(response.status).toBe(400);
    });

    it('should fail with negative price', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Sweet',
          category: 'Candy',
          price: -5.99,
          quantity: 5,
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/sweets', () => {
    it('should get all sweets with authentication', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/api/sweets');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Create test sweets for search
      await SweetModel.create({
        name: 'Test Lollipop',
        category: 'Candy',
        price: 2.50,
        quantity: 20,
      });
      await SweetModel.create({
        name: 'Test Gummy Bears',
        category: 'Gummy',
        price: 3.99,
        quantity: 15,
      });
    });

    it('should search sweets by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=Lollipop')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should search sweets by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Gummy')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should search sweets by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=4')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await SweetModel.create({
        name: 'Test Update Sweet',
        category: 'Candy',
        price: 4.99,
        quantity: 10,
      });
      sweetId = sweet._id.toString();
    });

    it('should update a sweet with authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Sweet Name',
          price: 6.99,
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Sweet Name');
      expect(response.body.price).toBe(6.99);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({
          name: 'Updated Name',
        });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: string;

    beforeEach(async () => {
      const sweet = await SweetModel.create({
        name: 'Test Delete Sweet',
        category: 'Candy',
        price: 3.99,
        quantity: 5,
      });
      sweetId = sweet._id.toString();
    });

    it('should delete a sweet as admin', async () => {
      const response = await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(204);
    });

    it('should fail for non-admin users', async () => {
      const sweet = await SweetModel.create({
        name: 'Test Delete Sweet 2',
        category: 'Candy',
        price: 3.99,
        quantity: 5,
      });
      const newSweetId = sweet._id.toString();

      const response = await request(app)
        .delete(`/api/sweets/${newSweetId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });
});
