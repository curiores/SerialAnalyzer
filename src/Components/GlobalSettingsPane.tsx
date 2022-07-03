import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

import BufferSizeSlider from './BufferSize.tsx';
import SliderInput from "./SliderInput.tsx";
import { SerialDataObject, StartSerial } from '../Utils/SerialData.js';
import { SerialPortsList } from './SerialSelect.tsx';

const menuFs = GlobalSettings.style.menuFs;

const formStyle = {
    display: 'flex',
    flexDirection: 'row',
};

const baudOptions = ['300', '1200', '2400', '4800', '9600', '19200', '38400', '57600',
                    '74880', '115200', '230400', '250000', '500000', '1000000', '2000000'];
const defaultBaud = '9600';

/*  The global settings pane inside the drawer.
    Uses Autocomplete, SliderInput, and Checkbox.
    Updates the GlobalSettings and SerialDataObject globals.
*/

export default function GlobalSettingsPane() {

    const [baudRate, setBaudRate] = React.useState(SerialDataObject.baudRate);
    const [firstColumnTime, setFirstColumnTime] = React.useState(GlobalSettings.global.firstColumnTime);

    const baudRateChange = ((event: any, newValue: any) => {

        var numericValue = parseInt(newValue);
        if (typeof numericValue === 'number') {
            setBaudRate(numericValue);
            SerialDataObject.baudRate = numericValue;

            try {
                StartSerial();
            } catch (error) {
                console.log(error);
            }
        }
    });

    const formChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFirstColumnTime(event.target.checked);
        GlobalSettings.global.firstColumnTime = event.target.checked;
        StartSerial();
    };

    return (
        <div style={{ flexGrow: 1 }}>
            <SerialPortsList />
            <Autocomplete
                onChange={baudRateChange}
                options={baudOptions}
                defaultValue={defaultBaud}
                autoHighlight
                sx={{ fontSize: "12px", marginTop: "8px" }}
                renderOption={(props, option) => (
                    <li {...props} style={{ fontSize: menuFs }}> {option}</li>
                )}
                renderInput={(params) => (
                    <TextField {...params} label="Baud Rate" variant="standard"
                        InputProps={{ ...params.InputProps, style: { fontSize: menuFs } }} />
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
            <FormGroup style={formStyle}>
                <FormControlLabel
                    control={<Checkbox checked={firstColumnTime}
                        onChange={formChange}
                        name="firstColumnTime"
                        size="small" />}
                    label={<Typography sx={{ fontSize: menuFs, userSelect: "none" }}>First column is time (in ms)</Typography>} />
            </FormGroup>
        </div>
    )

}