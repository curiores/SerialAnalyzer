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
  
var refreshRate = 10; // In ms

const divStyle = {
  height: '60vh',
  width: '80%'
};

function createData(xvec,yarray,yindex){
  // yvec should be the same length as xvec
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
      position: 'top'
    },
    title: {
      display: true,
      text: "Data",
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
      },
      y: {
        type: 'linear',
        min: -3,
        max: 3
    }
  }
};


export default class SerialChart extends React.Component{
     
  constructor(props){
    super(props)
    this.state = { seconds: 0};
    this.chartOptions = defaultChartOptions;
    this.chartRef = React.createRef(); 
  };

  updateChart(){

    if(this.chartRef !== null && SerialDataObject.data.length !== 0){
      // Get the size of the data
      var nel = SerialDataObject.data.length;
      var nvars = SerialDataObject.data[nel-1].length;

      // Check if there are enough chart data objects
      var chart = this.chartRef.current;
      k = chart.data.datasets.length;
      while(chart.data.datasets.length < nvars ){
        // Add a new dataset if its too short
        chart.data.datasets.push(
          {
            label: 'Dataset ' + k ,
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
      newOps.plugins.title.text="???";
      chart.options = newOps;

      // Call the update
      chart.update();
    }
  }

  componentDidMount(){

    setInterval(() => {
      
      this.setState(state => ({
        seconds: state.seconds + 1,
      }));

      this.updateChart();
      
    }, refreshRate); 
  }
  

  render(){
    return(
      <div style={divStyle}>
          <Line data={data} options={this.chartOptions} ref={this.chartRef}/>
      </div>
    )
  }
}
