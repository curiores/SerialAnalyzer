import { GlobalSettings } from "./GlobalSettings.js";
import { ToastContainer, toast } from 'react-toastify';
import { writeDataIfRecording } from "./DataRecording.js";

const { SerialPort } = window.require("serialport");
const { ReadlineParser } = window.require('@serialport/parser-readline')
const { performance } = window.require('perf_hooks');

/* Functions to handle the serial port communication.
   Uses node "serialport". 
   
   TODO: right now, there's no way to let the user know
   if the connection failed or if the baud rate is wrong.
   There may not be a solution for the baud rate, but
   at least a error notification if the connection fails
   would be helpful.

   TODO: there isn't any way to detect when a new
   serial device is connected, or automatically reconnect
   to a disconnected/reconnected device. There might be a way
   to add this type of functionality.
*/
export var SerialDataObject = {
    port: { path: null, friendlyName: "None" }, // The port name
    baudRate: 9600,
    bufferSize: 500,
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

export function StartSerial(port) {

    // Clear the data when the serial first starts
    SerialDataObject.rawData = [];
    SerialDataObject.data = [];
    SerialDataObject.dataIndex = [];
    SerialDataObject.pauseFlag = false;
    SerialDataObject.Iter = 0;
    SerialDataObject.sampleHistory = [];
    SerialDataObject.timeHistory = [];

    // Always try to close the serial object before starting one
    if (SerialDataObject.serialObj !== null) {
        // Close the serial port
        SerialDataObject.serialObj.close((err) => {
            console.log("Stop serial port? Error:" + err)
            serialSetup(port);
        });
    } else {
        serialSetup(port);
    }
}

export const GetPortName = (port) => {
    // On linux the friendly name does not exist, so we need to make a name
    if(typeof(port.friendlyName) === "undefined" || port.friendlyName ===""){
        let portName = "";
        if(typeof(port.path) !== "undefined"){
        portName += port.path;
        }
        if(typeof( port.pnpId) !== "undefined"){
        portName += " | " + port.pnpId;
        }
        return portName;
    }
    else{
        // If the friendly name exists, use it
        return port.friendlyName;
    }
}


export const GetPortShortName = (port) => {
    if(typeof(port) == "undefined"){
        return "";
    }
    // On linux the friendly name does not exist, so we need to make a name
    if(typeof(port.friendlyName) === "undefined" || port.friendlyName ===""){
        let portName = "";
        if(typeof(port.path) !== "undefined"){
        portName += port.path;
        }
        return portName;
    }
    else{
        // If the friendly name exists, use it
        return port.friendlyName;
    }
}


      
var decIndex = 1; // Determines which data points to keep
function serialSetup(port) {
    // Notify the user that the serial port is being started
    let toastId = toast("Starting Serial on " + GetPortShortName(port)
            + " with baud rate: " + SerialDataObject.baudRate);


    // Set the global port object 
    SerialDataObject.port = port;
      
    // Starts the serial port
    SerialDataObject.serialObj = new SerialPort({
        path: port.path,
        baudRate: SerialDataObject.baudRate,
        autoOpen:true,
    },(err)=>{
        if(err){
            toast.dismiss(toastId);
            toast.error("Error starting serial port on " + GetPortShortName(port) + "\n\n" + err);    
            console.log(err);
        }
        else{
            console.log("Successful connection");
        }
    }
    );


    // Parser    
    const parser = SerialDataObject.serialObj.pipe(new ReadlineParser({ delimiter: '\r\n' }))
    // Run the parser to collect data
    var onVal = parser.on('data', addData)

    function addData(data) {
        // If there is decimation, don't add the data until the decimation index is reached
        if (decIndex >= GlobalSettings.global.decimation) {
            decIndex = 1;
        } else {
            decIndex += 1;
            return; // Dont add the data if the user is decimating
        }
        //--------------------- regular update --------------------- //
        SerialDataObject.Iter += 1;// Iterate 
        // Computations for the sample rate (only do this once every NsampleRateUpdate samples)
        if (SerialDataObject.Iter % SerialDataObject.NsampleRateUpdate === 0) {
            if (SerialDataObject.sampleHistory.length > 1) {
                var deltaT = SerialDataObject.timeHistory[SerialDataObject.timeHistory.length - 1] - SerialDataObject.timeHistory[0];
                var samples = SerialDataObject.sampleHistory[SerialDataObject.sampleHistory.length - 1] - SerialDataObject.sampleHistory[0];

                SerialDataObject.sampleRate = samples / deltaT * 1000;
            }
        }

        // Push the raw data (unless its NaN)
        SerialDataObject.rawData.push(data);
        if (SerialDataObject.rawData.length >= SerialDataObject.bufferSize) {
            // If the buffer is full, remove the first line of the raw data
            SerialDataObject.rawData.shift();
        }

        // If we're recording, write each data row to the file
        writeDataIfRecording(data);
        
        // Now parse the numeric data
        var splitData = data.split(/\s+|,\s+/);
        var nums = splitData.map(parseFloat);
        var t = 0;
        if (GlobalSettings.global.firstColumnTime) {
            t = nums[0];
            nums = nums.slice(1, nums.length);
        }
        else {
            t = performance.now();
        }

        // Push the data into the data array (if there arent any NaNs)
        // also push the sample/time history
        if (nums.every((value) => { return !isNaN(value) })) {
            SerialDataObject.data.push(nums);
            SerialDataObject.sampleHistory.push(SerialDataObject.Iter);
            SerialDataObject.timeHistory.push(t);
        }

        var n = SerialDataObject.data.length;
        if (n > SerialDataObject.bufferSize) {
            // If the data has filled the buffer, resize it
            const resize = (v) => {
                return v.slice(v.length - SerialDataObject.bufferSize, v.length);
            }
            SerialDataObject.data = resize(SerialDataObject.data);
            SerialDataObject.sampleHistory = resize(SerialDataObject.sampleHistory);
            SerialDataObject.timeHistory = resize(SerialDataObject.timeHistory);
            if (!GlobalSettings.timeSeries.scroll) {
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

function idxData(n) {
    // Makes a vector of data starting at 0 and going up to n-1
    // to create x-data for n points
    var idxVec = [];
    for (var i = 0; i < n; i++) {
        idxVec.push(i);
    }
    return (idxVec);
}

