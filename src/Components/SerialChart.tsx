import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { SerialDataObject } from '../SerialData/SerialData';
import Button from '@mui/material/Button';

import faker from 'faker';
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


var defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
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
};

const labels = [0,1,2,3,4,5,6,7,8,9,10];

var data = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

  
export default function SerialChart() {
  const [open, setOpen] = useState(false);
  const [sw, setSwitch] = useState(false);
  const [chartOptions, setChartOptions] = useState(false);

  const buttonClick = () => {
      
      var options = defaultChartOptions;
      options.plugins.title.text = SerialDataObject.port.friendlyName;

      setChartOptions(options);
      console.log(sw)
      setSwitch(!sw);
      console.log(sw)

      console.log(chartOptions)
      setOpen(true)
  }
  
  if(open && sw){
    return (
        <div style={divStyle}>
          <Button variant="outlined" onClick={buttonClick}> Update plot
          </Button>
          <Line data={data} options={chartOptions} />
        </div>
    );
  }
  else{
    return (
      <div style={divStyle}>
        <Button variant="outlined" onClick={buttonClick}> Update plot
        </Button>
      </div>
  );
  }

}
