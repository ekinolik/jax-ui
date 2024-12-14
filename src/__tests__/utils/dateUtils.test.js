import { generateExpirationDates } from '../../utils/dateUtils';

describe('generateExpirationDates', () => {
  it('formats dates correctly', () => {
    const dates = generateExpirationDates(7);
    const dateFormat = /^\d{2}\/\d{2}\/\d{2}$/; // MM/DD/YY format
    expect(dates[0]).toMatch(dateFormat);
  });

  it('generates correct number of dates for given DTE', () => {
    const dte = 21; // 3 weeks
    const dates = generateExpirationDates(dte);
    expect(dates).toHaveLength(3); // Should generate 3 weekly dates
  });

  it('generates dates with weekly intervals', () => {
    const dates = generateExpirationDates(14);
    const firstDate = new Date(dates[0]);
    const secondDate = new Date(dates[1]);
    const diffInDays = (secondDate - firstDate) / (1000 * 60 * 60 * 24);
    expect(diffInDays).toBe(7);
  });
}); 