import React from 'react';
import styled from 'styled-components';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PriceChart from './components/charts/PriceChart';
import DexChart from './components/charts/DexChart';
import GexChart from './components/charts/GexChart';

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

const ChartGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 20px;
  flex: 1;
`;

function App() {
  return (
    <AppContainer>
      <Header />
      <MainContent>
        <Sidebar />
        <ChartGrid>
          <PriceChart />
          <DexChart />
          <GexChart />
        </ChartGrid>
      </MainContent>
    </AppContainer>
  );
}

export default App; 