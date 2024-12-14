import React from 'react';
import { render, fireEvent, screen, within, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';

describe('Chart Interactions', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('updates all charts when DTE changes', () => {
    const dexContainer = screen.getByTestId('delta-exposure-dex-chart');
    const gexContainer = screen.getByTestId('gamma-exposure-gex-chart');
    
    const dteSelects = screen.getAllByRole('combobox', { name: /dte/i });
    fireEvent.change(dteSelects[0], { target: { value: '180' } });
    
    // Verify both charts updated
    const dexSelect = within(dexContainer).getByRole('combobox', { name: /dte/i });
    const gexSelect = within(gexContainer).getByRole('combobox', { name: /dte/i });
    
    expect(dexSelect.value).toBe('180');
    expect(gexSelect.value).toBe('180');
  });

  it('handles fullscreen transitions', async () => {
    // Get the first chart container (Price Chart)
    const chartWrapper = screen.getByTestId('price-chart');
    const fullscreenButton = screen.getByTestId('price-chart-fullscreen-button');
    
    // Enter fullscreen
    fireEvent.click(fullscreenButton);
    
    // Wait for the fullscreen state to update and verify
    await waitFor(() => {
      const updatedWrapper = screen.getByTestId('price-chart');
      expect(updatedWrapper).toHaveAttribute('data-fullscreen', 'true');
    });
    
    // Exit fullscreen
    fireEvent.keyDown(document, { key: 'Escape' });
    
    // Wait for the fullscreen state to update and verify
    await waitFor(() => {
      const updatedWrapper = screen.getByTestId('price-chart');
      expect(updatedWrapper).toHaveAttribute('data-fullscreen', 'false');
    });
  });
}); 