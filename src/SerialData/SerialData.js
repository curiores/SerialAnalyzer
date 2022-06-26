
const { SerialPort } = window.require("serialport");
const { ReadlineParser } = window.require('@serialport/parser-readline')


export var SerialDataObject = {
    port:{path:null, friendlyName:"None"}, // The port name
    baudRate: 9600,
    bufferSize: 1000,
    data: [],
    dataIdx: [],
    serialObj: null,
    chartHeightRatio: 1
}

export function SetSerialDefaults(){
    SerialDataObject.data = [];
    SerialDataObject.dataIndex = [];
    SerialDataObject.serialObj = null;
    SerialDataObject.port = {path:null, friendlyName:"None"};
}

export function StartSerial(){
    if(SerialDataObject.serialObj === null){
        // Starts the serial port
        // only start if the serial port isn't already started.
        // using the current port stored in "SerialDataObject"
        
        // Create a port
        SerialDataObject.serialObj = new SerialPort({path: SerialDataObject.port.path, 
                                        baudRate:SerialDataObject.baudRate});
        // Parser    
        const parser = SerialDataObject.serialObj.pipe(new ReadlineParser({ delimiter: '\r\n' }))
        
        // Run the parser to collect data
        var onVal = parser.on('data',addData)

        function addData(data){
            var splitData = data.split(/\s+|,\s+/);
            var nums = splitData.map(parseFloat);
    
            // Push the data into the data array
            SerialDataObject.data.push(nums);
        
            var n = SerialDataObject.data.length;
            if( n < SerialDataObject.bufferSize){
                // If necessary, add to the index data
                SerialDataObject.dataIdx = idxData(n);
            }
            else{
                // If the data has filled the buffer, 
                // remove the first point
                SerialDataObject.data.shift();
            }        
        }
    }
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
