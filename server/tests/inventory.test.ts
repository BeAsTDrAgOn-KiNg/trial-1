import request from 'supertest';
import app from '../app';
import { prismaMock } from './setup';

describe('Inventory & Medical API', () => {
  it('should list medicines', async () => {
    prismaMock.medicine.findMany.mockResolvedValue([
      { id: '1', name: 'Paracetamol', quantity: 100 }
    ] as any);

    const res = await request(app).get('/api/inventory/medicines');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Paracetamol');
  });

  it('should record medicine usage and decrement stock (Transaction)', async () => {
    // Mock the transaction result
    prismaMock.$transaction.mockResolvedValue([
      { id: 'usage-1', medicineId: 'med-1', quantity: '5' },
      { id: 'med-1', quantity: 95 }
    ]);

    const res = await request(app)
      .post('/api/medicine-usages')
      .send({
        medicineId: 'med-1',
        quantity: 5,
        medicineName: 'Paracetamol',
        takenBy: 'Dr. Smith',
        purpose: 'Fever'
      });

    expect(res.status).toBe(201);
    expect(prismaMock.$transaction).toHaveBeenCalled();
  });

  it('should create housekeeping supply', async () => {
    prismaMock.housekeepingSupply.create.mockResolvedValue({ id: 'h-1', name: 'Soap' } as any);

    const res = await request(app)
      .post('/api/inventory/housekeeping')
      .send({ name: 'Soap', quantity: 10, minStockLevel: 2, unit: 'pcs' });

    expect(res.status).toBe(201);
    expect(prismaMock.housekeepingSupply.create).toHaveBeenCalled();
  });
});
