import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import DexChart from '../../../components/charts/DexChart';

// Mock the sample data
jest.mock('../../../data/sample-data.json', () => ({
  "240": {
    "2024-12-20": {
      "call": { "Dex": 100000 },
      "put": { "Dex": -50000 }
    }
  },
  "242.5": {
    "2024-12-20": {
      "call": { "Dex": 75000 },
      "put": { "Dex": -25000 }
    }
  }
}));

describe('DexChart', () => {
  it('renders with sample data', async () => {
    render(<DexChart />);
    expect(screen.getByText('Delta Exposure (DEX) Chart')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByTestId('mock-responsive-bar')).toBeInTheDocument();
    });
  });

  // ... other tests ...
}); 