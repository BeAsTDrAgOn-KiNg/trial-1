import request from 'supertest';
import app from '../app';
import { prismaMock } from './setup';

describe('Transactional & Other Entity APIs', () => {
  it('should create a wildlife case', async () => {
    prismaMock.wildlifeCase.create.mockResolvedValue({ id: 'w-1' } as any);
    const res = await request(app).post('/api/wildlife').send({ caseNumber: 'W001', animal: 'Eagle' });
    expect(res.status).toBe(201);
  });

  it('should create a staff member', async () => {
    prismaMock.staffMember.create.mockResolvedValue({ id: 's-1' } as any);
    const res = await request(app).post('/api/staff').send({ name: 'John', role: 'Vet' });
    expect(res.status).toBe(201);
  });

  it('should create a donation', async () => {
    prismaMock.donation.create.mockResolvedValue({ id: 'd-1' } as any);
    const res = await request(app).post('/api/donations').send({ donorName: 'Alice', amount: 50.5 });
    expect(res.status).toBe(201);
  });

  it('should create an adoption record', async () => {
    prismaMock.adoption.create.mockResolvedValue({ id: 'a-1' } as any);
    const res = await request(app).post('/api/adoptions').send({ animalId: '1', userId: '1', status: 'pending' });
    expect(res.status).toBe(201);
  });
});
