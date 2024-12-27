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

const AssetInput = styled.input`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #333;
  background: #2a2a2a;
  color: white;
  font-size: 14px;
  width: 120px;

  &::placeholder {
    color: #888;
  }

  &:hover {
    border-color: #444;
  }

  &:focus {
    outline: none;
    border-color: #666;
  }
`;

const Header = ({ asset, onAssetChange }) => {
  return (
    <HeaderContainer>
      <h1>Jax Dashboard</h1>
      <div>
        <AssetInput
          type="text"
          value={asset}
          onChange={(e) => onAssetChange(e.target.value.toUpperCase())}
          placeholder="Enter asset..."
        />
      </div>
    </HeaderContainer>
  );
};

export default Header; 