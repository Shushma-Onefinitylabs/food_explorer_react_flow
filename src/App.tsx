import React from 'react';
import { PipelineUI } from './PipelineUI';

const App: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',          
        justifyContent: 'center', 
        alignItems: 'center',     
        backgroundColor: '#f9f9f9',
      }}
    >
      <PipelineUI />
    </div>
  );
};

export default App;
