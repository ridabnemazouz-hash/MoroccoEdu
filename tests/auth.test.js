const request = require('supertest');
const app = require('../app');
const { query } = require('../config/db');

describe('Authentication API', () => {
  // Cleanup after tests
  afterAll(async () => {
    await query('DELETE FROM users WHERE email LIKE ?', ['test.%@example.com']);
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid credentials', async () => {
      const userData = {
        name: 'Test User',
        email: `test.register.${Date.now()}@example.com`,
        password: 'TestPassword123!',
        role: 'student'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.name).toBe(userData.name);
      expect(response.body.data.user.email).toBe(userData.email.toLowerCase());
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'invalid-email',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject registration with short password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: `test.short.${Date.now()}@example.com`,
          password: 'short'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject registration with missing name', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: `test.noname.${Date.now()}@example.com`,
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should reject duplicate email registration', async () => {
      const email = `test.duplicate.${Date.now()}@example.com`;
      
      // First registration
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'First User',
          email: email,
          password: 'TestPassword123!'
        });

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: email,
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    let testEmail;
    let testPassword;

    beforeAll(async () => {
      testEmail = `test.login.${Date.now()}@example.com`;
      testPassword = 'TestPassword123!';
      
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Login Test User',
          email: testEmail,
          password: testPassword
        });
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testEmail);
    });

    it('should set refresh token cookie on login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'].some(cookie => 
        cookie.includes('refreshToken')
      )).toBe(true);
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: 'WrongPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'TestPassword123!'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/refresh', () => {
    let testEmail;
    let testPassword;

    beforeAll(async () => {
      testEmail = `test.refresh.${Date.now()}@example.com`;
      testPassword = 'TestPassword123!';
      
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Refresh Test User',
          email: testEmail,
          password: testPassword
        });
    });

    it('should refresh access token with valid refresh token', async () => {
      // Login first to get refresh token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testEmail,
          password: testPassword
        });

      const cookies = loginResponse.headers['set-cookie'];
      const refreshTokenCookie = cookies.find(c => c.includes('refreshToken'));

      // Refresh token
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', refreshTokenCookie);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should reject refresh without token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/auth/logout', () => {
    let testEmail;
    let testPassword;
    let authToken;

    beforeAll(async () => {
      testEmail = `test.logout.${Date.now()}@example.com`;
      testPassword = 'TestPassword123!';
      
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Logout Test User',
          email: testEmail,
          password: testPassword
        });

      authToken = registerResponse.body.data.accessToken;
    });

    it('should logout successfully with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });
});
