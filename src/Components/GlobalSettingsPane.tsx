import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import SliderInput from "./SliderInput.tsx";
import BufferSizeSlider from './BufferSize.tsx';

import {SerialPortsList} from './SerialSelect.tsx';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SerialDataObject, StartSerial } from '../Utils/SerialData.js';

const menuFs = GlobalSettings.style.menuFs;

const formStyle = {
    display: 'flex',
    flexDirection: 'row',
};

const baudOptions = ['300','1200','2400','4800','9600','19200','38400','57600',
        '74880','115200','230400','250000','500000','1000000','2000000'];
const defaultBaud = '9600';

export default function GlobalSettingsPane(){

    const [baudRate,setBaudRate] = React.useState(SerialDataObject.baudRate);

    const baudRateChange = ((event: any, newValue: any) => {
     
        var numericValue = parseInt(newValue);
        if(typeof numericValue === 'number'){
            setBaudRate(numericValue);
            SerialDataObject.baudRate = numericValue;

            try{
                StartSerial();
            }catch (error){
                console.log(error);
            }
        }

    });
    

    return(
        <div>
            <SerialPortsList />
            <Autocomplete
                onChange={baudRateChange} 
                options={baudOptions}
                defaultValue={defaultBaud}
                autoHighlight
                sx={{fontSize:"12px",marginTop:"8px"}} 
                renderOption={(props,option)=>(
                    <li {...props} style={{fontSize:menuFs}}> {option}</li>
                    )}
                renderInput={(params) => (
                    <TextField {...params} label="Baud Rate" variant="standard"  
                        InputProps={{ ...params.InputProps, style: { fontSize: menuFs } }}/>
                )}
            />
            <BufferSizeSlider />
            <SliderInput
                disabled={false}
                minValue={1}
                maxValue={20}
                step={1}
                menuFs={menuFs}
                settingHeader={"global"}
                setting={"decimation"}
                name={"Decimation"}                
            />
            <SliderInput
                disabled={false}
                minValue={0.1}
                maxValue={5}
                step={0.1}
                menuFs={menuFs}
                settingHeader={"global"}
                setting={"lineThickness"}
                name={"Line thickness"}                
            />
            <SliderInput
                disabled={false}
                minValue={0}
                maxValue={5}
                step={0.1}
                menuFs={menuFs}
                settingHeader={"global"}
                setting={"pointRadius"}
                name={"Point radius"}                
            />
        </div>
    )

}