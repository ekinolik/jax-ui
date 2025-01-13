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
  height: 100%;
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

const LogoutButton = styled(MenuItem)`
  margin-top: auto;
  color: #d32f2f;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: #ffebee;
  }

  &::before {
    content: '⏻';
    font-size: 1.2em;
  }
`;

const Sidebar = () => {
  const handleLogout = async () => {
    try {
      // Make a request with invalid credentials to clear the browser's auth cache
      const response = await fetch('/', {
        headers: {
          'Authorization': 'Basic invalid_token'
        }
      });
      
      // Redirect to home page which will now prompt for credentials
      window.location.href = '/';
    } catch (error) {
      // Even if the request fails (which it should), we still want to redirect
      window.location.href = '/';
    }
  };

  return (
    <SidebarContainer>
      <MenuItem>Dashboard</MenuItem>
      <MenuItem>Watchlist</MenuItem>
      <MenuItem>Analysis</MenuItem>
      <MenuItem>Settings</MenuItem>
      <LogoutButton onClick={handleLogout}>
        Logout
      </LogoutButton>
    </SidebarContainer>
  );
};

export default Sidebar; 