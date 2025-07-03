import { ReactFlowProvider } from 'reactflow';
import PipelineEditor from './Components/PipelineEditor';
import 'reactflow/dist/style.css';

function App() {
  return (
    <ReactFlowProvider>
      <PipelineEditor />
    </ReactFlowProvider>
  );
}

export default App;
