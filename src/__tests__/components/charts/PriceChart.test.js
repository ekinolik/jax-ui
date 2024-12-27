import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PriceChart from '../../../components/charts/PriceChart';

describe('PriceChart', () => {
  const defaultProps = {
    asset: 'AAPL'
  };

  it('renders without crashing', () => {
    render(<PriceChart {...defaultProps} />);
    expect(screen.getByText('Price')).toBeInTheDocument();
  });

  it('displays correct time range options', () => {
    render(<PriceChart {...defaultProps} />);
    expect(screen.getByLabelText('1D')).toBeInTheDocument();
    expect(screen.getByLabelText('5D')).toBeInTheDocument();
    expect(screen.getByLabelText('1M')).toBeInTheDocument();
    expect(screen.getByLabelText('1Y')).toBeInTheDocument();
    expect(screen.getByLabelText('3Y')).toBeInTheDocument();
  });

  it('starts with 1D time range selected', () => {
    render(<PriceChart {...defaultProps} />);
    const dayRadio = screen.getByLabelText('1D');
    expect(dayRadio).toBeChecked();
  });

  it('changes time range when new option selected', () => {
    render(<PriceChart {...defaultProps} />);
    const yearRadio = screen.getByLabelText('1Y');
    fireEvent.click(yearRadio);
    expect(yearRadio).toBeChecked();
  });
}); 