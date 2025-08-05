import request from 'supertest';
import app from '../app';

describe('User Service', () => {
  describe('POST /api/users/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(201);

      expect(response.body.message).toBe('User created successfully');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user.password_hash).toBeUndefined();
    });

    it('should return 400 for invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('email');
    });

    it('should return 400 for short password', async () => {
      const userData = {
        email: 'test@example.com',
        password: '123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData)
        .expect(400);

      expect(response.body.error).toContain('password');
    });
  });

  describe('POST /api/users/login', () => {
    it('should login with valid credentials', async () => {
      // First register a user
      await request(app)
        .post('/api/users/register')
        .send({
          email: 'login@example.com',
          password: 'password123'
        });

      // Then login
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBeDefined();
      expect(response.body.user.email).toBe('login@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.error).toBe('Invalid credentials');
    });
  });
});