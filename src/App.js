import React from 'react';
import logo from './logo.svg'; 
import './App.css';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SimpleDialogDemo from './demo.tsx';


function App() {
  return (
    <div className="App">

      <header className="App-header">

        <div className="topBar"></div>
        <div className="topSpacer"></div>   

        <SimpleDialogDemo />

        <h1>Serial port read</h1>
        <textarea className="darkRegion" rows="20" cols="40" id="dataWindow"></textarea>

        We are using Node.js <span id="node-version"></span>, Chromium <span id="chrome-version"></span>, Electron <span id="electron-version"></span>, and Serialport <span id="serialport-version"></span>

        <div id="error"></div>
        <div id="ports"></div>

       
      </header>

    </div>
  );
}



export default App;
