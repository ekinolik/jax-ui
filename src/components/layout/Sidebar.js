import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 8px;
  width: 200px;
`;

const MenuItem = styled.div`
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const Sidebar = () => {
  return (
    <SidebarContainer>
      <MenuItem>Dashboard</MenuItem>
      <MenuItem>Watchlist</MenuItem>
      <MenuItem>Analysis</MenuItem>
      <MenuItem>Settings</MenuItem>
    </SidebarContainer>
  );
};

export default Sidebar; 