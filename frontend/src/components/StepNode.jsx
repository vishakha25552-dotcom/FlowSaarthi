import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const StepNode = ({ data }) => {
  const { title, stepNumber, status } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'var(--saffron-soft)';
      case 'completed': return 'var(--teal-soft)';
      default: return 'var(--gray-border)';
    }
  };

  const isActive = status === 'active';

  return (
    <div className={`step-node ${status}`} style={{ 
      padding: '16px 24px', 
      borderRadius: '16px', 
      background: 'white', 
      border: `2px solid ${getStatusColor(status)}`,
      boxShadow: isActive ? '0 10px 15px -3px rgba(244, 162, 97, 0.2)' : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      minWidth: '220px',
      textAlign: 'center',
      transition: 'all 0.2s ease',
      transform: isActive ? 'scale(1.02)' : 'scale(1)'
    }}>
      <Handle type="target" position={Position.Top} style={{ background: '#cbd5e1', border: 'none' }} />
      
      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '6px', letterSpacing: '0.05em' }}>
        STEP {stepNumber}
      </div>
      <div style={{ fontWeight: '700', color: 'var(--text-dark)', fontSize: '1rem' }}>
        {title}
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#cbd5e1', border: 'none' }} />
    </div>
  );
};

export default memo(StepNode);
