import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import ChartContainer from '../common/ChartContainer';

const DexChartContent = ({ isFullscreen }) => {
  const data = [
    {
      strike: "$100",
      "calls_01-19-2024": 0.4,
      "calls_01-26-2024": 0.3,
      "calls_02-16-2024": 0.2,
      "puts_01-19-2024": -0.3,
      "puts_01-26-2024": -0.2,
      "puts_02-16-2024": -0.1,
    },
    {
      strike: "$105",
      "calls_01-19-2024": 0.6,
      "calls_01-26-2024": 0.4,
      "calls_02-16-2024": 0.3,
      "puts_01-19-2024": -0.2,
      "puts_01-26-2024": -0.3,
      "puts_02-16-2024": -0.2,
    },
    {
      strike: "$110",
      "calls_01-19-2024": 0.8,
      "calls_01-26-2024": 0.6,
      "calls_02-16-2024": 0.4,
      "puts_01-19-2024": -0.5,
      "puts_01-26-2024": -0.4,
      "puts_02-16-2024": -0.3,
    },
    {
      strike: "$115",
      "calls_01-19-2024": 0.3,
      "calls_01-26-2024": 0.4,
      "calls_02-16-2024": 0.2,
      "puts_01-19-2024": -0.7,
      "puts_01-26-2024": -0.5,
      "puts_02-16-2024": -0.3,
    },
    {
      strike: "$120",
      "calls_01-19-2024": 0.2,
      "calls_01-26-2024": 0.3,
      "calls_02-16-2024": 0.1,
      "puts_01-19-2024": -0.4,
      "puts_01-26-2024": -0.3,
      "puts_02-16-2024": -0.2,
    },
    {
      strike: "$125",
      "calls_01-19-2024": 0.1,
      "calls_01-26-2024": 0.2,
      "calls_02-16-2024": 0.1,
      "puts_01-19-2024": -0.2,
      "puts_01-26-2024": -0.2,
      "puts_02-16-2024": -0.1,
    },
  ].reverse();

  const maxValue = Math.max(
    ...data.map(item => 
      Math.max(
        Math.abs(item["calls_01-19-2024"] + item["calls_01-26-2024"] + item["calls_02-16-2024"]),
        Math.abs(item["puts_01-19-2024"] + item["puts_01-26-2024"] + item["puts_02-16-2024"])
      )
    )
  );

  const transformedData = data.map(item => ({
    ...item,
    "calls_01-19-2024": -item["calls_01-19-2024"],
    "calls_01-26-2024": -item["calls_01-26-2024"],
    "calls_02-16-2024": -item["calls_02-16-2024"],
    "puts_01-19-2024": -item["puts_01-19-2024"],
    "puts_01-26-2024": -item["puts_01-26-2024"],
    "puts_02-16-2024": -item["puts_02-16-2024"],
  }));

  // Updated color function to use same color for each expiration date
  const getColor = (id) => {
    if (id.includes('01-19')) {
      return '#4CAF50'; // Green for first expiration
    } else if (id.includes('01-26')) {
      return '#2196F3'; // Blue for second expiration
    } else {
      return '#9C27B0'; // Purple for third expiration (02-16)
    }
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
    <ResponsiveBar
      data={transformedData}
      keys={[
        'calls_01-19-2024', 'calls_01-26-2024', 'calls_02-16-2024',
        'puts_01-19-2024', 'puts_01-26-2024', 'puts_02-16-2024'
      ]}
      indexBy="strike"
      layout="horizontal"
      margin={isFullscreen ? 
        { top: 40, right: 160, bottom: 100, left: 100 } : 
        { top: 20, right: 130, bottom: 65, left: 80 }
      }
      valueScale={{ 
        type: 'linear',
        min: -maxValue,
        max: maxValue,
      }}
      indexScale={{ 
        type: 'band', 
        round: true,
      }}
      enableGridY={false}
      enableGridX={true}
      gridXValues={[0]}
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
      colors={({ id }) => getColor(id)}
      borderRadius={2}
      borderWidth={1}
      borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '',
        legendPosition: 'middle',
        legendOffset: 0,
        format: v => Math.abs(v).toFixed(2)
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 12,
        tickRotation: 0,
        legend: 'Strike Price',
        legendPosition: 'middle',
        legendOffset: -50
      }}
      enableLabel={false}
      animate={true}
      motionConfig="gentle"
      tooltip={({ id, value, indexValue, data }) => {
        const callsSum = Math.abs(
          data["calls_01-19-2024"] + 
          data["calls_01-26-2024"] + 
          data["calls_02-16-2024"]
        );
        const putsSum = Math.abs(
          data["puts_01-19-2024"] + 
          data["puts_01-26-2024"] + 
          data["puts_02-16-2024"]
        );

        return (
          <div style={{
            padding: '12px 16px',
            background: '#ffffff',
            boxShadow: '0 3px 8px rgba(0,0,0,0.24)',
            borderRadius: '6px',
            fontSize: '12px',
            lineHeight: '1.6'
          }}>
            <div style={{ 
              color: getColor(id), 
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              Value: {Math.abs(value).toFixed(2)}
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto auto',
              gap: '8px 16px'
            }}>
              <div style={{ color: '#666' }}>Total Calls:</div>
              <div style={{ fontWeight: 500 }}>{callsSum.toFixed(2)}</div>
              <div style={{ color: '#666' }}>Total Puts:</div>
              <div style={{ fontWeight: 500 }}>{putsSum.toFixed(2)}</div>
            </div>
          </div>
        );
      }}
      markers={[
        {
          axis: 'x',
          value: 0,
          lineStyle: { 
            stroke: '#666',
            strokeWidth: 1,
            strokeDasharray: '4 4'
          },
          legend: '',
          legendPosition: null,
        }
      ]}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'top-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: isFullscreen ? 180 : 140,
          itemHeight: 16,
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: isFullscreen ? 14 : 12,
          symbolShape: 'circle',
          fontSize: isFullscreen ? 13 : 11,
          itemTextColor: '#666',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: '#000',
                itemBackground: '#f5f5f5'
              }
            }
          ],
          data: [
            {
              id: 'calls_01-19-2024',
              label: 'Exp: 01-19-2024',
              color: getColor('calls_01-19-2024')
            },
            {
              id: 'calls_01-26-2024',
              label: 'Exp: 01-26-2024',
              color: getColor('calls_01-26-2024')
            },
            {
              id: 'calls_02-16-2024',
              label: 'Exp: 02-16-2024',
              color: getColor('calls_02-16-2024')
            }
          ]
        }
      ]}
    />
  );
};

// Wrapper component
const DexChart = () => {
  return (
    <ChartContainer title="Delta Exposure (DEX) Chart">
      <DexChartContent />
    </ChartContainer>
  );
};

export default DexChart; 