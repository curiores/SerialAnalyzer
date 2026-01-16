import * as React from 'react';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MuiIconButton from '@mui/material/IconButton';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { styled } from "@mui/material/styles";
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import { selectOutputDirectory, setNextOutputFilename } from '../Utils/DataRecording.js'
import { toast } from 'react-toastify';

import { SerialDataObject, StartSerial, StartUDP, StopUDP } from '../Utils/SerialData';

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

const StyledDivider = styled(Divider)({
    background:GlobalSettings.style.playPauseTrayOutlineColor
})


const boxSx = {
    display: 'flex',
    alignItems: 'center',
    width: 'fit-content',
    '& hr': {
        mx: 0.5,
    },
};

/* Implements the pause/play/stop functionality.
   
   TODO: This is one of the less carefully constructed methods.
         Here are some potential improvements:
         * refactor the states to a single variable that makes more sense.
         * adjust the way this interacts with the serial select so that
           it doesn't use a timer but interacts directly with it
           (might need to convert this to a class and use references)
*/

export default function SerialPause() {

    const [paused,setPaused] = React.useState(true); 
    const [stopped,setStopped] = React.useState(true); 
    const [running,setRunning] = React.useState(true); 
    const [record,setRecord] = React.useState(GlobalSettings.record.recording);

    function pauseCallback(){
        SerialDataObject.pauseFlag = true; // Global flag for the charts/monitor
        setPaused(true);
        setRunning(false);
        setStopped(false);
    }

    function playCallback(){
        if(SerialDataObject.inputMode === 'udp'){
            // If UDP is already listening and paused, just unpause
            if(SerialDataObject.udpSocket && SerialDataObject.pauseFlag === true){
                // nothing to restart, will resume below
            } else {
                // Start UDP if not running; default to a valid port
                const portToUse = SerialDataObject.udpPort || 5000;
                StartUDP(portToUse);
            }
        } else {
            if(SerialDataObject.serialObj !== null ){
                // If the object is already open and paused, play it
                if(SerialDataObject.serialObj.isOpen && SerialDataObject.pauseFlag === true){
                    // In this case, only the pause flag needs to be updated
                }
                else{
                    // Otherwise, restart the serial port
                    StartSerial(SerialDataObject.port);    
                }
            }
            else{
                // Otherwise, restart the serial port
                StartSerial();    
            }
        }
        SerialDataObject.pauseFlag = false;
        setRunning(true);
        setStopped(false);
        setPaused(false);
    }

    function stopCallback(){
        if(SerialDataObject.inputMode === 'udp'){
            StopUDP();
        } else {
            if(SerialDataObject.serialObj !== null){
                // Close the serial port
                console.log(SerialDataObject.serialObj)
                SerialDataObject.serialObj.close((err) => {
                    console.log("Stop?" + err)
                });
            }
            console.log(SerialDataObject.port)
        }

        setStopped(true);
        setPaused(false);
        setRunning(false);
    }

    const recordCallback = React.useCallback(async () =>{
        let updatedRecordSetting = !record;
        if(updatedRecordSetting){
            if(GlobalSettings.record.directory === null){
                await selectOutputDirectory();
            }

            if(GlobalSettings.record.directory !== null){
                setRecord(updatedRecordSetting);
                GlobalSettings.record.recording = updatedRecordSetting;
                await setNextOutputFilename();
            }
            else{
                toast.error("No output folder selected. Recording not enabled.");    
            }
        }
        else{
            setRecord(updatedRecordSetting);
            GlobalSettings.record.recording = updatedRecordSetting;
        }
    },[record]);

    // Hacky workaround to get the intial state to sync when the serial port is selected
    var timer = null;
    React.useEffect(() => {
        timer = setInterval(() => {
            const serialRunning = (SerialDataObject.serialObj !== null && SerialDataObject.serialObj.isOpen);
            const udpRunning = (SerialDataObject.udpSocket !== null);
            if (serialRunning || udpRunning) {
                if (SerialDataObject.pauseFlag !== true) {
                    setStopped(false);
                    setPaused(false);
                    setRunning(true);
                } else {
                    // Paused while channel is active
                    setPaused(true);
                    setRunning(false);
                    setStopped(false);
                }
            } else {
                // No active channel: reflect fully stopped state
                setStopped(true);
                setPaused(false);
                setRunning(false);
            }
        }, 1000); 
        return () => {
            clearInterval(timer);
        }
    }, [])

    return (
        <Box sx={boxSx}>
            <IconButton  disabled={paused || stopped}  aria-label="delete" size="medium" onClick={pauseCallback} >
                <PauseCircleIcon fontSize="medium" />
            </IconButton>
            <IconButton  disabled={running} aria-label="delete" size="medium" onClick={playCallback}>
                <PlayCircleIcon fontSize="inherit" />
            </IconButton>
            <IconButton disabled={stopped} aria-label="delete" size="medium" onClick={stopCallback}>
                <StopCircleIcon fontSize="inherit" />
            </IconButton>

            <StyledDivider orientation="vertical" flexItem />

            <IconButton aria-label="delete" size="medium" onClick={recordCallback}>
                { record 
                    ? <FiberManualRecordIcon fontSize="inherit" style={{ color: 'rgba(230,0,0,1)' }}/>
                    : <FiberManualRecordIcon fontSize="inherit" />
                }
            </IconButton>
        </Box>
    );
  }
