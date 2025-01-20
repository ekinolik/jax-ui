import React, { useState } from 'react';
import ChartContainer from '../common/ChartContainer';
import { OptionChartContent } from '../common/OptionChart';

const DexChart = ({ asset }) => {
  const [dte, setDte] = useState(50);
  const [strikes, setStrikes] = useState(30);
  const [isLoading, setIsLoading] = useState(false);

  const content = (
    <OptionChartContent
      dte={dte}
      onDteChange={setDte}
      strikes={strikes}
      onStrikesChange={setStrikes}
      asset={asset}
      chartType="dex"
      title="Delta Exposure"
      onLoadingChange={setIsLoading}
    />
  );

  return (
    <ChartContainer title="DEX" fullWidth isDynamic loadingText={isLoading ? "Loading..." : null}>
      {content}
    </ChartContainer>
  );
};

export default DexChart; 