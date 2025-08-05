import request from 'supertest';
import app from '../app';
import { generateToken } from '../utils/jwt';

const testUser = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com'
};

const validToken = generateToken(testUser);

describe('Todo Service', () => {
  describe('GET /api/todos', () => {
    it('should return todos for authenticated user', async () => {
      const response = await request(app)
        .get('/api/todos')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.todos).toBeDefined();
      expect(Array.isArray(response.body.todos)).toBe(true);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/todos')
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });

  describe('POST /api/todos', () => {
    it('should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description'
      };

      const response = await request(app)
        .post('/api/todos')
        .set('Authorization', `Bearer ${validToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body.message).toBe('Todo created successfully');
      expect(response.body.todo.title).toBe(todoData.title);
      expect(response.body.todo.description).toBe(todoData.description);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ title: 'Test' })
        .expect(401);

      expect(response.body.error).toBe('Access token required');
    });
  });
});