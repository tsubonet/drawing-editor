import React from 'react'

const Editor: React.FC<{}> = () => {
  const [width, setWidth] = React.useState(0);
  const [height, setHeight] = React.useState(0);
  const [points, setPoints] = React.useState([
    { x: 100, y: 100 },
    { x: 140, y: 100 },
    { x: 210, y: 250 },
    { x: 250, y: 250 }
  ]);
  const [grabbingIndex, setGrabbingIndex] = React.useState(null);

  const getWindowSize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", getWindowSize);
    getWindowSize();
    () => window.removeEventListener("resize", getWindowSize);
  }, []);

  const handlePointerDown = (index) => {
    setGrabbingIndex(index);
  }

  const handlePointerMove = (e) => {
    if (grabbingIndex === null) {
      return;
    }
    const _points = points.map((p, i) => {
      if (i === grabbingIndex) {
        return {
          x: e.pageX,
          y: e.pageY,
        }
      }
      return p;
    });
    setPoints(_points);
  }

  const handlePointerUp = () => {
    setGrabbingIndex(null);
  }
  
  return (
    <div
      contentEditable
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <svg 
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
      >
        <text x="40" y="80">
          <textPath href="#MyPath">
            Hello World
          </textPath>
        </text>
        <path
          id="MyPath"
          fill="none"
          stroke="blue"
          stroke-width="3"
          d={`M${points[0].x} ${points[0].y} C ${points[1].x} ${points[1].y}, ${points[2].x} ${points[2].y}, ${points[3].x} ${points[3].y}`}
        />
        <line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke="#e0e0e0" stroke-width="4"/>
        <line x1={points[2].x} y1={points[2].y} x2={points[3].x} y2={points[3].y} stroke="#e0e0e0" stroke-width="4"/>
        <circle
          cx={points[0].x}
          cy={points[0].y}
          r="10"
          fill="#666666"
          onPointerDown={() => handlePointerDown(0) }
          
        />
        <circle
          cx={points[1].x}
          cy={points[1].y}
          r="10"
          fill="#42b883"
          onPointerDown={() => handlePointerDown(1) }
        />
        <circle
          cx={points[2].x}
          cy={points[2].y}
          r="10"
          fill="#42b883"
          onPointerDown={() => handlePointerDown(2) }
        />
        <circle
          cx={points[3].x}
          cy={points[3].y}
          r="10"
          fill="#666666"
          onPointerDown={() => handlePointerDown(3) }
        />
      </svg>
    </div>
  )
};

export default Editor