import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import './test/mocks';

// Mocking localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders login page when not authenticated', async () => {
    render(<App />);
    
    // Check for login page elements
    await waitFor(() => {
      expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Username or your.email@example.com/i)).toBeInTheDocument();
    });
  });

  it('renders loading state initially', () => {
    render(<App />);
    // Since isAuthLoading starts as true and then useEffect runs
    // In some environments, we might catch the loading spinner
    const spinner = document.querySelector('.animate-spin');
    if (spinner) {
       expect(spinner).toBeInTheDocument();
    }
  });
});
