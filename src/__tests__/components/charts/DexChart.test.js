import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DexChart from '../../../components/charts/DexChart';
import { TEST_CONSTANTS, generateMockChartData } from '../../../testUtils';

describe('DexChart', () => {
  it('renders with mock data', () => {
    const mockData = generateMockChartData();
    render(<DexChart initialData={mockData} />);
    expect(screen.getByText('Delta Exposure (DEX) Chart')).toBeInTheDocument();
  });

  // ... rest of tests using TEST_CONSTANTS and other utilities
}); 