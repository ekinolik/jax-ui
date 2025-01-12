import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GexChart from '../../../components/charts/GexChart';

const defaultProps = {
  asset: 'AAPL'
};

describe('GexChart', () => {
  it('renders without crashing', () => {
    render(<GexChart {...defaultProps} />);
    expect(screen.getByText('GEX')).toBeInTheDocument();
  });

  it('displays correct DTE options', () => {
    render(<GexChart {...defaultProps} />);
    const dteSelect = screen.getByLabelText('DTE:');
    expect(dteSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '20 days' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50 days' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '180 days' })).toBeInTheDocument();
  });

  it('displays correct strike options', () => {
    render(<GexChart {...defaultProps} />);
    const strikesSelect = screen.getByLabelText('Strikes:');
    expect(strikesSelect).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '20 strikes' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '30 strikes' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '50 strikes' })).toBeInTheDocument();
  });
}); 