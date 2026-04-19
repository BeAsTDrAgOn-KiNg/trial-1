import request from 'supertest';
import app from '../app';
import { prismaMock } from './setup';
import bcrypt from 'bcryptjs';

describe('Auth API', () => {
  const password = 'password123';
  const hashedPassword = 'hashed_password';

  it('should register a new user', async () => {
    prismaMock.user.create.mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      email: 'test@example.com',
      role: 'Admin',
      phone: '1234567890',
      password: hashedPassword,
      createdAt: new Date()
    } as any);

    const res = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        phone: '1234567890',
        role: 'Admin',
        password: password
      });

    expect(res.status).toBe(201);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('email', 'test@example.com');
  });

  it('should log in an existing user', async () => {
    const realHashed = await bcrypt.hash(password, 10);
    
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      fullName: 'Test User',
      email: 'test@example.com',
      password: realHashed,
      role: 'Admin'
    } as any);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: password
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('fullName', 'Test User');
    expect(res.body).not.toHaveProperty('password');
  });

  it('should reject login with wrong password', async () => {
    const realHashed = await bcrypt.hash(password, 10);
    
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'user-1',
      password: realHashed
    } as any);

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error', 'Invalid credentials');
  });
});
