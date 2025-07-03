import { useEffect, useState, useCallback } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';

function PipelineEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedElements, setSelectedElements] = useState({ nodes: [], edges: [] });
  const [dagStatus, setDagStatus] = useState({ valid: false, message: 'Invalid DAG' });
  const [showJSON, setShowJSON] = useState(true);

  const { fitView } = useReactFlow();

  const handleAddNode = () => {
    const label = prompt('Enter node label:');
    if (!label) return;

    const newNode = {
      id: `${+new Date()}`,
      data: { label },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      style: {
        border: '2px solid #4e91f9',
        padding: 10,
        borderRadius: 10,
        background: '#eaf1ff',
        fontWeight: '500',
        fontSize: '14px',
        color: '#333',
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const onConnect = (params) => {
    if (params.source === params.target) return;
    setEdges((eds) =>
      addEdge({ ...params, animated: true, style: { stroke: '#4e91f9' } }, eds)
    );
  };

  const onSelectionChange = useCallback(({ nodes, edges }) => {
    setSelectedElements({ nodes, edges });
  }, []);

  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) =>
      nds.filter((n) => !selectedElements.nodes.find((sn) => sn.id === n.id))
    );
    setEdges((eds) =>
      eds.filter((e) => !selectedElements.edges.find((se) => se.id === e.id))
    );
  }, [selectedElements, setNodes, setEdges]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        handleDeleteSelected();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDeleteSelected]);

  useEffect(() => {
    const validateDAG = () => {
      if (nodes.length < 2) return { valid: false, message: 'Less than 2 nodes' };

      const connectedNodeIds = new Set();
      edges.forEach((e) => {
        connectedNodeIds.add(e.source);
        connectedNodeIds.add(e.target);
      });

      const allConnected = nodes.every((node) => connectedNodeIds.has(node.id));
      if (!allConnected) return { valid: false, message: 'Some nodes are not connected' };

      const adj = {};
      nodes.forEach((n) => (adj[n.id] = []));
      edges.forEach((e) => {
        if (!adj[e.source]) adj[e.source] = [];
        adj[e.source].push(e.target);
      });

      const visited = {};
      const recStack = {};

      const hasCycle = (nodeId) => {
        if (!visited[nodeId]) {
          visited[nodeId] = true;
          recStack[nodeId] = true;

          for (const neighbor of (adj[nodeId] || [])) {
            if (!visited[neighbor] && hasCycle(neighbor)) return true;
            if (recStack[neighbor]) return true;
          }
        }
        recStack[nodeId] = false;
        return false;
      };

      for (const node of nodes) {
        if (hasCycle(node.id)) return { valid: false, message: 'Cycle detected' };
      }

      return { valid: true, message: 'Valid DAG' };
    };

    setDagStatus(validateDAG());
  }, [nodes, edges]);

  const layoutGraph = () => {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: 'LR' });

    nodes.forEach((node) => g.setNode(node.id, { width: 150, height: 50 }));
    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    dagre.layout(g);

    const newNodes = nodes.map((node) => {
      const { x, y } = g.node(node.id);
      return {
        ...node,
        position: { x, y },
        positionAbsolute: { x, y },
      };
    });

    setNodes(newNodes);
    setTimeout(() => fitView({ padding: 0.3 }), 0);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#1e1e2f' }}>
      {/* Toolbar */}
      <div
        style={{
          position: 'absolute',
          zIndex: 10,
          top: 10,
          left: 10,
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <button onClick={handleAddNode} title="Add a new node" style={buttonStyle}>
          ➕ Node
        </button>
        <button onClick={layoutGraph} title="Auto Layout" style={buttonStyle}>
          🧭 Layout
        </button>
        <button onClick={handleDeleteSelected} title="Delete selected" style={{ ...buttonStyle, background: '#ff4d4f' }}>
          🗑 Delete
        </button>
        <span style={statusStyle(dagStatus.valid)}>{dagStatus.message}</span>
        <button onClick={() => setShowJSON(!showJSON)} style={{ ...buttonStyle, background: '#222', border: '1px solid #444' }}>
          {showJSON ? '📉 Hide JSON' : '📈 Show JSON'}
        </button>
      </div>

      {/* Canvas */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        fitView
        style={{ background: '#1e1e2f' }}
      />

      {/* JSON Preview */}
      {showJSON && (
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            left: 10,
            zIndex: 10,
            background: '#111',
            color: '#eee',
            padding: 12,
            fontSize: '12px',
            maxHeight: 220,
            width: 350,
            overflow: 'auto',
            border: '1px solid #444',
            borderRadius: 6,
          }}
        >
          <strong style={{ color: '#ccc' }}>DAG JSON Preview</strong>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify({ nodes, edges }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  padding: '6px 14px',
  background: '#4e91f9',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
};

const statusStyle = (isValid) => ({
  padding: '6px 12px',
  background: isValid ? '#38b000' : '#d90429',
  color: 'white',
  borderRadius: '6px',
  fontSize: '14px',
  fontWeight: '500',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
});

export default PipelineEditor;
