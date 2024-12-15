import React, { useState, useEffect } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
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

const transformApiData = (rawData, dte) => {
  // Get all unique strikes and sort them
  const strikes = Object.keys(rawData)
    .filter(key => key !== 'spotPrice')
    .sort((a, b) => parseFloat(a) - parseFloat(b));
  
  // Get all dates within DTE range
  const today = new Date();
  const maxDate = new Date(today.getTime() + (dte * 24 * 60 * 60 * 1000));
  
  // Get all unique dates and filter by DTE
  const allDates = new Set();
  strikes.forEach(strike => {
    Object.keys(rawData[strike]).forEach(date => {
      const expDate = new Date(date);
      if (expDate >= today && expDate <= maxDate) {
        allDates.add(date);
      }
    });
  });
  const dates = Array.from(allDates).sort();

  // Transform data into chart format
  return strikes.map(strike => {
    const dataPoint = {
      strike: parseFloat(strike),
    };

    dates.forEach(date => {
      const strikeData = rawData[strike][date] || {};
      const callKey = `calls_${date}`;
      const putKey = `puts_${date}`;
      dataPoint[callKey] = -(strikeData.call?.Dex || 0);
      dataPoint[putKey] = -strikeData.put?.Dex || 0;
    });

    return dataPoint;
  });
};

const ChartWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const OverlayChart = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const DexChartContent = ({ isFullscreen, dte, onDteChange }) => {
  const [strikes, setStrikes] = useState(30);
  const [chartData, setChartData] = useState([]);
  const [expirationDates, setExpirationDates] = useState([]);
  const [spotPrice, setSpotPrice] = useState(null);

  useEffect(() => {
    // Import the sample data
    import('../../data/sample-data.json').then(data => {
      const newData = transformApiData(data.default, dte);
      setChartData(newData);
      setSpotPrice(data.default.spotPrice);
      
      // Extract unique dates
      const dates = new Set();
      newData.forEach(item => {
        Object.keys(item)
          .filter(key => key.startsWith('calls_'))
          .forEach(key => dates.add(key.replace('calls_', '')));
      });
      setExpirationDates(Array.from(dates).sort());
    });
  }, [dte]);

  const handleDteChange = (e) => {
    e.stopPropagation();
    onDteChange(e.target.value);
  };

  // Generate keys for the chart based on expiration dates
  const keys = expirationDates.flatMap(exp => [
    `calls_${exp}`,
    `puts_${exp}`
  ]);

  // Define DTE ranges and their gradients
  const dteRanges = [
    { max: 20, startColor: { r: 76, g: 175, b: 80 }, endColor: { r: 156, g: 39, b: 176 } },    // Green to Purple
    { max: 50, startColor: { r: 33, g: 150, b: 243 }, endColor: { r: 244, g: 67, b: 54 } },    // Blue to Red
    { max: 180, startColor: { r: 255, g: 152, b: 0 }, endColor: { r: 121, g: 85, b: 72 } },    // Orange to Brown
    { max: 360, startColor: { r: 233, g: 30, b: 99 }, endColor: { r: 103, g: 58, b: 183 } },   // Pink to Deep Purple
    { max: 500, startColor: { r: 0, g: 150, b: 136 }, endColor: { r: 255, g: 235, b: 59 } }    // Teal to Yellow
  ];

  const getColor = (id) => {
    const expDate = expirationDates.find(exp => id.includes(exp));
    const daysToExp = Math.ceil((new Date(expDate) - new Date()) / (1000 * 60 * 60 * 24));

    // Find the appropriate gradient range
    let gradientRange = dteRanges.find((range, index) => {
      const prevMax = index > 0 ? dteRanges[index - 1].max : 0;
      return daysToExp > prevMax && daysToExp <= range.max;
    });

    // If no range found, use the last range
    if (!gradientRange) {
      gradientRange = dteRanges[dteRanges.length - 1];
    }

    // Find relative position within this range
    const prevMax = dteRanges[dteRanges.indexOf(gradientRange) - 1]?.max || 0;
    const rangeSize = gradientRange.max - prevMax;
    const positionInRange = (daysToExp - prevMax) / rangeSize;

    // Calculate color interpolation
    const r = Math.round(gradientRange.startColor.r + (gradientRange.endColor.r - gradientRange.startColor.r) * positionInRange);
    const g = Math.round(gradientRange.startColor.g + (gradientRange.endColor.g - gradientRange.startColor.g) * positionInRange);
    const b = Math.round(gradientRange.startColor.b + (gradientRange.endColor.b - gradientRange.startColor.b) * positionInRange);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const handleStrikesChange = (e) => {
    e.stopPropagation();
    setStrikes(Number(e.target.value));
  };

  // Calculate max value from the new data structure
  const maxValue = Math.max(
    ...chartData.map(item => {
      const callsSum = expirationDates.reduce((sum, exp) => sum + Math.abs(item[`calls_${exp}`] || 0), 0);
      const putsSum = expirationDates.reduce((sum, exp) => sum + Math.abs(item[`puts_${exp}`] || 0), 0);
      return Math.max(callsSum, putsSum);
    })
  );

  // Create data for the line chart (just one point for the spot price)
  const lineData = [
    {
      id: 'spot',
      data: [{ x: 0, y: spotPrice }]
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
    <>
      <ControlsContainer onClick={e => e.stopPropagation()}>
        <SelectGroup>
          <label htmlFor="dte-select">DTE:</label>
          <Select 
            id="dte-select"
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
          <label htmlFor="strikes-select">Strikes:</label>
          <Select 
            id="strikes-select"
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
      <ChartWrapper>
        <ResponsiveBar
          data={chartData}
          keys={keys}
          indexBy="strike"
          layout="horizontal"
          margin={isFullscreen ? 
            { top: 0, right: 160, bottom: 100, left: 100 } : 
            { top: 0, right: 130, bottom: 65, left: 80 }
          }
          valueScale={{ 
            type: 'linear',
            min: -maxValue,
            max: maxValue,
          }}
          indexScale={{ 
            type: 'band',
            round: true,
            padding: 0.2,
            align: 0.5
          }}
          enableGridY={true}
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
            grid: {
              line: {
                stroke: '#e0e0e0',
                strokeWidth: 1,
                strokeDasharray: 'none'
              }
            }
          }}
          markers={[
            {
              axis: 'x',
              value: 0,
              lineStyle: { 
                stroke: '#ff0000',
                strokeWidth: 2,
                strokeDasharray: 'none'
              },
              legend: '',
              legendPosition: null,
            }
          ]}
          colors={({ id }) => getColor(id)}
          borderRadius={2}
          borderWidth={1}
          borderColor={{ from: 'color', modifiers: [['darker', 0.6]] }}
          axisTop={null}
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
            legendOffset: -50,
            format: value => `$${value}`
          }}
          enableLabel={false}
          animate={true}
          motionConfig="gentle"
          tooltip={({ id, value, indexValue, data }) => {
            const callsSum = expirationDates.reduce((sum, exp) => 
              sum + Math.abs(data[`calls_${exp}`] || 0), 0
            );
            const putsSum = expirationDates.reduce((sum, exp) => 
              sum + Math.abs(data[`puts_${exp}`] || 0), 0
            );

            const expDate = expirationDates.find(exp => id.includes(exp));
            const isCall = id.startsWith('calls');

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
                  marginBottom: '4px'
                }}>
                  Expiration: {expDate}
                </div>
                <div style={{ 
                  color: '#333',
                  fontWeight: 600,
                  marginBottom: '12px'
                }}>
                  Strike: {indexValue}
                </div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto auto',
                  gap: '8px 16px'
                }}>
                  <div style={{ color: '#666' }}>{isCall ? 'Call' : 'Put'} Value:</div>
                  <div style={{ 
                    fontWeight: 500,
                    color: getColor(id)
                  }}>{Math.abs(value).toFixed(2)}</div>
                  <div style={{ color: '#666' }}>Total Calls:</div>
                  <div style={{ fontWeight: 500 }}>{callsSum.toFixed(2)}</div>
                  <div style={{ color: '#666' }}>Total Puts:</div>
                  <div style={{ fontWeight: 500 }}>{putsSum.toFixed(2)}</div>
                </div>
              </div>
            );
          }}
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
              data: expirationDates.map(exp => ({
                id: `calls_${exp}`,
                label: `Exp: ${exp}`,
                color: getColor(`calls_${exp}`)
              }))
            }
          ]}
        />
        <OverlayChart>
          <ResponsiveLine
            data={lineData}
            margin={isFullscreen ? 
              { top: 0, right: 160, bottom: 100, left: 100 } : 
              { top: 0, right: 130, bottom: 65, left: 80 }
            }
            xScale={{ type: 'linear', min: -maxValue, max: maxValue }}
            yScale={{ type: 'linear', min: Math.min(...chartData.map(d => d.strike)), max: Math.max(...chartData.map(d => d.strike)) }}
            enableGridX={false}
            enableGridY={false}
            enablePoints={false}
            enableArea={false}
            axisTop={null}
            axisRight={null}
            axisBottom={null}
            axisLeft={null}
            markers={[
              {
                axis: 'y',
                value: spotPrice,
                lineStyle: { 
                  stroke: '#ff9999',
                  strokeWidth: 2,
                  strokeDasharray: 'none'
                },
                legend: `Spot: $${spotPrice?.toFixed(2)}`,
                legendPosition: 'left',
                legendOffsetX: -60,
                legendOrientation: 'horizontal',
                textStyle: {
                  fill: '#333',
                  fontSize: 9,
                  textAnchor: 'end',
                  dominantBaseline: 'text-after-edge'
                }
              }
            ]}
          />
        </OverlayChart>
      </ChartWrapper>
    </>
  );
};

// Wrapper component
const DexChart = ({ dte, onDteChange }) => {
  return (
    <ChartContainer title="Delta Exposure (DEX) Chart">
      <DexChartContent dte={dte} onDteChange={onDteChange} />
    </ChartContainer>
  );
};

export default DexChart; 