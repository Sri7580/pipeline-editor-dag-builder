import { Handle, Position } from 'reactflow';

function CustomNode({ data }) {
  return (
    <div style={{ padding: 10, border: '1px solid #333', borderRadius: 5, background: '#fff' }}>
      <Handle type="target" position={Position.Left} />
      <div>{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default CustomNode;
