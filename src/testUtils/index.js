// Test constants
export const TEST_CONSTANTS = {
  DTE: 50,
  STRIKES: 30,
  MOCK_DATES: ['12/01/24', '12/08/24', '12/15/24']
};

// Mock data generators
export const generateMockChartData = () => {
  const data = [];
  const basePrice = 100;
  const priceStep = 5;

  for (let i = 0; i < TEST_CONSTANTS.STRIKES; i++) {
    const strikePrice = basePrice + (i - Math.floor(TEST_CONSTANTS.STRIKES/2)) * priceStep;
    const dataPoint = {
      strike: `$${strikePrice}`,
    };

    TEST_CONSTANTS.MOCK_DATES.forEach(exp => {
      const callKey = `calls_${exp}`;
      const putKey = `puts_${exp}`;
      dataPoint[callKey] = Math.random() * 0.8;
      dataPoint[putKey] = -Math.random() * 0.8;
    });

    data.push(dataPoint);
  }

  return data.reverse();
};

export const generateMockDates = () => TEST_CONSTANTS.MOCK_DATES; 