import React from 'react';
import { Line } from 'react-chartjs-2';
import { fft } from 'fft-js';
import { hann, hamming, cosine, lanczos, gaussian, tukey, 
  blackman, exact_blackman, kaiser, nuttall, blackman_harris,
  blackman_nuttall, flat_top } from "fft-windowing";

import { SerialDataObject } from '../Utils/SerialData';
import { colorList } from '../Resources/colorList.js';
import { reformatDataVec, nextPowerOf2, autoResizeSpectrum } from '../Utils/DataUtils.js';
import { GlobalSettings } from '../Utils/GlobalSettings';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, LogarithmicScale, Title, Tooltip, Legend,
} from 'chart.js';

const fftUtil = require('fft-js').util;

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend
);
  
// Settings
const refreshRate = GlobalSettings.spectrum.refreshRate; // In ms
const padChars = GlobalSettings.style.plotPadChars; // How many characters to pad with
const gridColor = GlobalSettings.style.gridColor;
const plotFontColor = GlobalSettings.style.plotFontColor;
const axisColor = GlobalSettings.style.axisColor;

const divStyle = {
  width: '95%',
  margin: 'auto',
  flex: '1 1 auto',
  display: 'flex',
};

// Creates the spectrum
function createSpectrum(xvec,yarray,yindex,sampleRate){

  // Create the vector of values
  var f = [];
  for(var k = 0; k < xvec.length; k++){
    if(isNaN(yarray[k][yindex])){
      yarray[k][yindex] = 0;
    }
    f.push(yarray[k][yindex]);
  }
 
  // Select window
  var fwindowed = f;
  switch(GlobalSettings.spectrum.windowFunc){
    case "hann":
      fwindowed = hann(f);
      break;
    case "hamming":
      fwindowed = hamming(f);
      break;
    case "cosine":
      fwindowed = cosine(f);
      break;
    case "lanczos":
      fwindowed = lanczos(f);
      break;
    case "gaussian":
      fwindowed = gaussian(f);
      break;
    case "tukey":
      fwindowed = tukey(f);
      break;  
    case "blackman":
      fwindowed = blackman(f);
      break;  
    case "exact_blackman":
      fwindowed = exact_blackman(f);
      break;  
    case "kaiser":
      fwindowed = kaiser(f);
      break;  
    case "nuttall":
      fwindowed = nuttall(f);
      break;  
    case "blackman_harris":
      fwindowed = blackman_harris(f);
      break;  
    case "blackman_nuttall":
      fwindowed = blackman_nuttall(f);
      break;  
    case "flat_top":
      fwindowed = flat_top(f);
      break;
    default:
      fwindowed = f;
  }

  // Now padd with zeros so fft-js doesn't fail
  var Npadded = nextPowerOf2(fwindowed.length);
  for( var k = xvec.length; k < Npadded; k++ ){
    fwindowed.push(0);
  }
  
  // Take the fft of the values
  var fhat = fft(fwindowed);
  var freq = fftUtil.fftFreq(fhat, sampleRate);
  var mag = fftUtil.fftMag(fhat); 

  return {freq:freq,mag:mag};
}

var data = {
  labels: [],
  datasets: [],
};

var defaultChartOptions = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  tension: 0.1,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        color: plotFontColor
      }
    },
    title: {
      display: false
    },
  },
  elements: {
    point:{
        radius: 0
    }
  },
  scales:{
      x: {
          type: 'linear',
          min: 0,
          max: 1,
          grid: {
            color: gridColor,
            borderColor: axisColor
          },
          ticks:{
            color: plotFontColor
          }
      },
      y: {
        type: 'linear',
        min: 0.001,
        max: 1000,
        grid: {
          color: gridColor,
          borderColor: axisColor
        },
        ticks:{
          color: plotFontColor,
          callback: spectrumAxisCallback
        }
    }
  }
};

function spectrumAxisCallback(label,index,labels){
  if(GlobalSettings.spectrum.logScale){
    var slabel = label.toExponential().toString();
    return slabel.padStart( padChars - slabel.length, " ");
  }
  else{
    return label.toString().padStart( padChars - label.toString().length, " ") ;
  }
}


/* The main spectrum chart component.
   This file could be refactored to separate some of the background computations
   from the presentation. However, most of them are tied together,
   so it wouldn't actually help that much.
*/

export default class Spectrum extends React.Component{
     
  constructor(props){
    super(props)
    // This chart reference is needed to update the charts
    this.divRef = React.createRef(); 
    this.chartRef = React.createRef(); 
    this.labelRef = React.createRef();
  };

