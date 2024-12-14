import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Sidebar from '../../../components/layout/Sidebar';

describe('Sidebar', () => {
  it('renders without crashing', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('displays navigation items', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
  });

  it('handles item selection', () => {
    render(<Sidebar />);
    const analysisItem = screen.getByText('Analysis');
    fireEvent.click(analysisItem);
    expect(analysisItem.parentElement).toHaveStyle({
      backgroundColor: expect.any(String)
    });
  });
}); 