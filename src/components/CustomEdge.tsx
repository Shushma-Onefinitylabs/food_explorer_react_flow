import React from 'react';
import { EdgeProps, getBezierPath } from 'reactflow';

const CustomEdge: React.FC<EdgeProps> = ({ id, sourceX, sourceY, targetX, targetY, markerEnd }) => {
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <path
      id={id}
      style={{ stroke: '#f6ab00', strokeWidth: 1 }} // Customize the edge appearance
      d={path}
      markerEnd={markerEnd}
    />
  );
};

export default CustomEdge;
