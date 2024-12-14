import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import ChartContainer from '../common/ChartContainer';

const DexChart = () => {
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

  return (
    <ChartContainer title="Delta Exposure (DEX) Chart">
      <ResponsiveBar
        data={transformedData}
        keys={[
          'calls_01-19-2024', 'calls_01-26-2024', 'calls_02-16-2024',
          'puts_01-19-2024', 'puts_01-26-2024', 'puts_02-16-2024'
        ]}
        indexBy="strike"
        layout="horizontal"
        margin={{ top: 20, right: 130, bottom: 80, left: 80 }}
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
        colors={({ id }) => getColor(id)}
        borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Delta Exposure',
          legendPosition: 'middle',
          legendOffset: 45,
          format: v => Math.abs(v).toFixed(2)
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Strike Price',
          legendPosition: 'middle',
          legendOffset: -50
        }}
        enableLabel={false}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
        tooltip={({ id, value, indexValue, data }) => {
          // Calculate sums for the strike price
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
            <div
              style={{
                padding: 12,
                background: '#ffffff',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            >
              <div style={{ color: getColor(id) }}>
                <strong>Value: {Math.abs(value).toFixed(2)}</strong>
              </div>
              <div style={{ marginTop: 4 }}>
                <div>Total Calls: {callsSum.toFixed(2)}</div>
                <div>Total Puts: {putsSum.toFixed(2)}</div>
              </div>
            </div>
          );
        }}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
        markers={[
          {
            axis: 'x',
            value: 0,
            lineStyle: { stroke: '#b0b0b0', strokeWidth: 1 },
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
            itemsSpacing: 1,
            itemWidth: 140,
            itemHeight: 16,
            itemDirection: 'left-to-right',
            itemOpacity: 0.85,
            symbolSize: 12,
            symbolShape: 'square',
            fontSize: 11,
            effects: [
              {
                on: 'hover',
                style: {
                  itemOpacity: 1
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
    </ChartContainer>
  );
};

export default DexChart; 