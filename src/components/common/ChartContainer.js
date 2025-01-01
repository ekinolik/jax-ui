import React, { useState } from 'react';
import styled from 'styled-components';

export const Wrapper = styled.div`
  margin: 16px;
`;

export const FixedWidthWrapper = styled.div`
  width: ${props => props.$fullWidth ? '100%' : '600px'};
`;

export const Container = styled.div`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: ${props => props.$isFullscreen ? '100vh' : '550px'};
  display: flex;
  flex-direction: column;
  overflow: ${props => props.$isFullscreen ? 'auto' : 'hidden'};
  
  &[data-fullscreen="true"] {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    border-radius: 0;
    padding: 32px;
    height: 100vh;
    overflow-y: auto;
  }
`;

const DynamicContainer = styled(Container)`
  height: ${props => props.$isFullscreen ? '100vh' : 'auto'};
  min-height: ${props => props.$isFullscreen ? '100vh' : '550px'};
  max-height: ${props => props.$isFullscreen ? 'none' : 'none'};
  overflow: ${props => props.$isFullscreen ? 'auto' : 'hidden'};
`;

const Title = styled.h2`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FullscreenButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;
  font-size: 1.2rem;
  
  &:hover {
    color: #000;
  }
`;

const ChartContainer = ({ title, children, fullWidth, isDynamic = false }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const testId = title?.toLowerCase().replace(/\s+/g, '-');
  const ContainerComponent = isDynamic ? DynamicContainer : Container;

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  // Handle escape key to exit fullscreen
  React.useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const content = (
    <ContainerComponent 
      data-testid={testId}
      data-fullscreen={isFullscreen.toString()}
      $isFullscreen={isFullscreen}
      $isDynamic={isDynamic}
    >
      <Title>
        {title}
        <FullscreenButton 
          onClick={toggleFullscreen} 
          data-testid={`${testId}-fullscreen-button`}
        >
          {isFullscreen ? '×' : '⛶'}
        </FullscreenButton>
      </Title>
      <div>
        {React.cloneElement(children, { 
          isFullscreen,
          key: `chart-${isFullscreen}`
        })}
      </div>
    </ContainerComponent>
  );

  return (
    <Wrapper>
      {isFullscreen ? content : (
        <FixedWidthWrapper $fullWidth={fullWidth}>
          {content}
        </FixedWidthWrapper>
      )}
    </Wrapper>
  );
};

export default ChartContainer; 