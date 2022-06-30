import * as React from 'react';
import Stack from '@mui/material/Stack';
import MuiIconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { styled } from "@mui/material/styles";

import { SerialDataObject, StartSerial } from '../Utils/SerialData';

const IconButton = styled(MuiIconButton)({
    "&":{
        opacity: '0.8 !important',
        color: "white !important",
        transition: 'opacity  0.2s',
    },
    "&:hover": {
        opacity: '1 !important'
    },
    "&:disabled": {
        opacity: '0.2 !important'
      }
  });


export default function SerialPause() {

    const [paused,setPaused] = React.useState(true); 
    const [stopped,setStopped] = React.useState(true); 
    const [running,setRunning] = React.useState(true); 

    function pauseCallback(){
        SerialDataObject.pauseFlag = true; // Global flag for the charts/monitor
        setPaused(true);
        setRunning(false);
        setStopped(false);
    }

    function playCallback(){
        
        if(SerialDataObject.serialObj !== null ){
            // If the object is already open and paused, play it
            if(SerialDataObject.serialObj.isOpen && SerialDataObject.pauseFlag === true){
                // In this case, only the pause flag needs to be updated
            }
            else{
                // Otherwise, restart the serial port
                StartSerial();    
            }
        }
        else{
            // Otherwise, restart the serial port
            StartSerial();    
        }
        SerialDataObject.pauseFlag = false;
        setRunning(true);
        setStopped(false);
        setPaused(false);

    }

    function stopCallback(){
        if(SerialDataObject.serialObj !== null){
            // Close the serial port
            SerialDataObject.serialObj.close((err) => {
                console.log("Stop?" + err)
            });
        }
        setStopped(true);
        setPaused(false);
        setRunning(false);
    }

    // Hacky workaround to get the intial state to sync when the serial port is selected
    var timer = null;
    React.useEffect(() => {
        timer = setInterval(() => {
            if(SerialDataObject.serialObj !== null ){
                // If the object is already open not paused, then allow the pause and stop buttons
                if(SerialDataObject.serialObj.isOpen && SerialDataObject.pauseFlag !== true){
                    setStopped(false);
                    setPaused(false);
                    setRunning(true);
                }
            }
        }, 1000); 
        return () => {
            clearInterval(timer);
        }
    }, [])

 


    return (
      <Stack direction="row" alignItems="center" spacing={0}>

        <IconButton  disabled={paused || stopped}  aria-label="delete" size="medium" onClick={pauseCallback}>
          <PauseCircleIcon fontSize="medium" />
        </IconButton>
        <IconButton  disabled={running} aria-label="delete" size="medium" onClick={playCallback}>
          <PlayCircleIcon fontSize="inherit" />
        </IconButton>
        <IconButton disabled={stopped} aria-label="delete" size="medium" onClick={stopCallback}>
          <StopCircleIcon fontSize="inherit" />
        </IconButton>

      </Stack>
    );
  }
