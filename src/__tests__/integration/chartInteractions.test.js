import React from 'react';
import { render, screen, within, fireEvent, act, waitFor } from '@testing-library/react';
import App from '../../App';

// Mock fetch with proper response structure
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      f: {
        2: {
          c: {},
          a: {
            '100': {
              value: [
                [
                  '2024-01-19',
                  [
                    [
                      [
                        'call',
                        [100]
                      ],
                      [
                        'put',
                        [200]
                      ]
                    ]
                  ]
                ]
              ]
            }
          }
        }
      }
    })
  })
);

describe('Chart Interactions', () => {
  beforeEach(async () => {
    fetch.mockClear();
    await act(async () => {
      render(<App />);
      // Wait for initial render to complete
      await new Promise(resolve => setTimeout(resolve, 0));
    });
  });

  it('updates all charts when DTE changes', async () => {
    const dexContainer = screen.getByTestId('delta-exposure-dex-chart');
    const gexContainer = screen.getByTestId('gamma-exposure-gex-chart');
    
    // Get the DTE select from the DEX chart
    const dexSelect = within(dexContainer).getByRole('combobox', { name: /dte/i });
    
    // Change the DTE value
    await act(async () => {
      fireEvent.change(dexSelect, { target: { value: '180' } });
      // Wait for any pending promises to resolve
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Wait for fetch to be called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    // Wait for both selects to update
    await waitFor(() => {
      const updatedDexSelect = within(dexContainer).getByRole('combobox', { name: /dte/i });
      const updatedGexSelect = within(gexContainer).getByRole('combobox', { name: /dte/i });
      
      // Both selects should have the numeric value 180
      expect(Number(updatedDexSelect.value)).toBe(180);
      expect(Number(updatedGexSelect.value)).toBe(180);
    }, { timeout: 3000 });
  });
}); 