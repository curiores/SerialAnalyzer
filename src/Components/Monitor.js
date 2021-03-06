import React from 'react';

import { SerialDataObject } from '../Utils/SerialData';
import { GlobalSettings } from '../Utils/GlobalSettings';

var refreshRate = GlobalSettings.monitor.refreshRate; // In ms

const divStyle = {
  width: '86%',
  maxWidth: '86vw',
  marginLeft: '7%',
  marginRight: '7%',
  height: '100px',
  backgroundColor: 'rgb(30,30,30)',
  outline: 'solid rgb(150,150,150) 1px',
  borderRadius: '0px',
  textAlign: 'left',
  padding: '10px',
  paddingTop: '4px',
  fontSize: '0.85rem',
  fontFamily: 'consolas',
  display: 'flex',
  flexDirection: 'column-reverse',
  overflowY: 'auto',
  whiteSpace: 'pre',
};

/* Defines the serial monitor as a styled div.
   Use references to update it every refreshRate milliseconds.
*/

export default class Monitor extends React.Component {

  constructor(props) {
    super(props)
    // This chart reference is needed to update the charts
    this.divRef = React.createRef();
    this.textRef = React.createRef();
  };

  updateMonitor() {
    if (this.textRef !== null && !SerialDataObject.pauseFlag) {
      // Need to set the height by hand
      // for consistency with the chart sizes
      var parentHeight = this.divRef.current.parentElement.clientHeight;
      this.divRef.current.style.marginTop = 0.04 * parentHeight + 'px';
      this.divRef.current.style.height = 0.9 * SerialDataObject.chartHeightRatio * parentHeight + 'px';
      // this.divRef.current.innerText = this.divRef.current.innerText  + ".... \n";
      this.divRef.current.innerText = SerialDataObject.rawData.join('\n');
      this.divRef.current.style.fontSize = GlobalSettings.monitor.fontSize / 12.0 * 0.85 + "rem";
      if(GlobalSettings.global.drawerOpen){
        this.divRef.current.style.maxWidth = "calc(86vw - " + GlobalSettings.style.drawerWidth + "px)";
      }
      else{
        this.divRef.current.style.maxWidth = "86vw";
      }
    }
  }

  timer = null;
  componentDidMount() {
    // This will refresh the chart as often as indiciated
    // in the variable refreshRate
    this.timer = setInterval(() => {
      this.updateMonitor();
    }, refreshRate);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // SerialDataObject.Monitor.fontSize/12.0*0.85 + "rem";
  // Render the chart component (this only updates when the chart is created)
  render() {
    return (
      <div style={divStyle} ref={this.divRef}>
      </div>
    )
  }
}
