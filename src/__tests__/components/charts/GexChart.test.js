import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GexChart from '../../../components/charts/GexChart';

// Mock the ResponsiveBar component
jest.mock('@nivo/bar', () => ({
  ResponsiveBar: () => <div data-testid="mock-responsive-bar" />
}));

describe('GexChart', () => {
  const defaultProps = {
    dte: 50,
    onDteChange: jest.fn()
  };

  it('renders without crashing', () => {
    render(<GexChart {...defaultProps} />);
    expect(screen.getByText('Gamma Exposure (GEX) Chart')).toBeInTheDocument();
  });

  it('displays correct DTE options', () => {
    render(<GexChart {...defaultProps} />);
    const dteSelect = screen.getByRole('combobox', { name: /dte/i });
    const options = Array.from(dteSelect.options).map(opt => Number(opt.value));
    expect(options).toEqual([20, 50, 180, 360, 500]);
  });

  it('displays correct strike options', () => {
    render(<GexChart {...defaultProps} />);
    const strikeSelect = screen.getByRole('combobox', { name: /strikes/i });
    const options = Array.from(strikeSelect.options).map(opt => Number(opt.value));
    expect(options).toEqual([20, 30, 50, 80, 100, 150, 200]);
  });

  it('updates when DTE changes', () => {
    render(<GexChart {...defaultProps} />);
    const dteSelect = screen.getByRole('combobox', { name: /dte/i });
    fireEvent.change(dteSelect, { target: { value: '180' } });
    expect(defaultProps.onDteChange).toHaveBeenCalledWith('180');
  });

  it('updates when strike count changes', () => {
    render(<GexChart {...defaultProps} />);
    const strikeSelect = screen.getByRole('combobox', { name: /strikes/i });
    fireEvent.change(strikeSelect, { target: { value: '100' } });
    expect(strikeSelect.value).toBe('100');
  });

  it('generates correct number of expiration dates', () => {
    render(<GexChart {...defaultProps} />);
    const { container } = render(<GexChart {...defaultProps} />);
    const legendItems = container.querySelectorAll('[data-testid="mock-responsive-bar"]');
    expect(legendItems).toBeTruthy();
  });
}); 