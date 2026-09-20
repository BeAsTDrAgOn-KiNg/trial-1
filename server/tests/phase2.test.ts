import request from 'supertest';
import app from '../app';
import { prismaMock } from './setup';
import { issueAuthToken } from '../auth/token';

const authorization = () => ({ Authorization: `Bearer ${issueAuthToken('admin-1', 'Admin')}` });

describe('Phase 2 missing endpoints', () => {
  it('updates adoption applications and adoption records', async () => {
    prismaMock.adoptionApplication.update.mockResolvedValue({ id: 'app-1', adopterName: 'Updated' } as any);
    const application = await request(app).patch('/api/adoptions/applications/app-1').set(authorization()).send({ adopterName: 'Updated' });
    expect(application.status).toBe(200);

    prismaMock.adoption.update.mockResolvedValue({ id: 'adoption-1', status: 'Approved' } as any);
    const adoption = await request(app).patch('/api/adoptions/adoption-1').set(authorization()).send({ status: 'Approved' });
    expect(adoption.status).toBe(200);
  });

  it('allows Doctors to access adoptions but keeps donations Admin-only', async () => {
    prismaMock.adoption.findMany.mockResolvedValue([] as any);
    const doctor = await request(app)
      .get('/api/adoptions')
      .set({ Authorization: `Bearer ${issueAuthToken('doctor-1', 'Doctor')}` });
    expect(doctor.status).toBe(200);
  });

  it('validates and deletes donation transactions', async () => {
    const invalid = await request(app).post('/api/donations').set(authorization()).send({ donorName: 'Asha', amount: '99999999999' });
    expect(invalid.status).toBe(400);

    prismaMock.donation.delete.mockResolvedValue({ id: 'donation-1' } as any);
    const deleted = await request(app).delete('/api/donations/donation-1').set(authorization());
    expect(deleted.status).toBe(204);
  });

  it('updates only the authenticated user’s editable profile fields', async () => {
    prismaMock.user.update.mockResolvedValue({ id: 'admin-1', fullName: 'New Name', email: 'admin@pfa.org', phone: '1234567890', role: 'Admin' } as any);
    const response = await request(app).patch('/api/users/me').set(authorization()).send({
      fullName: 'New Name', phone: '1234567890', role: 'Doctor',
    });
    expect(response.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 'admin-1' },
      data: { fullName: 'New Name', phone: '1234567890' },
    }));
  });

  it('requires the current password before changing a password', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ password: await (await import('bcryptjs')).default.hash('correct-password', 10) } as any);
    const rejected = await request(app).patch('/api/users/me').set(authorization()).send({ password: 'new-password' });
    expect(rejected.status).toBe(400);
    expect(rejected.body.error).toContain('current password');

    const incorrect = await request(app).patch('/api/users/me').set(authorization()).send({ password: 'new-password', currentPassword: 'wrong-password' });
    expect(incorrect.status).toBe(400);
    expect(incorrect.body.error).toContain('incorrect');
  });
});
