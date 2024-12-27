import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';
import ChartContainer from '../common/ChartContainer';

const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
`;

const Select = styled.select`
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  background: white;

  &:hover {
    border-color: #999;
  }

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const SelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 12px;
    color: #666;
  }
`;

const DTE_OPTIONS = [20, 50, 180, 360, 500];
const STRIKE_OPTIONS = [2, 20, 30, 50, 80, 100, 150, 200];

const formatValue = (value) => {
  // Invert the sign for display
  const displayValue = -value;
  const absValue = Math.abs(displayValue);
  let formatted;
  if (absValue >= 1000) {
    formatted = `${(absValue / 1000).toFixed(2)}B`;
  } else if (absValue >= 1) {
    formatted = `${absValue.toFixed(2)}M`;
  } else if (absValue >= 0.001) {
    formatted = `${(absValue * 1000).toFixed(0)}K`;
  } else {
    formatted = absValue.toFixed(2);
  }
  return displayValue < 0 ? `-${formatted}` : formatted;
};

const transformApiData = (response, dte) => {
  console.log('Raw response in transformApiData:', JSON.stringify(response, null, 2));
  
  if (!response?.f?.[2]?.a) {
    console.warn('No valid data structure in response:', response);
    return [];
  }

  // Calculate the maximum allowed date based on DTE
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + dte);
  console.log('Using DTE:', dte, 'Max date:', maxDate.toISOString());

  // Transform the data into the format needed for the chart
  const transformedData = Object.entries(response.f[2].a)
    .map(([strike, strikeData]) => {
      if (!strikeData?.value?.[0]) {
        console.warn('Invalid strike data for strike', strike, ':', strikeData);
        return null;
      }

      const dataPoint = {
        strike: Number(strike)
      };

      let hasValidData = false;

      // Process each date entry
      strikeData.value[0].forEach(dateEntry => {
        const [date, optionData] = dateEntry;
        if (!date || !optionData?.[0]) {
          console.warn('Invalid date entry:', dateEntry);
          return;
        }

        const expirationDate = new Date(date);
        if (isNaN(expirationDate.getTime())) {
          console.warn('Invalid date:', date);
          return;
        }

        // Only include data for dates within the DTE range
        if (expirationDate <= maxDate) {
          // Process each option type (call/put)
          optionData[0].forEach(([type, values]) => {
            if (values && values.length > 0) {
              const value = Number(values[0] || 0);
              if (!isNaN(value) && value !== 0) {
                // Normalize values by dividing by 1 million
                if (type === 'call') {
                  dataPoint[`calls_${date}`] = -Math.abs(value) / 1000000; // Keep calls on left but show as positive
                  hasValidData = true;
                } else if (type === 'put') {
                  dataPoint[`puts_${date}`] = Math.abs(value) / 1000000;  // Keep puts on right but show as negative
                  hasValidData = true;
                }
              }
            }
          });
        }
      });

      return hasValidData ? dataPoint : null;
    })
    .filter(Boolean);

  console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
  return transformedData;
};

const ChartWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const DexChartContent = ({ isFullscreen, dte, onDteChange, asset }) => {
  const [strikes, setStrikes] = useState(STRIKE_OPTIONS[0]);
  const [rawData, setRawData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [expirationDates, setExpirationDates] = useState([]);
  const [error, setError] = useState(null);
  const [debouncedAsset, setDebouncedAsset] = useState(asset);
  const [lastPrice, setLastPrice] = useState(null);

  // Debounce the asset value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAsset(asset);
    }, 500); // Wait 500ms after last change before updating

    return () => clearTimeout(timer);
  }, [asset]);

  // Fetch last trade price and then DEX data when asset changes
  useEffect(() => {
    if (!debouncedAsset) return; // Don't fetch if no asset is selected
    if (debouncedAsset.length < 2) return; // Don't fetch if asset is too short

    const fetchData = async () => {
      try {
        // First fetch the last trade price
        console.log('Fetching last trade price for asset:', debouncedAsset);
        const priceResponse = await fetch(`${process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'}/api/market/last-price?symbol=${debouncedAsset}`);
        
        if (!priceResponse.ok) {
          throw new Error(`HTTP error! status: ${priceResponse.status}`);
        }
        
        const priceData = await priceResponse.json();
        setLastPrice(priceData.price);

        // Then fetch DEX data
        console.log('Fetching DEX data for asset:', debouncedAsset);
        const dexResponse = await fetch(`${process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'}/api/dex?underlyingAsset=${debouncedAsset}&startStrikePrice=0&endStrikePrice=50`);
        
        if (!dexResponse.ok) {
          throw new Error(`HTTP error! status: ${dexResponse.status}`);
        }
        
        const dexData = await dexResponse.json();
        setRawData(dexData);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error: ${err.message}`);
      }
    };

    fetchData();
  }, [debouncedAsset]); // Refetch when debounced asset changes

  // Transform data whenever DTE or rawData changes
  useEffect(() => {
    if (!rawData) return;

    console.log('Starting data transformation with DTE:', dte);
    const transformedData = transformApiData(rawData, dte);
    
    // Extract unique dates
    const dates = new Set();
    transformedData.forEach(dataPoint => {
      console.log('Processing dataPoint:', JSON.stringify(dataPoint, null, 2));
      Object.keys(dataPoint).forEach(key => {
        if (key !== 'strike') {
          const date = key.replace(/^(calls|puts)_/, '');
          dates.add(date);
        }
      });
    });
    
    const sortedDates = Array.from(dates).sort();
    console.log('Chart setup:', {
      transformedData: JSON.stringify(transformedData, null, 2),
      sortedDates,
      chartKeys: sortedDates.flatMap(date => [`calls_${date}`, `puts_${date}`]),
      numDataPoints: transformedData.length,
      samplePoint: transformedData[0]
    });
    
    setExpirationDates(sortedDates);
    setChartData(transformedData);
  }, [dte, rawData]);

  // Add effect to log state updates
  useEffect(() => {
    console.log('Chart state updated:', {
      chartData,
      expirationDates,
      hasData: chartData.length > 0
    });
  }, [chartData, expirationDates]);

  return (
    <>
      <ControlsContainer onClick={e => e.stopPropagation()}>
        <SelectGroup onClick={e => e.stopPropagation()}>
          <label htmlFor="dex-dte-select" onClick={e => e.stopPropagation()}>DTE:</label>
          <Select
            id="dex-dte-select"
            value={dte}
            onClick={e => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              onDteChange(parseInt(e.target.value, 10));
            }}
          >
            {DTE_OPTIONS.map(option => (
              <option key={option} value={option} onClick={e => e.stopPropagation()}>{option}</option>
            ))}
          </Select>
        </SelectGroup>
        <SelectGroup onClick={e => e.stopPropagation()}>
          <label htmlFor="strikes" onClick={e => e.stopPropagation()}>Strikes:</label>
          <Select
            id="strikes"
            value={strikes}
            onClick={e => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              setStrikes(parseInt(e.target.value, 10));
            }}
          >
            {STRIKE_OPTIONS.map(option => (
              <option key={option} value={option} onClick={e => e.stopPropagation()}>{option}</option>
            ))}
          </Select>
        </SelectGroup>
      </ControlsContainer>

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Error: {error}
        </div>
      )}

      {chartData.length > 0 && (
        <ChartWrapper>
          {(() => {
            // Calculate the maximum absolute value from the data
            const maxValue = chartData.reduce((max, point) => {
              const values = Object.entries(point)
                .filter(([key]) => key !== 'strike')
                .map(([_, value]) => Math.abs(value));
              return Math.max(max, ...values);
            }, 0);
            
            // Dynamic padding based on the value range
            let bound;
            if (maxValue >= 1000) { // Over 1B
              bound = Math.ceil(maxValue * 1.1);
            } else if (maxValue >= 100) { // 100M to 1B
              bound = Math.ceil(maxValue * 1.2);
            } else if (maxValue >= 10) { // 10M to 100M
              bound = Math.ceil(maxValue * 1.3);
            } else if (maxValue >= 1) { // 1M to 10M
              bound = Math.ceil(maxValue * 1.5);
            } else { // Under 1M
              bound = Math.ceil(maxValue * 2); // Double the range for small values
            }
            
            console.log('Scale bounds:', { maxValue, bound, padding: bound/maxValue });
            
            return (
              <ResponsiveBar
                data={chartData}
                keys={expirationDates.flatMap(date => [`calls_${date}`, `puts_${date}`])}
                indexBy="strike"
                margin={{ top: 50, right: 160, bottom: 50, left: 100 }}
                padding={0.3}
                layout="horizontal"
                groupMode="stacked"
                colors={({ id }) => {
                  // Extract the date from the key (remove 'calls_' or 'puts_' prefix)
                  const date = id.replace(/^(calls|puts)_/, '');
                  // Use nivo's color scheme but index by unique dates
                  const dateIndex = expirationDates.indexOf(date);
                  const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#1f77b4', '#ff7f0e'];
                  return colors[dateIndex % colors.length];
                }}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Delta Exposure',
                  legendPosition: 'middle',
                  legendOffset: 40,
                  format: formatValue
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Strike Price',
                  legendPosition: 'middle',
                  legendOffset: -60
                }}
                gridXValues={[0]}
                enableGridX={true}
                enableGridY={false}
                valueScale={{ 
                  type: 'linear',
                  min: -bound,
                  max: bound,
                  stacked: true,
                  reverse: false
                }}
                valueFormat={value => formatValue(value)}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                enableLabel={false}
                indexScale={{ type: 'band', round: true }}
                legends={[
                  {
                    dataFrom: 'keys',
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 120,
                    translateY: 0,
                    itemsSpacing: 2,
                    itemWidth: 140,
                    itemHeight: 20,
                    itemDirection: 'left-to-right',
                    itemOpacity: 0.85,
                    symbolSize: 20,
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemOpacity: 1
                        }
                      }
                    ],
                    data: expirationDates.map((date, index) => {
                      const colors = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#1f77b4', '#ff7f0e'];
                      return {
                        id: date,
                        label: date,
                        color: colors[index % colors.length]
                      };
                    })
                  }
                ]}
              />
            );
          })()}
        </ChartWrapper>
      )}
    </>
  );
};

// Wrapper component
const DexChart = ({ asset }) => {
  const [dte, setDte] = useState(DTE_OPTIONS[0]);

  return (
    <ChartContainer title="DEX">
      <DexChartContent
        dte={dte}
        onDteChange={setDte}
        asset={asset}
      />
    </ChartContainer>
  );
};

export default DexChart; 