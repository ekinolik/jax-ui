import React from 'react';
import styled from 'styled-components';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #f5f5f5;
  padding: 1rem;
`;

const MenuItem = styled.div`
  padding: 0.5rem;
  cursor: pointer;
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