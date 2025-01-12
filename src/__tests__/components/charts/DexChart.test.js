import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import DexChart from '../../../components/charts/DexChart';

const defaultProps = {
  asset: 'AAPL'
};

describe('DexChart', () => {
  it('renders without crashing', () => {
    render(<DexChart {...defaultProps} />);
    expect(screen.getByText('DEX')).toBeInTheDocument();
  });

  it('renders controls', () => {
    render(<DexChart {...defaultProps} />);
    expect(screen.getByLabelText('DTE:')).toBeInTheDocument();
    expect(screen.getByLabelText('Strikes:')).toBeInTheDocument();
  });

  it('updates when DTE changes', async () => {
    render(<DexChart {...defaultProps} />);
    
    const dteSelect = screen.getByLabelText('DTE:');
    await act(async () => {
      fireEvent.change(dteSelect, { target: { value: '180' } });
    });
    expect(dteSelect.value).toBe('180');
  });

  it('updates when strikes changes', async () => {
    render(<DexChart {...defaultProps} />);
    
    const strikesSelect = screen.getByLabelText('Strikes:');
    await act(async () => {
      fireEvent.change(strikesSelect, { target: { value: '50' } });
    });
    expect(strikesSelect.value).toBe('50');
  });
}); 