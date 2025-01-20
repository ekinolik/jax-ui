import React, { useState } from 'react';
import ChartContainer from '../common/ChartContainer';
import { OptionChartContent } from '../common/OptionChart';

const GexChart = ({ asset }) => {
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
      chartType="gex"
      title="Gamma Exposure"
      onLoadingChange={setIsLoading}
    />
  );

  return (
    <ChartContainer title="GEX" fullWidth isDynamic loadingText={isLoading ? "Loading..." : null}>
      {content}
    </ChartContainer>
  );
};

export default GexChart; 