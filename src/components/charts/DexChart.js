import React, { useState } from 'react';
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
const STRIKE_OPTIONS = [20, 30, 50, 80, 100, 150, 200];

const generateExpirationDates = (dte) => {
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

const generateDataWithExpirations = (dte, strikes) => {
  const expirationDates = generateExpirationDates(dte);
  const data = [];
  const basePrice = 100;
  const priceStep = 5;

  // Generate strike prices
  for (let i = 0; i < strikes; i++) {
    const strikePrice = basePrice + (i - Math.floor(strikes/2)) * priceStep;
    const dataPoint = {
      strike: `$${strikePrice}`,
    };

    // Add data for each expiration date
    expirationDates.forEach(exp => {
      const callKey = `calls_${exp}`;
      const putKey = `puts_${exp}`;
      // Mock data generation - replace with real data
      dataPoint[callKey] = Math.random() * 0.8;
      dataPoint[putKey] = -Math.random() * 0.8;
    });

    data.push(dataPoint);
  }

  return data.reverse();
};

const DexChartContent = ({ isFullscreen }) => {
  const [dte, setDte] = useState(50);
  const [strikes, setStrikes] = useState(30);

  // Generate expiration dates based on DTE
  const expirationDates = generateExpirationDates(dte);
  const data = generateDataWithExpirations(dte, strikes);

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
    const expIndex = expirationDates.indexOf(expDate);
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

  const handleDteChange = (e) => {
    e.stopPropagation();
    setDte(Number(e.target.value));
  };

  const handleStrikesChange = (e) => {
    e.stopPropagation();
    setStrikes(Number(e.target.value));
  };

  // Calculate max value from the new data structure
  const maxValue = Math.max(
    ...data.map(item => {
      const callsSum = expirationDates.reduce((sum, exp) => sum + Math.abs(item[`calls_${exp}`] || 0), 0);
      const putsSum = expirationDates.reduce((sum, exp) => sum + Math.abs(item[`puts_${exp}`] || 0), 0);
      return Math.max(callsSum, putsSum);
    })
  );

  // Transform the data
  const transformedData = data.map(item => {
    const transformed = { strike: item.strike };
    expirationDates.forEach(exp => {
      transformed[`calls_${exp}`] = -item[`calls_${exp}`];
      transformed[`puts_${exp}`] = -item[`puts_${exp}`];
    });
    return transformed;
  });

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
          <label>DTE:</label>
          <Select value={dte} onChange={handleDteChange}>
            {DTE_OPTIONS.map(value => (
              <option key={value} value={value}>
                {value} days
              </option>
            ))}
          </Select>
        </SelectGroup>
        <SelectGroup>
          <label>Strikes:</label>
          <Select value={strikes} onChange={handleStrikesChange}>
            {STRIKE_OPTIONS.map(value => (
              <option key={value} value={value}>
                {value} strikes
              </option>
            ))}
          </Select>
        </SelectGroup>
      </ControlsContainer>
      <ResponsiveBar
        data={transformedData}
        keys={keys}
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
          padding: 0.4
        }}
        enableGridY={true}
        enableGridX={true}
        gridXValues={[0]}
        gridYValues={undefined}
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
              stroke: '#999999',
              strokeWidth: 1,
              strokeDasharray: '4 4',
              strokeOpacity: 0.4
            }
          }
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
            data: expirationDates.map(exp => ({
              id: `calls_${exp}`,
              label: `Exp: ${exp}`,
              color: getColor(`calls_${exp}`)
            }))
          }
        ]}
      />
    </>
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