const request = require('supertest');
const app = require('../app');

// Global test utilities
global.request = request;
global.app = app;

// Mock console methods in test environment to reduce noise
beforeAll(() => {
  // Keep error logs but silence info/debug in tests
  const originalInfo = console.info;
  const originalDebug = console.debug;
  
  if (process.env.NODE_ENV === 'test') {
    console.info = jest.fn();
    console.debug = jest.fn();
  }
  
  // Restore after all tests
  afterAll(() => {
    console.info = originalInfo;
    console.debug = originalDebug;
  });
});

// Helper function to generate random test data
global.generateTestData = {
  email: () => `test.${Date.now()}@example.com`,
  name: () => `Test User ${Date.now()}`,
  password: 'TestPassword123!',
  title: () => `Test Resource ${Date.now()}`,
  description: () => `Test description for resource ${Date.now()}`
};

// Helper function to create test user
global.createTestUser = async (userData = {}) => {
  const User = require('../models/User');
  const defaultData = {
    name: generateTestData.name(),
    email: generateTestData.email(),
    password: generateTestData.password,
    role: 'student'
  };
  
  const data = { ...defaultData, ...userData };
  const userId = await User.create(data);
  
  return {
    id: userId,
    ...data,
    password: undefined // Don't return password
  };
};

// Helper function to login and get token
global.loginAndGetToken = async (email, password) => {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });
  
  return response.body.data.accessToken;
};

// Helper function to create authenticated request
global.authenticatedRequest = async (email, password) => {
  const token = await loginAndGetToken(email, password);
  
  return {
    get: (url) => request(app).get(url).set('Authorization', `Bearer ${token}`),
    post: (url) => request(app).post(url).set('Authorization', `Bearer ${token}`),
    put: (url) => request(app).put(url).set('Authorization', `Bearer ${token}`),
    delete: (url) => request(app).delete(url).set('Authorization', `Bearer ${token}`),
    patch: (url) => request(app).patch(url).set('Authorization', `Bearer ${token}`)
  };
};

// Graceful shutdown for database connections
afterAll(async () => {
  if (global.dbPool) {
    await global.dbPool.end();
  }
});
