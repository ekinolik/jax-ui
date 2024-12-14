import { generateMockChartData, generateMockDates, TEST_CONSTANTS } from '../../testUtils';

describe('Test Utilities', () => {
  it('generates mock chart data', () => {
    const data = generateMockChartData();
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(TEST_CONSTANTS.STRIKES);
    
    // Test data structure
    const firstItem = data[0];
    expect(firstItem).toHaveProperty('strike');
    TEST_CONSTANTS.MOCK_DATES.forEach(date => {
      expect(firstItem).toHaveProperty(`calls_${date}`);
      expect(firstItem).toHaveProperty(`puts_${date}`);
    });
  });

  it('generates mock dates', () => {
    const dates = generateMockDates();
    expect(Array.isArray(dates)).toBe(true);
    expect(dates).toEqual(TEST_CONSTANTS.MOCK_DATES);
  });
}); 