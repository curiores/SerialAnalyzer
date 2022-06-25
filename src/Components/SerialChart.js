import React from 'react';
import { Line } from 'react-chartjs-2';
import { SerialDataObject } from '../SerialData/SerialData';

import { colorList } from '../Resources/colorList.js';

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
  
var refreshRate = 16; // In ms

var gridColor = 'rgba(100,100,100,0.3)';
var plotFontColor = 'rgb(180,180,180)';
var axisColor = 'rgb(180,180,180)';

const divStyle = {
  width: '90%',
  height: '90%',
  margin: 'auto'
};

function createData(xvec,yarray,yindex){
  // This creates data arrays of the form [{x:100,y:23.44},{x:100,y:23.44},...]
  // From the serial data
  var data = [];
  for(var k = 0; k < xvec.length; k++){
    data.push({ x: xvec[k], 
                y: yarray[k][yindex]})
  }
  return data;
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
      position: 'top',
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
          color: plotFontColor
        }
    }
  }
};


export default class SerialChart extends React.Component{
     
  constructor(props){
    super(props)
    // This chart reference is needed to update the charts
    this.chartRef = React.createRef(); 
  };

  updateChart(){

    if(this.chartRef !== null && SerialDataObject.data.length !== 0){
      
      // Get the reference to the chart object
      var chart = this.chartRef.current;

      // Get the size of the data
      var nel = SerialDataObject.data.length;
      var nvars = SerialDataObject.data[nel-1].length;

      // Check if there are enough chart data objects
      var k = chart.data.datasets.length;
      while(chart.data.datasets.length < nvars ){
        // Add a new dataset if its too short
        chart.data.datasets.push(
          {
            label: 'Dataset ' + k ,
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
        chart.data.datasets[k].data = createData(SerialDataObject.dataIdx,SerialDataObject.data,k);   
      }

      // Update options
      var newOps = defaultChartOptions;
      newOps.scales.x.max = SerialDataObject.bufferSize;
      newOps.plugins.title.text=SerialDataObject.port.friendlyName;
      chart.options = newOps;

      // Call the update
      chart.update();
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
      <div style={divStyle}>
          <Line data={data} options={defaultChartOptions} ref={this.chartRef}/>
      </div>
    )
  }
}
