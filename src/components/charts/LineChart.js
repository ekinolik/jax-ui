import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import ChartContainer from '../common/ChartContainer';

/*
const generateDummyData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    const rawY = Math.sin(i * 0.5) * 10 + 20 + Math.random() * 5;
    data.push({
      x: i,
      y: rawY
    });
  }
  return [{
    id: 'dummy-line',
    data: data
  }];
};
*/

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
}
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
    //displayValue = tickers[i];
    data.push({
      x: i,
      y: displayValue
    });
  }
  console.log("CURVALUE: ", curValue);
  return [{
    id: 'dummy-line',
    data: data
  }];
};

const customYScale = value => {
  if (value <= 30) return value * (0.6 / 30); // First 30 units use 60% of space
  if (value >= 40) return 0.7 + (value - 40) * (0.3 / 10); // Last 10 units use 30% of space
  return 0.6 + (value - 30) * (0.1 / 10); // Middle 10 units use 10% of space
};

const LineChartContent = ({ isFullscreen }) => {
  const margin = isFullscreen ? 
    { top: 40, right: 160, bottom: 100, left: 100 } : 
    { top: 20, right: 30, bottom: 65, left: 80 };

  // Calculate positions for grid lines and ticks
  const normalSpacing = 10;  // Normal spacing between grid lines
  const compressedSpacing = normalSpacing / 2;  // Half spacing for 30-40 range
  
  const gridValues = [];
  let currentValue = 0;
  
  // Add grid lines from 0 to 30 with normal spacing
  while (currentValue <= 30) {
    gridValues.push(currentValue);
    currentValue += normalSpacing;
  }
  
  // Add grid lines from 30 to 40 with compressed spacing
  currentValue = 30;
  while (currentValue <= 40) {
    gridValues.push(currentValue);
    currentValue += compressedSpacing;
  }
  
  // Add grid lines from 40 to 50 with normal spacing
  currentValue = 40;
  while (currentValue <= 50) {
    gridValues.push(currentValue);
    currentValue += normalSpacing;
  }

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
          stacked: false,
          format: value => {
            //if (value <= 30) return value;
            //if (value <= 40) return 30 + (value - 30) * 2;
            //return 50 + (value - 40);
            //if (value <= 100) return value.toFixed(0);
            //if (value <= 200) return 120 + (value - 100);
            //return 250 + (value - 200);
            return 1000;
          }
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
          //tickValues: tickers, //[90, 92.50, 95, 97.50, 100, 105, 110, 115, 120, 125, 130, 135, 140, 145, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 210, 220, 230, 240, 250],
          tickValues: generateDummyYValues(),
          format: value => {
            return value.toFixed(2);
            //if (value <= 100) return (value).toFixed(2);
            //if (value <= 200) return (100 + ((value -100) * .5)).toFixed(2);
            //return (100 + 50 + ((value - 200) * .25)).toFixed(2);
            //if (value <= 100) return value.toFixed(0);
            //if (value <= 200) return (100 + (value - 100) / 2).toFixed(0);
            //return (200 + (value - 250)).toFixed(0);
            //return (100 + (value - 100) / 2).toFixed(0);
          }
        }}
        enablePoints={false}
        enableGridX={true}
        enableGridY={true}
        gridYValues={gridValues}
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