import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../../components/layout/Header';

describe('Header', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('displays the application title', () => {
    render(<Header />);
    expect(screen.getByText('Jax Dashboard')).toBeInTheDocument();
  });

  it('has correct styling', () => {
    const { container } = render(<Header />);
    const header = container.firstChild;
    expect(header).toHaveStyle({
      display: 'flex',
      alignItems: 'center'
    });
  });
}); 