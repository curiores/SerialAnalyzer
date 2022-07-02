
import { GlobalSettings } from "./GlobalSettings.js";

const { SerialPort } = window.require("serialport");
const { ReadlineParser } = window.require('@serialport/parser-readline')
const { performance } = window.require('perf_hooks');


export var SerialDataObject = {
    port:{path:null, friendlyName:"None"}, // The port name
    baudRate: 9600,
    bufferSize: 500,
    monitorBuffer: 100,
    pauseFlag: false, // when this is true, the data continues to stream, but plots do not update
    data: [],
    rawData: [],
    dataIdx: [],
    serialObj: null,
    chartHeightRatio: 1,
    chartMarginRatio: 0.0,
    Iter: 0,
    sampleHistory: [],
    timeHistory: [],
    sampleRate: 0,
    NsampleRateUpdate: 10 // Update the sample rate after this many samples
}



export function StartSerial(){

    // Clear the data when the serial first starts
    SerialDataObject.rawData = [];
    SerialDataObject.data = [];
    SerialDataObject.dataIndex = [];
    SerialDataObject.pauseFlag = false;
    SerialDataObject.Iter = 0;
    SerialDataObject.sampleHistory = [];
    SerialDataObject.timeHistory = [];

    // Always try to close the serial object before starting one
    if(SerialDataObject.serialObj !== null){
        // Close the serial port
        SerialDataObject.serialObj.close((err) => {
            console.log("Stop?" + err)
            serialSetup();
        });
    }else{
        serialSetup();
    }
    
    
}

function serialSetup(){
    
    // Starts the serial port
    SerialDataObject.serialObj = new SerialPort({path: SerialDataObject.port.path, 
                                                baudRate:SerialDataObject.baudRate});
    // Parser    
    const parser = SerialDataObject.serialObj.pipe(new ReadlineParser({ delimiter: '\r\n' }))

    // Run the parser to collect data
    var onVal = parser.on('data',addData)

    function addData(data){

        SerialDataObject.Iter += 1;// Iterate 

        // Computations for the sample rate (only do this once every NsampleRateUpdate samples)
        if(SerialDataObject.Iter % SerialDataObject.NsampleRateUpdate === 0)
        {
            if(SerialDataObject.sampleHistory.length > 1){
                var deltaT = SerialDataObject.timeHistory[SerialDataObject.timeHistory.length-1] - SerialDataObject.timeHistory[0];
                var samples = SerialDataObject.sampleHistory[SerialDataObject.sampleHistory.length-1] - SerialDataObject.sampleHistory[0];
            
                SerialDataObject.sampleRate = samples/deltaT*1000; 
            }
        }
        
        // Push the raw data (unless its NaN)
        SerialDataObject.rawData.push(data);
        if( SerialDataObject.rawData.length >= SerialDataObject.monitorBuffer){
        // If the buffer is full, remove the first line of the raw data
        SerialDataObject.rawData.shift();
        }

        // Now parse the numeric data
        var splitData = data.split(/\s+|,\s+/);
        var nums = splitData.map(parseFloat);

        // Push the data into the data array (if there arent any NaNs)
        // also push the sample/time history
        if( nums.every( (value) => { return !isNaN(value) }) ){
            SerialDataObject.data.push(nums);
            SerialDataObject.sampleHistory.push(SerialDataObject.Iter);
            SerialDataObject.timeHistory.push(performance.now()); 
        }


        var n = SerialDataObject.data.length;
        if( n > SerialDataObject.bufferSize){
            // If the data has filled the buffer, resize it
            const resize = (v) =>{
                return v.slice(v.length-SerialDataObject.bufferSize,v.length);
            }
            SerialDataObject.data = resize(SerialDataObject.data);
            SerialDataObject.sampleHistory = resize(SerialDataObject.sampleHistory);
            SerialDataObject.timeHistory = resize(SerialDataObject.timeHistory);
            if(!GlobalSettings.timeSeries.scroll){
                SerialDataObject.data = [];
                SerialDataObject.sampleHistory = [];
                SerialDataObject.timeHistory = [];
            }
        }        
        // Create the index data of the correct size
        var n = SerialDataObject.data.length;
        SerialDataObject.dataIdx = idxData(n);
   
    }

}




// Sample rate computations

function computeSampleRate(){
  var sampleRate = 0; // Samples per second

  console.log(performance.now())
  

  return sampleRate;
}


function idxData(n){
    // Makes a vector of data starting at 0 and going up to n-1
    // to create x-data for n points
    var idxVec = [];
    for(var i = 0; i < n; i++){
      idxVec.push(i);
    }
    return(idxVec);
  }
