import request from 'supertest';
import app from '../app';
import { prismaMock } from './setup';
import { issueAuthToken } from '../auth/token';

const authorization = (userId = 'admin-1', role = 'Admin') => ({
  Authorization: `Bearer ${issueAuthToken(userId, role)}`,
});

describe('Phase 1 data-integrity safeguards', () => {
  it('does not let an admin deactivate the root account or their own account', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'root', isRootAdmin: true } as any);
    const root = await request(app).delete('/api/admin/profiles/root').set(authorization());
    expect(root.status).toBe(403);
    expect(root.body.error).toBe('Cannot delete the root admin account');

    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'admin-1', isRootAdmin: false } as any);
    const self = await request(app).delete('/api/admin/profiles/admin-1').set(authorization());
    expect(self.status).toBe(403);
    expect(self.body.error).toBe('You cannot delete your own account');
  });

  it('soft-deactivates profiles and rejects inactive-account login', async () => {
    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'user-2', isRootAdmin: false } as any);
    prismaMock.user.update.mockResolvedValue({ id: 'user-2', isActive: false } as any);
    const deactivated = await request(app).delete('/api/admin/profiles/user-2').set(authorization());
    expect(deactivated.status).toBe(200);
    expect(prismaMock.user.update).toHaveBeenCalledWith(expect.objectContaining({ data: { isActive: false } }));

    prismaMock.user.findUnique.mockResolvedValueOnce({ id: 'inactive-1', isActive: false } as any);
    const login = await request(app).post('/api/auth/login').send({ email: 'inactive@example.com', password: 'password123' });
    expect(login.status).toBe(403);
  });

  it('validates wildlife data and reports a duplicate case number without a 500', async () => {
    const invalid = await request(app).post('/api/wildlife').set(authorization('entry-1', 'Data Entry')).send({ caseNumber: 'WL-1' });
    expect(invalid.status).toBe(400);
    expect(invalid.body.error).toContain('animal');

    prismaMock.wildlifeCase.create.mockRejectedValue({ code: 'P2002' });
    const duplicate = await request(app).post('/api/wildlife').set(authorization('entry-1', 'Data Entry')).send({
      caseNumber: 'WL-1', dateTime: '2026-09-18', animal: 'Owl', species: 'Barn Owl', schedule: 'Standard',
      location: 'Mysuru', status: 'Pending', complainantName: 'Asha', complainantPhone: '1234567890',
    });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error).toBe('Case number already exists');
  });

  it('assigns declaration numbers on the server and ignores the client value', async () => {
    prismaMock.declaration.count.mockResolvedValue(4);
    prismaMock.declaration.create.mockResolvedValue({ id: 'decl-5', formNo: 'FORM-2026-005' } as any);
    const response = await request(app).post('/api/declarations').set(authorization()).send({
      formNo: 'CLIENT-CONTROLLED', declarerName: 'Asha', address: 'Mysuru', phone: '1234567890',
      email: 'asha@example.com', species: 'Dog', gender: 'Female', age: '2', description: 'Healthy', date: '2026-09-18',
    });
    expect(response.status).toBe(201);
    expect(prismaMock.declaration.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ formNo: 'FORM-2026-005' }),
    });
  });
});
