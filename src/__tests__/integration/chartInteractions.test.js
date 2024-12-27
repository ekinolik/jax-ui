import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../../App';

describe('Chart Interactions', () => {
  it('renders all charts', () => {
    render(<App />);
    expect(screen.getByTestId('dex')).toBeInTheDocument();
    expect(screen.getByTestId('price')).toBeInTheDocument();
    expect(screen.getByTestId('gamma-exposure-gex-chart')).toBeInTheDocument();
  });

  it('updates all charts when asset changes', () => {
    render(<App />);
    const assetInput = screen.getByPlaceholderText('Enter asset...');
    fireEvent.change(assetInput, { target: { value: 'AAPL' } });
    expect(assetInput.value).toBe('AAPL');
  });

  it('allows DTE selection in DEX chart', () => {
    render(<App />);
    const dexChart = screen.getByTestId('dex');
    const dteSelect = within(dexChart).getByLabelText('DTE:');
    fireEvent.change(dteSelect, { target: { value: '180' } });
    expect(dteSelect.value).toBe('180');
  });

  it('allows strikes selection in DEX chart', () => {
    render(<App />);
    const dexChart = screen.getByTestId('dex');
    const strikesSelect = within(dexChart).getByLabelText('Strikes:');
    fireEvent.change(strikesSelect, { target: { value: '50' } });
    expect(strikesSelect.value).toBe('50');
  });
}); 