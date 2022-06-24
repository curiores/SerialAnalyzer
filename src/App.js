import './App.css';
import {SerialPortsList, SerialDialogProps} from './Components/SerialSelect.tsx';
import SerialChart from './Components/SerialChart.js';


function App() {
  return (
    <div className="App">

      <header className="App-header">

        <div className="topBar"></div>
        <div className="topSpacer"></div>   

        <SerialPortsList />
        <SerialChart />
      
      </header>

    </div>
  );
}



export default App;
