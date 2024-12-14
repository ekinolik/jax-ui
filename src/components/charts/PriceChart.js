import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import ChartContainer from '../common/ChartContainer';

const PriceChart = () => {
  const data = [
    {
      id: "stock price",
      data: [
        { x: "2024-01", y: 100 },
        { x: "2024-02", y: 120 },
        { x: "2024-03", y: 90 },
        // Add more data points as needed
      ]
    }
  ];

  return (
    <ChartContainer title="Price Chart">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto' }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
        }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        enablePointLabel={true}
        pointLabel="y"
        pointLabelYOffset={-12}
      />
    </ChartContainer>
  );
};

export default PriceChart; 