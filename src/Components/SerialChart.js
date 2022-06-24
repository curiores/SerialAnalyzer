import React from 'react';
import { Line } from 'react-chartjs-2';
import { SerialDataObject } from '../SerialData/SerialData';
import Button from '@mui/material/Button';

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
  

const divStyle = {
  height: '60vh',
  width: '80%'
};

var n = 1000;
var tmax = 10;
var mag0 = 1;
function sinData(n,tmax,mag){
  var vec = [];
  for (var i = 0; i < n; i++){
    vec.push(mag*Math.sin(2.0*Math.PI*i*tmax/n));
  }
  return vec;
}

function tData(n,tmax){
  var tvec = [];
  for (var i = 0; i < n; i++){
    tvec.push(i*tmax/n);
  }
  return tvec;
}

function createData(xvec,yvec){
  // yvec should be the same length as xvec
  var data = [];
  for(var k = 0; k < xvec.length; k++){
    data.push({x:xvec[k],y:yvec[k]})
  }
  return data;
}
var tlabels = tData(5,tmax);
var sdata = createData(tData(n,tmax),sinData(n,tmax,mag0));
var sdata2 = createData(tData(n,tmax/2),sinData(n,tmax,mag0));
console.log(sdata)
console.log(sdata2)

var data = {
  labels: tlabels,
  datasets: [
    {
      label: 'Dataset 1',
      data: sdata,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
      borderWidth: 1.5,
    },
    {
      label: 'Dataset 2',
      data: sdata2,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
      borderWidth: 1.5,
    },
  ],
};

  

var defaultChartOptions = {
  animation: false,
  responsive: true,
  maintainAspectRatio: false,
  tension: 0.01,
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
        radius: 0.0
    }
  },
  scales:{
      x: {
          type: 'linear',
          min: 0,
          max: tmax
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
    if(this.chartRef !== null){
      
      // Update data
      var mag = Math.random();
      var tempData = createData(tData(n,tmax*Math.random()),sinData(n,tmax,mag));
      var chart = this.chartRef.current;
        chart.data.datasets.forEach((dataset) => {
          dataset.data.pop();
      });
      chart.data.datasets[0].data = tempData;

      // Update options
      var newOps = defaultChartOptions;
      newOps.plugins.title.text="mag: " + String(mag);
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
      
    }, 500); 
  }
  
  buttonClick = () => {}

  render(){
    return(
      <div style={divStyle}>
          <Button variant="outlined" onClick={this.buttonClick}> Update plot {this.state.seconds}
          </Button>
          <Line data={data} options={this.chartOptions} ref={this.chartRef}/>
      </div>
    )
  }
}
