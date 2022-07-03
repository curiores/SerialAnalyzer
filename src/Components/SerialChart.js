import React from 'react';
import { Line } from 'react-chartjs-2';

import { SerialDataObject } from '../Utils/SerialData';
import { colorList } from '../Resources/colorList.js';
import { reformatData, autoResize } from '../Utils/DataUtils.js';
import { GlobalSettings } from '../Utils/GlobalSettings.js';

import {
  Chart as ChartJS, CategoryScale, LinearScale,
  PointElement, LineElement, Title, Tooltip, Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend
);

const refreshRate = GlobalSettings.timeSeries.refreshRate; // In ms
const padChars = GlobalSettings.style.plotPadChars; // How many characters to pad with
const gridColor = GlobalSettings.style.gridColor;
const plotFontColor = GlobalSettings.style.plotFontColor;
const axisColor = GlobalSettings.style.axisColor;

const divStyle = {
  width: '95%',
  margin: 'auto',
  position: 'relative',
  display: 'flex',
};

var data = {
  labels: [],
  datasets: [],
};

// The default chart options are modified as 
// dictated by the user settings
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
    point: {
      radius: 0
    }
  },
  scales: {
    x: {
      type: 'linear',
      min: 0,
      max: 1,
      grid: {
        color: gridColor,
        borderColor: axisColor
      },
      ticks: {
        color: plotFontColor
      },
      title: {
        display: false,
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
      ticks: {
        color: plotFontColor,
        callback: (val) => (val.toString().padStart(padChars - val.toString().length, " "))
      }
    }
  }
};

/* Creates and updates the serial plot.
   Uses chartjs to create the chart.
   The chart is updated using references every refreshRate milliseconds. 
*/
export default class SerialChart extends React.Component {

  constructor(props) {
    super(props)
    // This chart reference is needed to update the charts
    this.divRef = React.createRef();
    this.chartRef = React.createRef();
    this.labelRef = React.createRef();
  };

  updateChart() {
    // Only update the chart if the chart object exists
    if (this.chartRef !== null) {

      // Get the reference to the chart object
      var chart = this.chartRef.current;
      if (chart !== null) {

        if (SerialDataObject.data.length !== 0 && !SerialDataObject.pauseFlag) {
          // Get the size of the data
          var nel = SerialDataObject.data.length;
          var nvars = SerialDataObject.data[nel - 1].length;

          // Check if there are enough chart data objects
          var k = chart.data.datasets.length;
          while (chart.data.datasets.length < nvars) {
            // Add a new dataset if its too short
            chart.data.datasets.push(
              {
                label: k + 1,
                color: plotFontColor,
                data: [],
                borderColor: colorList[k % colorList.length],
                backgroundColor: colorList[k % colorList.length],
                borderWidth: GlobalSettings.global.lineThickness,
              },
            )
            k = k + 1;
          }
          while (chart.data.datasets.length > nvars) {
            // If there are too many, remove the last one.
            chart.data.datasets.pop();
          }

          // Line width
          for (var i = 0; i < chart.data.datasets.length; i++) {
            chart.data.datasets[i].borderWidth = GlobalSettings.global.lineThickness;
            chart.data.datasets[i].pointRadius = GlobalSettings.global.pointRadius;
          }

          // Update with data from the serial port
          var tnow = SerialDataObject.timeHistory[SerialDataObject.timeHistory.length - 1];
          var tvec = (SerialDataObject.timeHistory.map((x) => { return 1.0e-3 * (x - tnow) }));

          var step = 1;
          for (var k = 0; k < nvars; k++) {
            if (GlobalSettings.timeSeries.estimateTime) {

              chart.data.datasets[k].data = reformatData(tvec, SerialDataObject.data, k, step);
            }
            else {
              chart.data.datasets[k].data = reformatData(SerialDataObject.dataIdx, SerialDataObject.data, k, step);
            }
          }
        }

        // If the settings include automatic resizing, perform that here
        autoResize();

        // Update options
        var newOps = defaultChartOptions;

        if (GlobalSettings.timeSeries.estimateTime) {
          var nt = SerialDataObject.timeHistory.length;
          var tnow = SerialDataObject.timeHistory[nt - 1];
          var t0 = SerialDataObject.timeHistory[0];
          newOps.scales.x.min = 1.0e-3 * (t0 - tnow) * SerialDataObject.bufferSize / nt;
          newOps.scales.x.max = 0;
          this.labelRef.current.innerHTML = "t&nbsp;(s)"
          // newOps.scales.x.title = { text:"t (sec)", display:true, align:"end", padding:0};
        }
        else {
          newOps.scales.x.min = 0.0;
          newOps.scales.x.max = SerialDataObject.bufferSize;
          this.labelRef.current.innerHTML = "&nbsp;n"
        }
        newOps.scales.y.max = GlobalSettings.timeSeries.ymax;
        newOps.scales.y.min = GlobalSettings.timeSeries.ymin;
        newOps.plugins.title.text = SerialDataObject.port.friendlyName;

        chart.options = newOps;

        if (typeof chart.data.datasets[0] === 'undefined') {
          this.labelRef.current.innerHTML = "";
        }

        // Need to set the height by hand
        // (Flex doesn't work well for this)
        // To do so, update the size of the containing div
        // (ref: https://www.chartjs.org/docs/2.7.2/general/responsive.html#important-note)
        var parentHeight = this.divRef.current.parentElement.clientHeight;
        this.divRef.current.style.height = SerialDataObject.chartHeightRatio * parentHeight + 'px';

        // Call the update
        chart.update();
      }
    }
  }

  timer = null;
  componentDidMount() {
    // This will refresh the chart as often as indiciated
    // in the variable refreshRate
    this.timer = setInterval(() => {
      this.updateChart();
    }, refreshRate);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // Render the chart component (this only updates when the chart is created)
  render() {
    return (
      <div style={divStyle} ref={this.divRef}>
        <Line data={data} options={defaultChartOptions} ref={this.chartRef}>
        </Line>
        <div style={{
            marginLeft: "-64px", verticalAlign: "bottom",
            bottom: "0px", width: "0px", fontSize: "12px", marginBottom: "20px",
            color: plotFontColor,
            display: "inline-block",
            alignSelf: "flex-end",
            fontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
          }}
          ref={this.labelRef}
        >
          n
        </div>
      </div>
    )
  }
}