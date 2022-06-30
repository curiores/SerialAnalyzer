import React from 'react';

import { SerialDataObject } from '../Utils/SerialData';
// --------------------------------------------------------------------

var refreshRate = 50; // In ms

const divStyle = {
  width: '86%',
  marginLeft: '7%',
  marginRight: '7%',
  height: '100px',
  backgroundColor: 'rgb(30,30,30)',
  outline:'solid rgb(150,150,150) 1px',
  borderRadius:'0px',
  textAlign:'left',
  padding:'10px',
  paddingTop:'4px',
  fontSize: '0.85rem',
  fontFamily:'consolas',
  display: 'flex',
  flexDirection:'column-reverse',
  overflowY:'auto',
};

export default class Monitor extends React.Component{
     
  constructor(props){
    super(props)
    // This chart reference is needed to update the charts
    this.divRef = React.createRef(); 
    this.textRef = React.createRef(); 
  };
  
  updateMonitor(){
    
    if(this.textRef !== null && !SerialDataObject.pauseFlag){

      // Need to set the height by hand
      // for consistency with the chart sizes
      var parentHeight = this.divRef.current.parentElement.clientHeight;
      this.divRef.current.style.marginTop = 0.04*parentHeight + 'px';
      this.divRef.current.style.height = 0.9*SerialDataObject.chartHeightRatio*parentHeight + 'px';
      // this.divRef.current.innerText = this.divRef.current.innerText  + ".... \n";
      this.divRef.current.innerText = SerialDataObject.rawData.join('\n');
    }
    
  }

  timer = null;
  componentDidMount(){
    // This will refresh the chart as often as indiciated
    // in the variable refreshRate
    this.timer = setInterval(() => {
      this.updateMonitor();
    }, refreshRate); 
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  // Render the chart component (this only updates when the chart is created)
  render(){
    return(
      <div style={divStyle} ref={this.divRef}>
      </div>
    )
  }
}
