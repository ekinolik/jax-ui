import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import ChartContainer from '../common/ChartContainer';

const PriceChartContent = ({ isFullscreen }) => {
  const data = [
    {
      id: "stock price",
      data: [
        { x: "2024-01", y: 100 },
        { x: "2024-02", y: 120 },
        { x: "2024-03", y: 90 },
        { x: "2024-04", y: 140 },
        { x: "2024-05", y: 130 },
        { x: "2024-06", y: 150 },
      ]
    }
  ];

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
    <ResponsiveLine
      data={data}
      margin={isFullscreen ? 
        { top: 40, right: 160, bottom: 100, left: 100 } : 
        { top: 20, right: 50, bottom: 65, left: 80 }
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
        legendOffset: 0
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
  );
};

// Wrapper component
const PriceChart = () => {
  return (
    <ChartContainer title="Price Chart" fullWidth>
      <PriceChartContent />
    </ChartContainer>
  );
};

export default PriceChart; 