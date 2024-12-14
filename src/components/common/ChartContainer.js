import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  height: 500px;
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const ChartContainer = ({ title, children }) => {
  return (
    <Container>
      <Title>{title}</Title>
      {children}
    </Container>
  );
};

export default ChartContainer; 