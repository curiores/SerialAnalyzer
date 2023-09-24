import * as React from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import { styled } from '@mui/material/styles';

import { GlobalSettings } from "../Utils/GlobalSettings.js";
import { selectOutputDirectory } from '../Utils/DataRecording.js'

const { ipcRenderer } = window.require('electron');

const LimitedLengthTypography = styled(Typography)({
    display: "inline-block", 
    width: "100%", 
    whiteSpace: "nowrap",
    overflow: "hidden !important",  
    textOverflow: "ellipsis",
    fontSize: GlobalSettings.style.titleFs
})

/* Settings pane for the serial monitor */
export default function RecordSettings() {
    
    const [directory, setDirectory] = React.useState(
        GlobalSettings.record.directory === null ? "<directory unset>" : GlobalSettings.record.directory);

    // Hacky workaround to get the settings directory to update when the user sets it the first time 
    // after the record button is clicked. Really, this data should be transferred through a better
    // system.
    var timer = null;
    React.useEffect(() => {
        timer = setInterval(() => {
            if(GlobalSettings.record.directory !== null ){
                if(directory !== GlobalSettings.record.directory){
                    setDirectory(GlobalSettings.record.directory);
                }
            }
        }, 1000); 
        return () => {
            clearInterval(timer);
        }
    }, [])

    const selectDirectory = useCallback(async () => {
        await selectOutputDirectory();
        if(GlobalSettings.record.directory !== null){
            setDirectory(GlobalSettings.record.directory);
        }
    },[directory])

    return (
        <div>
            <Button variant="outlined" onClick={selectDirectory} size="medium" fullWidth>
                Select output directory
            </Button>
            <LimitedLengthTypography>
                {directory}
            </LimitedLengthTypography>
        </div>
    )
}