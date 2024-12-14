import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: #1a1a1a;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <h1>Jax Dashboard</h1>
      <div>
        <input type="text" placeholder="Search stocks..." />
      </div>
    </HeaderContainer>
  );
};

export default Header; 