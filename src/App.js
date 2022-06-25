import './App.css';
import {SerialPortsList, SerialDialogProps} from './Components/SerialSelect.tsx';
import SerialChart from './Components/SerialChart.js';
import PersistentDrawerLeft from './Components/Drawer.tsx';

function App() {
  return (
    <div className="App">
  
      <div className="topBar">
          <div className="title"></div>
      </div>

        <PersistentDrawerLeft />

    </div>
  );
}



export default App;
