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

const transformApiData = (response, dte) => {
  console.log('Raw response in transformApiData:', JSON.stringify(response, null, 2));
  const strikes = [];
  
  if (!response?.f?.[2]?.a) {
    console.warn('No strike price data in response:', response);
    return [];
  }

  // Calculate the maximum allowed date based on DTE
  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + dte);

  // Process each strike price
  Object.entries(response.f[2].a).forEach(([strike, strikeData]) => {
    const dataPoint = {
      strike: Number(strike)
    };

    // The data is in strikeData.value[0] which contains all the date entries
    if (strikeData.value && Array.isArray(strikeData.value[0])) {
      strikeData.value[0].forEach(dateEntry => {
        const date = dateEntry[0];
        const expirationDate = new Date(date);
        
        // Only include data for dates within the DTE range
        if (expirationDate <= maxDate) {
          const optionData = dateEntry[1];
          
          if (optionData && Array.isArray(optionData[0])) {
            // Process each option type (call/put)
            optionData[0].forEach(([type, values]) => {
              if (values && values.length > 0) {
                const value = Number(values[0] || 0);
                if (type === 'call') {
                  dataPoint[`calls_${date}`] = -value; // Negative for visualization
                } else if (type === 'put') {
                  dataPoint[`puts_${date}`] = -value;
                }
              }
            });
          }
        }
      });
    }

    console.log('Final dataPoint:', dataPoint);
    strikes.push(dataPoint);
  });

  console.log('Final transformed data:', strikes);
  return strikes;
};

const ChartWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const DexChartContent = ({ isFullscreen, dte, onDteChange }) => {
  const [strikes, setStrikes] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [expirationDates, setExpirationDates] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching DEX data...');
        const response = await fetch(`${process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'}/api/dex?underlyingAsset=SPY&startStrikePrice=575&endStrikePrice=625`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Pass dte to transformApiData
        const transformedData = transformApiData(data, dte);
        console.log('Chart data structure:', {
          data: transformedData,
          sample_point: transformedData[0], // Log first data point in detail
          available_keys: transformedData[0] ? Object.keys(transformedData[0]) : [],
          num_points: transformedData.length
        });
        
        // Extract unique dates
        const dates = new Set();
        transformedData.forEach(dataPoint => {
          Object.keys(dataPoint).forEach(key => {
            if (key !== 'strike') {
              const date = key.replace(/^(calls|puts)_/, '');
              dates.add(date);
            }
          });
        });
        
        const sortedDates = Array.from(dates).sort();
        console.log('Available dates:', sortedDates);
        
        // Log the keys that will be used for the chart
        const chartKeys = sortedDates.flatMap(date => [`calls_${date}`, `puts_${date}`]);
        console.log('Chart keys:', chartKeys);
        
        setExpirationDates(sortedDates);
        setChartData(transformedData);

      } catch (err) {
        console.error('Error fetching DEX data:', err);
        setError(`Error: ${err.message}`);
      }
    };

    fetchData();
  }, [dte]);

  return (
    <>
      <ControlsContainer onClick={e => e.stopPropagation()}>
        <SelectGroup onClick={e => e.stopPropagation()}>
          <label htmlFor="dex-dte-select" onClick={e => e.stopPropagation()}>DTE:</label>
          <Select
            id="dex-dte-select"
            aria-label="DTE"
            value={dte}
            onClick={e => e.stopPropagation()}
            onChange={(e) => {
              e.stopPropagation();
              const newDte = Number(e.target.value);
              onDteChange(newDte);
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
              setStrikes(Number(e.target.value));
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
              legendOffset: 40
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
                    label: `Exp: ${date}`,
                    color: colors[index % colors.length]
                  };
                })
              }
            ]}
            animate={true}
            motionStiffness={90}
            motionDamping={15}
            enableLabel={false}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            reverse={false}
          />
        </ChartWrapper>
      )}
    </>
  );
};

// Wrapper component
const DexChart = ({ dte, onDteChange }) => {
  return (
    <ChartContainer title="Delta Exposure (DEX) Chart" data-testid="delta-exposure-dex-chart">
      <DexChartContent dte={dte} onDteChange={onDteChange} />
    </ChartContainer>
  );
};

export default DexChart; 