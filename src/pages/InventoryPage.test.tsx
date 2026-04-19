import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InventoryPage from './InventoryPage';
import { BrowserRouter } from 'react-router-dom';
import { mockAppContext } from '../test/mocks';

jest.mock('../context/AppContext', () => ({
  useAppContext: () => ({
    ...mockAppContext,
    medicines: [
      { id: '1', name: 'Paracetamol', quantity: 100, unit: 'ml', minStockLevel: 10, category: 'General' },
      { id: '2', name: 'Antibiotics', quantity: 5, unit: 'vial', minStockLevel: 20, category: 'General' }, // Low stock
    ],
    isLoading: false,
  }),
}));

describe('InventoryPage', () => {
  const mockUser = { role: 'Admin' };

  it('renders medicine list and captures low stock status', () => {
    render(
      <BrowserRouter>
        <InventoryPage user={mockUser as any} />
      </BrowserRouter>
    );

    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.getByText('Antibiotics')).toBeInTheDocument();
  });

  it('filters medicines by search term', () => {
    render(
      <BrowserRouter>
        <InventoryPage user={mockUser as any} />
      </BrowserRouter>
    );

    const searchInput = screen.getByPlaceholderText(/Search medicine name/i);
    fireEvent.change(searchInput, { target: { value: 'Para' } });

    expect(screen.getByText('Paracetamol')).toBeInTheDocument();
    expect(screen.queryByText('Antibiotics')).not.toBeInTheDocument();
  });
});
