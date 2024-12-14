import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import PriceChart from '../../../components/charts/PriceChart';

// Mock the ResponsiveLine component
jest.mock('@nivo/line', () => ({
  ResponsiveLine: () => <div data-testid="mock-responsive-line" />
}));

describe('PriceChart', () => {
  it('renders without crashing', () => {
    render(<PriceChart />);
    expect(screen.getByText('Price Chart')).toBeInTheDocument();
  });

  it('displays correct time range options', () => {
    render(<PriceChart />);
    const timeRanges = ['1D', '5D', '1M', '1Y', '3Y'];
    timeRanges.forEach(range => {
      expect(screen.getByLabelText(range)).toBeInTheDocument();
    });
  });

  it('starts with default time range selected', () => {
    render(<PriceChart />);
    const monthRadio = screen.getByLabelText('1M');
    expect(monthRadio).toBeChecked();
  });

  it('changes time range when new option selected', () => {
    render(<PriceChart />);
    const yearRadio = screen.getByLabelText('1Y');
    fireEvent.click(yearRadio);
    expect(yearRadio).toBeChecked();
  });
}); 