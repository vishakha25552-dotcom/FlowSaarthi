import React, { useMemo, useEffect } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import StepNode from './StepNode';

const nodeTypes = {
  customStep: StepNode,
};

// Internal component to handle programmatic flow movements
const FlowMover = ({ nodes }) => {
  const { setCenter } = useReactFlow();

  useEffect(() => {
    // Find the active node and center it
    const activeNode = nodes.find(n => n.status === 'active');
    if (activeNode) {
      // Find the index to calculate the y position (same as mapping logic)
      const index = nodes.indexOf(activeNode);
      setCenter(0, index * 180, { zoom: 1, duration: 800 });
    }
  }, [nodes, setCenter]);

  return null;
};

const FlowCanvas = ({ nodes, edges, onNodeSelect }) => {
  const flowNodes = useMemo(() => 
    nodes.map((node, index) => ({
      id: node.id,
      type: 'customStep',
      data: { 
        title: node.title, 
        stepNumber: node.stepNumber, 
        status: node.status 
      },
      position: { x: 0, y: index * 180 }, 
    }))
  , [nodes]);

  const flowEdges = useMemo(() => 
    edges.map(edge => ({
      ...edge,
      id: `e-${edge.source}-${edge.target}`,
      animated: true,
      style: { stroke: '#cbd5e1', strokeWidth: 2 },
    }))
  , [edges]);

  return (
    <div style={{ width: '100%', height: '500px', background: 'var(--gray-light)', borderRadius: '16px', border: '1px solid var(--gray-border)' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => {
              const originalNode = nodes.find(n => n.id === node.id);
              onNodeSelect(originalNode);
          }}
          fitView
        >
          <Background color="#cbd5e1" gap={20} />
          <Controls />
          <FlowMover nodes={nodes} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowCanvas;
