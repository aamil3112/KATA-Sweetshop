import request from 'supertest';
import app from '../src/app';
import mongoose from '../src/config/database';
import UserModel from '../src/models/User';
import SweetModel from '../src/models/Sweet';
import { generateToken } from '../src/utils/jwt';

describe('Inventory API', () => {
  let authToken: string;
  let adminToken: string;
  let testUserId: string;
  let testAdminId: string;
  let testSweetId: string;

  beforeAll(async () => {
    // Connect to test database if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet_shop_test');
    }

    // Create test user
    const user = await UserModel.create({
      email: 'inventoryuser@test.com',
      password_hash: 'hashed',
      role: 'user',
    });
    testUserId = user._id.toString();
    authToken = generateToken({
      userId: testUserId,
      email: 'inventoryuser@test.com',
      role: 'user',
    });

    // Create test admin
    const admin = await UserModel.create({
      email: 'inventoryadmin@test.com',
      password_hash: 'hashed',
      role: 'admin',
    });
    testAdminId = admin._id.toString();
    adminToken = generateToken({
      userId: testAdminId,
      email: 'inventoryadmin@test.com',
      role: 'admin',
    });

    // Create test sweet
    const sweet = await SweetModel.create({
      name: 'Test Purchase Sweet',
      category: 'Candy',
      price: 2.99,
      quantity: 10,
    });
    testSweetId = sweet._id.toString();
  });

  afterAll(async () => {
    await UserModel.deleteMany({ _id: { $in: [testUserId, testAdminId] } });
    await SweetModel.deleteMany({ _id: testSweetId });
  });

  describe('POST /api/sweets/:id/purchase', () => {
    beforeEach(async () => {
      // Reset quantity before each test
      await SweetModel.findByIdAndUpdate(testSweetId, { quantity: 10 });
    });

    it('should purchase a sweet and decrease quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 3,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(7);

      // Verify in database
      const sweet = await SweetModel.findById(testSweetId);
      expect(sweet?.quantity).toBe(7);
    });

    it('should purchase with default quantity of 1', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(6); // 7 - 1 from previous test
    });

    it('should fail if insufficient stock', async () => {
      // Set quantity to 2
      await SweetModel.findByIdAndUpdate(testSweetId, { quantity: 2 });

      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toContain('Insufficient stock');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/purchase`)
        .send({
          quantity: 1,
        });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    beforeEach(async () => {
      // Reset quantity before each test
      await SweetModel.findByIdAndUpdate(testSweetId, { quantity: 10 });
    });

    it('should restock a sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(200);
      expect(response.body.quantity).toBe(15); // 10 + 5

      // Verify in database
      const sweet = await SweetModel.findById(testSweetId);
      expect(sweet?.quantity).toBe(15);
    });

    it('should fail for non-admin users', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(403);
    });

    it('should fail with zero or negative quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          quantity: 0,
        });

      expect(response.status).toBe(400);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/api/sweets/${testSweetId}/restock`)
        .send({
          quantity: 5,
        });

      expect(response.status).toBe(401);
    });
  });
});