  updateChart(){
    if(this.chartRef !== null ){
      // Get the reference to the chart object
      var chart = this.chartRef.current;

      if(chart !== null ){
        if(SerialDataObject.data.length !== 0 && !SerialDataObject.pauseFlag){
          // Get the size of the data
          var nel = SerialDataObject.data.length;
          var nvars = SerialDataObject.data[nel-1].length;

          // Check if there are enough chart data objects
          var k = chart.data.datasets.length;
          while(chart.data.datasets.length < nvars ){
            // Add a new dataset if its too short
            chart.data.datasets.push(
              {
                label: (k+1) ,
                color: plotFontColor,
                data: [],
                borderColor: colorList[k % colorList.length],
                backgroundColor: colorList[k % colorList.length],
                borderWidth: GlobalSettings.global.lineThickness,
              },
            )
            k = k + 1;
          }
          while(chart.data.datasets.length > nvars ){
            // If there are too many, remove the last one.
            chart.data.datasets.pop();
          }

          // Line width
          for (var i = 0; i < chart.data.datasets.length; i++){
            chart.data.datasets[i].borderWidth = GlobalSettings.global.lineThickness;
            chart.data.datasets[i].pointRadius = GlobalSettings.global.pointRadius;
          }

          // Compute the sample rate
          var sampleRate = SerialDataObject.sampleRate;
          if(GlobalSettings.spectrum.useFixedSampleRate){
            sampleRate = GlobalSettings.spectrum.sampleRate;
          }
          else{
            GlobalSettings.spectrum.sampleRate = sampleRate;
          }

          // Update with data from the serial port
          var magMax = 0;
          var magMin = 0;
          for(var k = 0; k < nvars; k++){
            var s = createSpectrum(SerialDataObject.dataIdx,SerialDataObject.data,k,sampleRate);   
            if(k===0){
              magMax = Math.max(...s.mag);
              magMin = Math.min(...s.mag);
            }
            else{
              magMax = Math.max(magMax,Math.max(...s.mag));
              magMin = Math.min(magMin,Math.min(...s.mag));
            }
            chart.data.datasets[k].data = reformatDataVec(s.freq,s.mag);
          }

          autoResizeSpectrum(magMin,magMax);
        
          // Pull the chart data range
          var xMax = Math.round(chart.data.datasets[0].data[chart.data.datasets[0].data.length-1].x);      
        }
 
        // Update options
        var newOps = defaultChartOptions;
        if(xMax !== undefined && GlobalSettings.spectrum.autoScaleH){
          newOps.scales.x.min = 0;
          newOps.scales.x.max = xMax;
          GlobalSettings.spectrum.fmin = 0;
          GlobalSettings.spectrum.fmax = xMax;
        }
        else{
          newOps.scales.x.min = GlobalSettings.spectrum.fmin;
          newOps.scales.x.max = GlobalSettings.spectrum.fmax;
        }
        newOps.scales.y.min = Math.pow(10,(GlobalSettings.spectrum.pmin)).toPrecision(2);
        newOps.scales.y.max = Math.pow(10,(GlobalSettings.spectrum.pmax)).toPrecision(2);
        newOps.scales.y.ticks.min = Math.round(Math.pow(10,(GlobalSettings.spectrum.pmin)));
        newOps.scales.y.ticks.max = Math.round(Math.pow(10,(GlobalSettings.spectrum.pmax)));

        if(!GlobalSettings.spectrum.logScale){
          newOps.scales.y.min = Math.round(Math.pow(10,(GlobalSettings.spectrum.pmin)));
          newOps.scales.y.max = Math.round(Math.pow(10,(GlobalSettings.spectrum.pmax)));
          newOps.scales.y.type = "linear";
        }
        else{
          
          newOps.scales.y.type = "logarithmic";
        }

        this.labelRef.current.innerHTML = "f&nbsp;(Hz)"
        newOps.plugins.title.text=SerialDataObject.port.friendlyName;
        chart.options = newOps;

        if( typeof chart.data.datasets[0] === 'undefined'){
          this.labelRef.current.innerHTML = "";
        }

        // Need to set the height by hand
        // (Flex doesn't work well for this)
        // To do so, update the size of the containing div
        // (ref: https://www.chartjs.org/docs/2.7.2/general/responsive.html#important-note)
        var parentHeight = this.divRef.current.parentElement.clientHeight;
        this.divRef.current.style.height = SerialDataObject.chartHeightRatio*parentHeight + 'px';
        this.divRef.current.style.marginTop =  SerialDataObject.chartMarginRatio*parentHeight + 'px';

        // Call the update
        chart.update();
      }
    }
  }

  timer = null;
  componentDidMount(){
    // This will refresh the chart as often as indiciated
    // in the variable refreshRate
    this.timer = setInterval(() => {
      this.updateChart();
    }, refreshRate); 
  }

  componentWillUnmount(){
    clearInterval(this.timer);
  }

  // Render the chart component (this only updates when the chart is created)
  render(){
    return(
      <div style={divStyle} ref={this.divRef}>
         <Line data={data} options={defaultChartOptions} ref={this.chartRef}/>
         <div style={{marginLeft:"-64px", verticalAlign: "bottom",
              bottom:"0px",width:"0px",fontSize:"12px",marginBottom:"20px",
              color:plotFontColor,
              display: "inline-block",
              alignSelf: "flex-end",
              fontFamily:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"}}
              ref={this.labelRef}
              >
          </div>
     </div>
    )
  }
}
