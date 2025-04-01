import request from 'supertest';
import app from '../src/app';

describe('AuthController', () => {
  it('debe rechazar login sin token', async () => {
    const res = await request(app).post('/api/auth/google').send({});
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});