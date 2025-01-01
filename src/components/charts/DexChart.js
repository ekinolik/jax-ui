import React, { useState } from 'react';
import ChartContainer from '../common/ChartContainer';
import { OptionChartContent } from '../common/OptionChart';

const DexChart = ({ asset }) => {
  const [dte, setDte] = useState(50);
  const [strikes, setStrikes] = useState(30);

  const content = (
    <OptionChartContent
      dte={dte}
      onDteChange={setDte}
      strikes={strikes}
      onStrikesChange={setStrikes}
      asset={asset}
      chartType="dex"
      title="Delta Exposure"
    />
  );

  return (
    <ChartContainer title="DEX" fullWidth isDynamic>
      {content}
    </ChartContainer>
  );
};

export default DexChart; 