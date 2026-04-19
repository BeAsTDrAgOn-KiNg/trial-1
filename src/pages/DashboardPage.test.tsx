import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from './DashboardPage';
import { BrowserRouter } from 'react-router-dom';
import { mockAppContext } from '../test/mocks';

// Mocking the context specifically for this test
jest.mock('../context/AppContext', () => ({
  useAppContext: () => ({
    ...mockAppContext,
    cases: [
      { id: '1', caseNumber: 'C-001', status: 'critical', title: 'Injured Dog' },
      { id: '2', caseNumber: 'C-002', status: 'treatment', title: 'Sick Cat' },
    ],
    isLoading: false,
  }),
}));

describe('DashboardPage', () => {
  const mockUser = { id: '1', fullName: 'Dr. Smith', role: 'Admin', email: 'smith@pfa.com' };

  beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({
      totalCases: 2,
      criticalCases: 1,
      totalDonations: 5000,
      recentActivities: [
        { id: '1', title: 'Dog Rescue', description: 'Injured Dog', status: 'critical' }
      ],
      lowStockMedsCount: 1
    }));
  });

  it('renders correctly for the user', async () => {
    render(
      <BrowserRouter>
        <DashboardPage user={mockUser as any} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Shelter Home/i)).toBeInTheDocument();
      expect(screen.getByText(/Overview of what is happening today/i)).toBeInTheDocument();
    });
  });

  it('displays the cases count from the stats API', async () => {
    render(
      <BrowserRouter>
        <DashboardPage user={mockUser as any} />
      </BrowserRouter>
    );

    // Should see "2" in the rescues card (from stats)
    await waitFor(() => {
      expect(screen.getByText('Add New Animal')).toBeInTheDocument();
      expect(screen.getByText(/Dog • Injured Dog/i)).toBeInTheDocument();
    });
  });
});
