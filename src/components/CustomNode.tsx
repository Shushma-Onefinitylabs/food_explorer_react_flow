// CustomNode.tsx
import React from 'react';
import { Handle, NodeProps,Position  } from 'reactflow';

interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

const CustomNode: React.FC<CustomNodeProps> = ({ data }) => {
  return (
    <div
      style={{
        backgroundColor: '#f0f0f0',
        borderRadius: '10px',
        padding: '10px',
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <Handle type="source" position={Position.Right} />
      <button onClick={data.onClick} style={{ display: 'flex',width: '170px',  alignItems: 'center',border: 'none', background: 'none', cursor: 'pointer' }}>
        {data.icon}
        {data.label}
      </button>
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default CustomNode;
