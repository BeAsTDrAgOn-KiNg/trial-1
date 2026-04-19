import request from 'supertest';
import app from '../app';
import { prismaMock } from './setup';

describe('General API Endpoints', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('should sanitize data in case creation', async () => {
    // Problematic payload with relational and immutable fields
    const payload = {
      title: 'Injury Case',
      description: 'Limping dog',
      location: 'South Delhi',
      clinicalEntries: [], // Should be stripped
      reporter: { name: 'Fake' }, // Should be stripped
      id: 'intentional-collision', // Should be stripped
      createdAt: '2021-01-01T00:00:00.000Z' // Should be stripped
    };

    // Mock Prisma response
    prismaMock.case.create.mockResolvedValue({
      id: 'uuid-123',
      title: 'Injury Case',
      description: 'Limping dog',
      location: 'South Delhi',
      status: 'open',
      reportedById: null,
      imageUrl: null,
      createdAt: new Date()
    } as any);

    const res = await request(app)
      .post('/api/cases')
      .send(payload);

    expect(res.status).toBe(201);
    
    // Check that prisma.case.create was called with SANITIZED data
    expect(prismaMock.case.create).toHaveBeenCalledWith({
      data: {
        title: 'Injury Case',
        description: 'Limping dog',
        location: 'South Delhi'
      }
    });
  });

  it('should sanitize data in animal update', async () => {
    const payload = {
      name: 'Buddy Updated',
      abcRecord: { id: 'abc' }, // Should be stripped
      adoptions: [], // Should be stripped
    };

    prismaMock.animal.update.mockResolvedValue({
      id: 'animal-1',
      name: 'Buddy Updated',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: 2,
      gender: 'Male',
      healthStatus: 'Healthy',
      location: 'Shelter',
      imageUrl: null,
      status: 'available',
      createdAt: new Date()
    } as any);

    const res = await request(app)
      .patch('/api/animals/animal-1')
      .send(payload);

    expect(res.status).toBe(200);
    
    // Check that prisma.animal.update was called with SANITIZED data
    expect(prismaMock.animal.update).toHaveBeenCalledWith({
      where: { id: 'animal-1' },
      data: {
        name: 'Buddy Updated'
      }
    });
  });
});
