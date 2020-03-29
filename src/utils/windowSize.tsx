import React from 'react';

const getSize = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = React.useState(getSize());


  const handleResize = () => {
    setWindowSize(getSize());
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
    () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
