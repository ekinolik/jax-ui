import React, { useState } from 'react';
import ChartContainer from '../common/ChartContainer';
import { OptionChartContent } from '../common/OptionChart';

const GexChart = ({ asset }) => {
  const [dte, setDte] = useState(50);

  return (
    <ChartContainer title="GEX" fullWidth>
      <OptionChartContent
        dte={dte}
        onDteChange={setDte}
        asset={asset}
        chartType="gex"
        title="Gamma Exposure"
      />
    </ChartContainer>
  );
};

export default GexChart; 