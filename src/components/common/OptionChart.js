import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';
import ChartContainer from './ChartContainer';

export const ControlsContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
`;

export const Select = styled.select`
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

export const SelectGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  label {
    font-size: 12px;
    color: #666;
  }
`;

export const DTE_OPTIONS = [20, 50, 180, 360, 500];
export const STRIKE_OPTIONS = [20, 30, 50, 80, 100, 150, 200];
export const CHART_COLORS = ['#e8c1a0', '#f47560', '#f1e15b', '#e8a838', '#61cdbb', '#97e3d5', '#1f77b4', '#ff7f0e'];

export const formatValue = (value) => {
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

export const transformApiData = (response, dte) => {
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
    .filter(Boolean)
    // Sort by strike price in ascending order
    .sort((a, b) => a.strike - b.strike);

  console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
  return transformedData;
};

export const theme = {
  axis: {
    ticks: {
      text: {
        fontSize: 12,
        fill: '#666',
        fontWeight: 500
      }
    },
    legend: {
      text: {
        fontSize: 13,
        fill: '#666',
        fontWeight: 600
      }
    }
  },
  grid: {
    line: {
      stroke: '#e0e0e0',
      strokeWidth: 1
    }
  },
  tooltip: {
    container: {
      background: '#ffffff',
      boxShadow: '0 3px 8px rgba(0,0,0,0.24)',
      borderRadius: '6px',
      padding: '12px',
      fontSize: '12px',
      border: 'none'
    }
  }
};

export const calculateBound = (maxValue) => {
  if (maxValue >= 1000) { // Over 1B
    return Math.ceil(maxValue * 1.1);
  } else if (maxValue >= 100) { // 100M to 1B
    return Math.ceil(maxValue * 1.2);
  } else if (maxValue >= 10) { // 10M to 100M
    return Math.ceil(maxValue * 1.3);
  } else if (maxValue >= 1) { // 1M to 10M
    return Math.ceil(maxValue * 1.5);
  } else { // Under 1M
    return Math.ceil(maxValue * 2); // Double the range for small values
  }
};

export const OptionChartContent = ({ 
  isFullscreen, 
  dte, 
  onDteChange, 
  asset,
  chartType, // 'dex' or 'gex'
  title
}) => {
  const [strikes, setStrikes] = useState(30);
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

  // Fetch last trade price and then option data when asset changes
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

        // Then fetch option data
        console.log(`Fetching ${chartType.toUpperCase()} data for asset:`, debouncedAsset);
        const dataResponse = await fetch(`${process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'}/api/${chartType}?underlyingAsset=${debouncedAsset}&numStrikes=${strikes}`);
        
        if (!dataResponse.ok) {
          throw new Error(`HTTP error! status: ${dataResponse.status}`);
        }
        
        const optionData = await dataResponse.json();
        setRawData(optionData);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Error: ${err.message}`);
      }
    };

    fetchData();
  }, [debouncedAsset, strikes, chartType]);

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

  const handleDteChange = (e) => {
    e.stopPropagation();
    onDteChange(Number(e.target.value));
  };

  const handleStrikesChange = (e) => {
    e.stopPropagation();
    setStrikes(Number(e.target.value));
  };

  // Calculate max value from the data
  const maxValue = Math.max(
    ...chartData.map(item => {
      const values = Object.entries(item)
        .filter(([key]) => key !== 'strike')
        .map(([, value]) => Math.abs(value));
      return Math.max(...values, 0);
    })
  );

  const bound = calculateBound(maxValue);

  if (error) {
    return <div>Error loading {chartType.toUpperCase()} data: {error}</div>;
  }

  return (
    <>
      <ControlsContainer onClick={e => e.stopPropagation()}>
        <SelectGroup>
          <label htmlFor={`${chartType}-dte-select`}>DTE:</label>
          <Select 
            id={`${chartType}-dte-select`}
            aria-label="DTE"
            value={dte} 
            onChange={handleDteChange}
          >
            {DTE_OPTIONS.map(value => (
              <option key={value} value={value}>
                {value} days
              </option>
            ))}
          </Select>
        </SelectGroup>
        <SelectGroup>
          <label htmlFor={`${chartType}-strikes-select`}>Strikes:</label>
          <Select 
            id={`${chartType}-strikes-select`}
            aria-label="Strikes"
            value={strikes} 
            onChange={handleStrikesChange}
          >
            {STRIKE_OPTIONS.map(value => (
              <option key={value} value={value}>
                {value} strikes
              </option>
            ))}
          </Select>
        </SelectGroup>
      </ControlsContainer>
      <ResponsiveBar
        data={chartData}
        keys={expirationDates.flatMap(date => [`calls_${date}`, `puts_${date}`])}
        indexBy="strike"
        layout="horizontal"
        margin={isFullscreen ? 
          { top: 40, right: 160, bottom: 100, left: 100 } : 
          { top: 20, right: 130, bottom: 65, left: 80 }
        }
        padding={0.3}
        valueScale={{ 
          type: 'linear',
          min: -bound,
          max: bound,
          stacked: true,
          reverse: false
        }}
        indexScale={{ type: 'band', round: true }}
        colors={({ id }) => {
          // Extract the date from the key (remove 'calls_' or 'puts_' prefix)
          const date = id.replace(/^(calls|puts)_/, '');
          // Use nivo's color scheme but index by unique dates
          const dateIndex = expirationDates.indexOf(date);
          return CHART_COLORS[dateIndex % CHART_COLORS.length];
        }}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: title,
          legendPosition: 'middle',
          legendOffset: 45,
          format: formatValue,
          tickValues: [
            -bound,           // Minimum value
            -bound * 2/3,     // One-third from min
            -bound * 1/3,     // Two-thirds from min
            0,                // Center
            bound * 1/3,      // One-third from center
            bound * 2/3,      // Two-thirds from center
            bound            // Maximum value
          ]
        }}
        axisLeft={{
          tickSize: 15,
          tickPadding: 15,
          tickRotation: 0,
          format: value => value.toFixed(2),
          legend: 'Strike Price',
          legendPosition: 'middle',
          legendOffset: -75
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        tooltip={({ id, value, color }) => (
          <div style={{ 
            padding: 12,
            color: '#333',
            background: '#fff',
            boxShadow: '0 3px 8px rgba(0,0,0,0.24)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: 12,
              height: 12,
              background: color,
              borderRadius: '2px'
            }} />
            <div>
              <strong>{id.split('_')[0]}</strong> ({id.split('_')[1]}): {formatValue(value)}
            </div>
          </div>
        )}
        legends={[
          {
            dataFrom: 'keys',
            anchor: 'top-right',
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
            data: expirationDates.map((date, index) => ({
              id: date,
              label: date,
              color: CHART_COLORS[index % CHART_COLORS.length]
            }))
          }
        ]}
      />
    </>
  );
}; 