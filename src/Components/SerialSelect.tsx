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
import { SerialDataObject, StartSerial, SerialStopped } from '../Utils/SerialData';

const { SerialPort } = window.require("serialport");

const titleFs = "0.9rem";
var portsDefault: any = [{path:"None"}];
var ports: any = portsDefault;

export interface SerialDialogProps {
  open: boolean;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SerialDialogProps) {
  // This dialog creates clickable items for each port
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

const selectStyles = {
  marginTop: '8px',
  marginBottom: '8px'
};


export function SerialPortsList() {
  // This component includes the button that allows you to select the port
  // It also renders the dialog when the state "open" is true
  
  // Is the dialog open?
  const [open, setOpen] = React.useState(false); 

  // Is the serial port running currently?
  const [serialOn, setSerialOn] = React.useState(false);

  // 

  // 
  //const [selectedPort, setSelectedPort] = React.useState({path:null,friendlyName:"none"}); 

  const handleClickOpen = () => {
    // Looks for serial ports, returns a promise
    showSerialPorts().then( (result) => {
      // When the promise returns, open the dialog
      setOpen(true);
    });
  };


  // This is the main function that runs when the dialog closes
  const handleClose = (port: any) => {
    if(port !== "none"){
      
      // If serial is already open, close it
      if(SerialDataObject.serialObj !== null){
        setSerialOn(false);
        if(SerialDataObject.serialObj.isOpen){
          // Close the serial port
          SerialDataObject.serialObj.close((err) => {
            SerialDataObject.port = port; // Set the global port
            StartSerial(); // Start up the serial port     
            setSerialOn(true);
          });
        }
        else{
          SerialDataObject.port = port; // Set the global port
          StartSerial(); // Start up the serial port     
        }
      }
      else{
        SerialDataObject.port = port; // Set the global port
        StartSerial(); // Start up the serial port    
      }
    }
    // Always close the window
    setOpen(false);
  };


  return (
    <div style={selectStyles}>
      <SetSerialButton handleClickOpen={handleClickOpen} />
      <Typography variant="subtitle1" component="div" style={{fontSize:titleFs}}>
        Current: {SerialDataObject.port.friendlyName}
      </Typography>
      <SimpleDialog
        open={open}
        onClose={handleClose}
      />
    </div>
  );

}

function SetSerialButton({handleClickOpen}){
  return(
    <Button variant="outlined" onClick={handleClickOpen} size="medium">
      Select Serial Port
    </Button>
  )
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
