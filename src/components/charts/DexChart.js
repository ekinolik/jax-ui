import React, { useState } from 'react';
import ChartContainer from '../common/ChartContainer';
import { OptionChartContent } from '../common/OptionChart';

const DexChart = ({ asset }) => {
  const [dte, setDte] = useState(50);

  return (
    <ChartContainer title="DEX" fullWidth isDynamic>
      <OptionChartContent
        dte={dte}
        onDteChange={setDte}
        asset={asset}
        chartType="dex"
        title="Delta Exposure"
      />
    </ChartContainer>
  );
};

export default DexChart; 