import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import ChartContainer from '../common/ChartContainer';

const tickers = [90, 92.50, 95, 97.50, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 210, 220, 230, 240, 250];

const findSmallestIncrement = (values) => {
    if (!values || values.length < 2) return null;
    
    // Sort the values
    const sortedValues = [...values].sort((a, b) => a - b);
    
    // Find smallest difference between consecutive values
    let smallestDiff = Infinity;
    for (let i = 1; i < sortedValues.length; i++) {
        const diff = sortedValues[i] - sortedValues[i-1];
        if (diff < smallestDiff) {
            smallestDiff = diff;
        }
    }
    
    return smallestDiff;
};

const adjustedYValues = (values, smallestIncrement) => {
    let data = [];
    let lastValue = values[0] - smallestIncrement;
    for (let i = 0; i < values.length; i++) {
        let curIncrement = values[i] - lastValue;
        if (curIncrement > smallestIncrement) {
            let multiplier = curIncrement / smallestIncrement;
        }
        data.push(values[i] - smallestIncrement);
        lastValue = values[i];
    }
    return data;
};

const generateDummyYValues = () => {
    let data = [];
    for (let i = 0; i < tickers.length; i++) {
        if (tickers[i] <= 100) {
            data.push(tickers[i]);
        } else if (tickers[i] <= 200) {
            data.push(100 + ((tickers[i] - 100) / 2));
        } else {
            data.push(100 + 50 + ((tickers[i] - 200) / 4));
        }
    }
    return data;
};

const generateDummyData = () => {
  const data = [];
  let curValue = 0;
  let displayValue = 90;
  for (let i = 0; i < tickers.length; i++) {
    curValue = tickers[i];
    if (curValue > 100 && curValue <= 200) {
        displayValue = 100 + ((curValue - 100) / 2);
    } else if (curValue > 200) {
        displayValue = 100 + 50 + ((curValue - 200) / 4);
    } else {
        displayValue = curValue;
    }
    data.push({
      x: i,
      y: displayValue
    });
  }
  return [{
    id: 'dummy-line',
    data: data
  }];
};

const LineChartContent = ({ isFullscreen }) => {
  const margin = isFullscreen ? 
    { top: 40, right: 160, bottom: 100, left: 100 } : 
    { top: 20, right: 30, bottom: 65, left: 80 };

  return (
    <div style={{ height: '470px' }}>
      <ResponsiveLine
        data={generateDummyData()}
        margin={margin}
        xScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto'
        }}
        yScale={{
          type: 'linear',
          min: 90,
          max: generateDummyYValues()[generateDummyYValues().length - 1],
          stacked: false
        }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'X Axis',
          legendPosition: 'middle',
          legendOffset: 45
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Y Axis',
          legendPosition: 'middle',
          legendOffset: -45,
          tickValues: generateDummyYValues(),
          format: value => value.toFixed(2)
        }}
        enablePoints={false}
        enableGridX={true}
        enableGridY={true}
        colors={['#4CAF50']}
        lineWidth={2}
        enableArea={true}
        areaOpacity={0.1}
        animate={false}
        isInteractive={true}
        useMesh={true}
        legends={[]}
      />
    </div>
  );
};

const LineChart = () => {
  return (
    <ChartContainer title="Line Chart" fullWidth isDynamic>
      <LineChartContent />
    </ChartContainer>
  );
};

export default LineChart; 