import request from 'supertest';
import { app } from '../../app';

describe('signup routes', () => {
  it('should return a 201 on successful signup', async () => {
    return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);
  });
});
