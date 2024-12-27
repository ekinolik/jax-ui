import React from 'react';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import DexChart from '../../../components/charts/DexChart';

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      f: {
        2: {
          a: {}
        }
      }
    })
  })
);

describe('DexChart', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders with client data', async () => {
    await act(async () => {
      render(<DexChart dte={20} onDteChange={() => {}} />);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Delta Exposure (DEX) Chart')).toBeInTheDocument();
    });
  });

  it('updates when DTE changes', async () => {
    const handleDteChange = jest.fn();

    await act(async () => {
      render(<DexChart dte={20} onDteChange={handleDteChange} />);
    });

    const dteSelect = screen.getByRole('combobox', { name: 'DTE' });
    await act(async () => {
      fireEvent.change(dteSelect, { target: { value: '180' } });
    });

    expect(handleDteChange).toHaveBeenCalled();
  });
}); 