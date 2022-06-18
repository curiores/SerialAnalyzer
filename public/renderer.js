// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const { SerialPort } = require('serialport')
const tableify = require('tableify')
const { DelimiterParser } = require('@serialport/parser-delimiter')

async function listSerialPorts() {
  await SerialPort.list().then((ports, err) => {
    if(err) {
      document.getElementById('error').textContent = err.message
      return
    } else {
      document.getElementById('error').textContent = ''
    }
    console.log('ports', ports);

    if (ports.length === 0) {
      document.getElementById('error').textContent = 'No ports discovered'
    }

    tableHTML = tableify(ports)
    document.getElementById('ports').innerHTML = tableHTML

    // Create a port
    portPath = ports[0].path;
    baudRate = 9600;
    const port = new SerialPort({path:portPath,baudRate:baudRate});
    const serialPipe = port.pipe(new DelimiterParser({ delimiter: '\n' }))
    serialPipe.on('data',addData); 

    function addData(data){
        document.getElementById("dataWindow").value += "\n" + data;
    }
 
  })
}

function listPorts() {
  listSerialPorts();
  setTimeout(listPorts, 2000);
}

// Set a timeout that will check for new serialPorts every 2 seconds.
// This timeout reschedules itself.
setTimeout(listPorts, 2000);

listSerialPorts()


