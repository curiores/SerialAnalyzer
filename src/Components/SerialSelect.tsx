import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import CableIcon from '@mui/icons-material/Cable';
import Typography from '@mui/material/Typography';
import { indigo } from '@mui/material/colors';
import { SerialDataObject, StartSerial, StopSerial } from '../SerialData/SerialData';

const { SerialPort } = window.require("serialport");

var portsDefault: any = [{path:"None"}];
var ports: any = portsDefault;

export interface SerialDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SerialDialogProps) {
  const { onClose, open } = props;

  const handleClose = () => {
    onClose("none");
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select a port</DialogTitle>
      <List sx={{ pt: 0 }}>
        {ports.map((port) => (
          <ListItem button onClick={() => handleListItemClick(port)} key={port.path}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: indigo[100], color: indigo[600] }}>
                <CableIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={port.friendlyName} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

export function SerialPortsList() {

  const [open, setOpen] = React.useState(false);
  const [serialOn, setSerialOn] = React.useState(false);
  const [selectedPort, setSelectedPort] = React.useState({path:null,friendlyName:"none"}); 

  const handleClickOpen = () => {
    showSerialPorts().then( (result) => {
      setOpen(true);
    });
  };

  const stopSerialCallback = () =>{
    StopSerial();
    setSerialOn(false);
    var startStopButton = null;
  }

  const handleClose = (port: any) => {
    if(port !== "none"){
      SerialDataObject.port = port; // Set the global port
      StartSerial(); // Start up the serial port

      
      setSerialOn(true);
      setSelectedPort(port);
    }
    // Always close the window
    setOpen(false);
  };


  var startStopButton = null;
  var setSerialButton = null;
  if( serialOn ){
    startStopButton = <StopSerialButton stopSerialCallback={stopSerialCallback} />
  }
  else{
    setSerialButton = <SetSerialButton handleClickOpen={handleClickOpen} />
  }

  return (
    <div>
      {setSerialButton}
      {startStopButton}
      <Typography variant="subtitle1" component="div">
        Current: {selectedPort.friendlyName}
      </Typography>
      <SimpleDialog
        selectedPort={selectedPort}
        open={open}
        onClose={handleClose}
      />
    </div>
  );

}

function SetSerialButton({handleClickOpen}){
  return(
    <Button variant="outlined" onClick={handleClickOpen}>
      Set Serial Port
    </Button>
  )
}

function StopSerialButton({stopSerialCallback}) {
  return (
    <Button variant="outlined" onClick={stopSerialCallback}>
      Stop Serial
    </Button>
  );
}


function showSerialPorts(){
  return SerialPort.list().then((portsLocal: any, err: any) => {
    if(err) {
      ports = [{path:"Error."}];
    } else {
      if (portsLocal.length === 0) {
        ports = portsLocal;
      }
      else{
        ports = portsLocal;
      }
    }  
    
    return ports;
  })
}
