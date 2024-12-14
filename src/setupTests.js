// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';
import React from 'react';

// Configure testing library
configure({ testIdAttribute: 'data-testid' });

// Mock Nivo components
jest.mock('@nivo/bar', () => ({
  ResponsiveBar: () => <div data-testid="mock-responsive-bar" />
}));

jest.mock('@nivo/line', () => ({
  ResponsiveLine: () => <div data-testid="mock-responsive-line" />
}));

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});