export const generateExpirationDates = (dte) => {
  const dates = [];
  const today = new Date();
  const weeksCount = Math.floor(dte / 7);
  
  for (let i = 0; i < weeksCount; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + (i * 7));
    dates.push(date.toLocaleDateString('en-US', { 
      month: '2-digit', 
      day: '2-digit', 
      year: '2-digit'
    }));
  }
  
  return dates;
}; 