import React, { useState } from 'react';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PriceChart from './components/charts/PriceChart';
import DexChart from './components/charts/DexChart';
import GexChart from './components/charts/GexChart';
import LineChart from './components/charts/LineChart';

console.log('App component is rendering');

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const ContentArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
`;

const ChartRow = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
`;

const ChartColumn = styled.div`
  flex: 1;
`;

const App = () => {
  const [asset, setAsset] = useState('');

  return (
    <AppContainer>
      <Header 
        asset={asset}
        onAssetChange={setAsset}
      />
      <MainContent>
        <Sidebar />
        <ContentArea>
          <ChartRow>
            <ChartColumn>
              <PriceChart asset={asset} />
            </ChartColumn>
            <ChartColumn>
              <LineChart />
            </ChartColumn>
          </ChartRow>
          <ChartRow>
            <ChartColumn>
              <DexChart asset={asset} />
            </ChartColumn>
            <ChartColumn>
              <GexChart asset={asset} />
            </ChartColumn>
          </ChartRow>
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
};

export default App; 