import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import styled from 'styled-components';
import ChartContainer from '../common/ChartContainer';

const TimeRangeContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  position: relative;
  z-index: 2;
`;

const RadioButton = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  font-size: 12px;
  color: #666;

  input {
    cursor: pointer;
  }

  &:hover {
    color: #000;
  }
`;

const timeRanges = [
  { label: '1D', value: '1day' },
  { label: '5D', value: '5day' },
  { label: '1M', value: '1month' },
  { label: '1Y', value: '1year' },
  { label: '3Y', value: '3year' },
];

// Mock data generator based on time range
const generateData = (timeRange, lastPrice = 100) => {
  const now = new Date();
  const data = [];
  let points;
  let interval;

  switch(timeRange) {
    case '1day':
      points = 24;
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '5day':
      points = 5;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '1month':
      points = 30;
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    case '1year':
      points = 12;
      interval = 30 * 24 * 60 * 60 * 1000; // ~1 month
      break;
    case '3year':
      points = 36;
      interval = 30 * 24 * 60 * 60 * 1000; // ~1 month
      break;
    default:
      points = 24;
      interval = 60 * 60 * 1000;
  }

  // Generate random data around the last price
  const volatility = lastPrice * 0.02; // 2% volatility
  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now - (i * interval));
    const randomChange = (Math.random() - 0.5) * volatility;
    const price = i === 0 ? lastPrice : lastPrice + randomChange;

    data.push({
      x: timeRange === '1day' 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      y: Number(price.toFixed(2))
    });
  }

  return [{
    id: "stock price",
    data: data
  }];
};

const PriceChartContent = ({ isFullscreen, timeRange, onTimeRangeChange, asset }) => {
  const [lastPrice, setLastPrice] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [debouncedAsset, setDebouncedAsset] = useState(asset);

  // Debounce the asset value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedAsset(asset);
    }, 500);

    return () => clearTimeout(timer);
  }, [asset]);

  // Fetch last trade price when asset changes
  useEffect(() => {
    if (!debouncedAsset || debouncedAsset.length < 2) return;

    const fetchLastPrice = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_PROXY_URL || 'http://localhost:3001'}/api/market/last-price?symbol=${debouncedAsset}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setLastPrice(data.price);
        setError(null);
      } catch (err) {
        console.error('Error fetching last trade price:', err);
        setError(`Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLastPrice();
  }, [debouncedAsset]);

  // Generate mock data starting from the last price if available
  const data = lastPrice !== null ? generateData(timeRange, lastPrice) : generateData(timeRange, 100);

  const theme = {
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

  return (
    <>
      <TimeRangeContainer>
        {timeRanges.map(({ label, value }) => (
          <RadioButton key={value}>
            <input
              type="radio"
              value={value}
              checked={timeRange === value}
              onChange={onTimeRangeChange}
            />
            {label}
          </RadioButton>
        ))}
      </TimeRangeContainer>

      {loading && (
        <div style={{ color: '#666', marginBottom: '1rem' }}>
          Loading price data...
        </div>
      )}

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}

      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={data}
          margin={isFullscreen ? 
            { top: 40, right: 160, bottom: 100, left: 100 } : 
            { top: 20, right: 50, bottom: 35, left: 80 }
          }
          xScale={{ type: 'point' }}
          yScale={{ 
            type: 'linear',
            min: 0,
            max: 'auto',
            stacked: true,
          }}
          theme={{
            ...theme,
            axis: {
              ...theme.axis,
              ticks: {
                ...theme.axis.ticks,
                text: {
                  ...theme.axis.ticks.text,
                  fontSize: isFullscreen ? 14 : 12,
                }
              },
              legend: {
                ...theme.axis.legend,
                text: {
                  ...theme.axis.legend.text,
                  fontSize: isFullscreen ? 15 : 13,
                }
              }
            },
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: '',
            legendPosition: 'middle',
            legendOffset: 25
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 12,
            tickRotation: 0,
            legend: 'Price',
            legendPosition: 'middle',
            legendOffset: -50
          }}
          enableGridX={false}
          enableGridY={true}
          colors={['#4CAF50']}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          enablePointLabel={false}
          enableArea={true}
          areaBaselineValue={0}
          areaOpacity={0.1}
          useMesh={true}
          animate={true}
          motionConfig="gentle"
          tooltip={({ point }) => (
            <div style={{
              padding: '12px 16px',
              background: '#ffffff',
              boxShadow: '0 3px 8px rgba(0,0,0,0.24)',
              borderRadius: '6px',
              fontSize: '12px',
              lineHeight: '1.6'
            }}>
              <div style={{ 
                color: '#4CAF50', 
                fontWeight: 600,
                marginBottom: '8px'
              }}>
                Price: ${point.data.y}
              </div>
              <div style={{ color: '#666' }}>
                Date: {point.data.x}
              </div>
            </div>
          )}
        />
      </div>
    </>
  );
};

// Wrapper component
const PriceChart = ({ asset }) => {
  const [timeRange, setTimeRange] = useState(timeRanges[0].value);

  return (
    <ChartContainer title="Price">
      <PriceChartContent
        timeRange={timeRange}
        onTimeRangeChange={(e) => setTimeRange(e.target.value)}
        asset={asset}
      />
    </ChartContainer>
  );
};

export default PriceChart; 