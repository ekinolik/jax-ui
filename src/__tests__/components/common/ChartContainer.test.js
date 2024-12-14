import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartContainer from '../../../components/common/ChartContainer';

// Create a proper React component that handles the isFullscreen prop
class MockChart extends React.Component {
  render() {
    return <div>Test Content</div>;
  }
}

describe('ChartContainer', () => {
  const mockTitle = "Test Chart";

  it('renders with correct title', () => {
    render(
      <ChartContainer title={mockTitle}>
        <MockChart />
      </ChartContainer>
    );
    expect(screen.getByText(mockTitle)).toBeInTheDocument();
  });

  it('toggles fullscreen mode when clicked', async () => {
    render(
      <ChartContainer title="Test Chart">
        <MockChart />
      </ChartContainer>
    );
    const chartContainer = screen.getByTestId('test-chart');
    const fullscreenButton = screen.getByTestId('test-chart-fullscreen-button');
    
    fireEvent.click(fullscreenButton);
    
    await waitFor(() => {
      const updatedContainer = screen.getByTestId('test-chart');
      expect(updatedContainer).toHaveAttribute('data-fullscreen', 'true');
    });
  });

  it('exits fullscreen mode when escape key is pressed', async () => {
    render(
      <ChartContainer title={mockTitle}>
        <MockChart />
      </ChartContainer>
    );
    const chartContainer = screen.getByTestId('test-chart');
    const fullscreenButton = screen.getByTestId('test-chart-fullscreen-button');
    
    fireEvent.click(fullscreenButton);
    await waitFor(() => {
      const updatedContainer = screen.getByTestId('test-chart');
      expect(updatedContainer).toHaveAttribute('data-fullscreen', 'true');
    });
    
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => {
      const updatedContainer = screen.getByTestId('test-chart');
      expect(updatedContainer).toHaveAttribute('data-fullscreen', 'false');
    });
  });
}); 