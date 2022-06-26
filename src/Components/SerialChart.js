import React from 'react';
import { Line } from 'react-chartjs-2';
import { SerialDataObject } from '../SerialData/SerialData';

import { colorList } from '../Resources/colorList.js';
import { reformatData } from '../Utils/DataUtils.js';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
  
var refreshRate = 32; // In ms
var padChars = 10; // How many characters to pad with

var gridColor = 'rgba(100,100,100,0.3)';
var plotFontColor = 'rgb(180,180,180)';
var axisColor = 'rgb(180,180,180)';

const divStyle = {
  width: '95%',
  margin: 'auto',
  position: 'relative'
};

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
        min: -3,
        max: 3,
        grid: {
          color: gridColor,
          borderColor: axisColor
        },
        ticks:{
          color: plotFontColor,
          callback: (val) => ( val.toString().padStart( padChars - val.toString().length, " ") )
        }
    }
  }
};

export default class SerialChart extends React.Component{
     
  constructor(props){
    super(props)
    // This chart reference is needed to update the charts
    this.divRef = React.createRef(); 
    this.chartRef = React.createRef(); 
  };


  updateChart(){

    if(this.chartRef !== null ){

      // Get the reference to the chart object
      var chart = this.chartRef.current;

      if(chart !== null)
      {

        if(SerialDataObject.data.length !== 0 ){
          
          // Get the size of the data
          var nel = SerialDataObject.data.length;
          var nvars = SerialDataObject.data[nel-1].length;

          // Check if there are enough chart data objects
          var k = chart.data.datasets.length;
          while(chart.data.datasets.length < nvars ){
            // Add a new dataset if its too short
            chart.data.datasets.push(
              {
                label: k+1,
                color: plotFontColor,
                data: [],
                borderColor: colorList[k % colorList.length],
                backgroundColor: colorList[k % colorList.length],
                borderWidth: 2,
              },
            )
            k = k + 1;
          }
          while(chart.data.datasets.length > nvars ){
            // If there are too many, remove the last one.
            chart.data.datasets.pop();
          }

          // Update with data from the serial port
          for(var k = 0; k < nvars; k++){
            chart.data.datasets[k].data = reformatData(SerialDataObject.dataIdx,SerialDataObject.data,k);   
          }
        }

        // Update options
        var newOps = defaultChartOptions;
        newOps.scales.x.max = SerialDataObject.bufferSize;
        newOps.plugins.title.text=SerialDataObject.port.friendlyName;

        chart.options = newOps;
  
        // Need to set the height by hand
        // (Flex doesn't work well for this)
        // To do so, update the size of the containing div
        // (ref: https://www.chartjs.org/docs/2.7.2/general/responsive.html#important-note)
        var parentHeight = this.divRef.current.parentElement.clientHeight;
        this.divRef.current.style.height =  SerialDataObject.chartHeightRatio*parentHeight + 'px';

        // Call the update
        chart.update();
      }
    }
  }

  componentDidMount(){
    // This will refresh the chart as often as indiciated
    // in the variable refreshRate
    setInterval(() => {
      this.updateChart();
    }, refreshRate); 
  }

  // Render the chart component (this only updates when the chart is created)
  render(){
    return(
      <div style={divStyle} ref={this.divRef}>
          <Line data={data} options={defaultChartOptions} ref={this.chartRef}/>
      </div>
    )
  }
}
