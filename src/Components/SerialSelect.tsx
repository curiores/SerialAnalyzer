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
import { SerialDataObject, StartSerial } from '../SerialData/SerialData';

const { SerialPort } = window.require("serialport");

var portsDefault: any = [{path:"None"}];
var ports: any = portsDefault;

export interface SerialDialogProps {
  open: boolean;
  selectedPort: any;
  onClose: (value: string) => void;
}

function SimpleDialog(props: SerialDialogProps) {
  const { onClose, selectedPort, open } = props;

  const handleClose = () => {
    onClose(selectedPort);
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
  const [selectedPort, setSelectedPort] = React.useState({path:"None",friendlyName:"none"}); 

  const handleClickOpen = () => {
    showSerialPorts().then( (result) => {
      setOpen(true);
    });
  };

  const handleClose = (port: any) => {
    setOpen(false);
    setSelectedPort(port);
    SerialDataObject.port = port; // Set the global port
    StartSerial();
  };

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        Set Serial Port
      </Button>
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
