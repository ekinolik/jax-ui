import React, { useState } from 'react';
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
const generateData = (timeRange) => {
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

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now - (i * interval));
    data.push({
      x: timeRange === '1day' 
        ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      y: Math.floor(Math.random() * 50) + 100 // Random price between 100 and 150
    });
  }

  return [{
    id: "stock price",
    data: data
  }];
};

const PriceChartContent = ({ isFullscreen, timeRange, onTimeRangeChange }) => {
  const data = generateData(timeRange);

  const handleTimeRangeChange = (e) => {
    e.stopPropagation();
    onTimeRangeChange(e.target.value);
  };

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
      <TimeRangeContainer onClick={e => e.stopPropagation()}>
        {timeRanges.map(({ label, value }) => (
          <RadioButton key={value}>
            <input
              type="radio"
              name="timeRange"
              value={value}
              checked={timeRange === value}
              onChange={handleTimeRangeChange}
            />
            {label}
          </RadioButton>
        ))}
      </TimeRangeContainer>
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
        style={{
          height: isFullscreen ? '100%' : '450px'
        }}
      />
    </>
  );
};

// Wrapper component
const PriceChart = () => {
  const [timeRange, setTimeRange] = useState('1month');

  return (
    <ChartContainer title="Price Chart" fullWidth>
      <PriceChartContent 
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
      />
    </ChartContainer>
  );
};

export default PriceChart; 