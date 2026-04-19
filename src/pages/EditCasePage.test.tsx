import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EditCasePage from './EditCasePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { mockAppContext } from '../test/mocks';

const mockUpdateCase = jest.fn();

// Mocking the context
jest.mock('../context/AppContext', () => ({
  useAppContext: () => ({
    ...mockAppContext,
    updateCase: mockUpdateCase,
    isLoading: false,
  }),
}));

const mockCase = {
  id: 'case-123',
  title: 'Dog Rescue - CASE-TEST',
  location: 'Hebbal, Street 5',
  description: 'Injured limb',
  status: 'Under Treatment',
  imageUrl: 'http://example.com/dog.jpg',
  createdAt: '2026-04-19 08:00',
  reporter: {
    name: 'John Doe',
    phone: '9876543210',
    address: 'Mysuru'
  }
};

const renderEditCase = () => {
  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/edit/:caseId" element={<EditCasePage />} />
      </Routes>
    </BrowserRouter>
  );
};

describe('EditCasePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    fetchMock.resetMocks();
    
    // Default fetch response for case details
    fetchMock.mockResponse(JSON.stringify(mockCase));
    
    // Simulate navigation to /edit/case-123
    window.history.pushState({}, '', '/edit/case-123');
  });

  it('loads case data and renders form correctly', async () => {
    renderEditCase();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('CASE-TEST')).toBeInTheDocument();
      expect(screen.getByDisplayValue(/Hebbal, Street 5/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    });
  });

  it('submits updated data successfully', async () => {
    renderEditCase();
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('CASE-TEST')).toBeInTheDocument();
    });

    const caseInput = screen.getByLabelText(/Case Number \*/i);
    fireEvent.change(caseInput, { target: { value: 'CASE-UPDATED' } });

    const updateBtn = screen.getByText(/Update Registry Record/i);
    fireEvent.click(updateBtn);

    await waitFor(() => {
      expect(mockUpdateCase).toHaveBeenCalledWith(expect.objectContaining({
        title: expect.stringContaining('CASE-UPDATED')
      }));
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining('CASE-UPDATED has been updated'));
    });
  });

  it('handles "case not found" scenario', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ error: 'Not found' }), { status: 404 });
    
    renderEditCase();
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Case not found.");
    });
  });
});
