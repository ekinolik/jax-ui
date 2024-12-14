import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`;

const FixedWidthWrapper = styled.div`
  width: ${props => props.$fullWidth ? '100%' : '600px'};
  margin: 0 auto;
`;

const Container = styled.div.attrs(props => ({
  'data-testid': `${props.$title?.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-')}`,
  'data-fullscreen': props.$isFullscreen
}))`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1rem 1rem 4.5rem 1rem;
  height: ${props => props.$isFullscreen ? '100vh' : '550px'};
  width: ${props => props.$isFullscreen ? '100vw' : '100%'};
  position: ${props => props.$isFullscreen ? 'fixed' : 'relative'};
  top: ${props => props.$isFullscreen ? '0' : 'auto'};
  left: ${props => props.$isFullscreen ? '0' : 'auto'};
  z-index: ${props => props.$isFullscreen ? '1000' : '1'};
  transition: all 0.3s ease;
  box-sizing: border-box;
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
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const ChartContainer = ({ title, children, fullWidth }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const testId = title?.toLowerCase().replace(/[()]/g, '').replace(/\s+/g, '-');

  const toggleFullscreen = (e) => {
    if (e) {
      e.stopPropagation();
    }
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
    <Container 
      $title={title}
      $isFullscreen={isFullscreen}
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
      {React.cloneElement(children, { 
        isFullscreen,
        key: `chart-${isFullscreen}`
      })}
    </Container>
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