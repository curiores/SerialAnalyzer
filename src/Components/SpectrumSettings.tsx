import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import SliderInput from "./SliderInput.tsx";
import DoubleSliderInput from "./DoubleSliderInput.tsx";
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import MuiInput from '@mui/material/Input';
import { styled } from '@mui/material/styles';

const Input = styled(MuiInput)`
  width: 42px;
`;

const menuFs = GlobalSettings.style.menuFs;

const formStyle = {
    display: 'flex',
    flexDirection: 'row'
  };

const windowOptions = ["none","hann", "hamming", "cosine", "lanczos", 
        "gaussian", "tukey", "blackman", "exact_blackman", "kaiser", 
        "nuttall", "blackman_harris", "blackman_nuttall", "flat_top"];

const defaultWindow = GlobalSettings.spectrum.windowFunc; 

export default function SpectrumSettings(){

    const [values, setValues] = React.useState({
        logScale:GlobalSettings.spectrum.logScale,
        autoScaleV:GlobalSettings.spectrum.autoScaleV,
        autoScaleH:GlobalSettings.spectrum.autoScaleH,
        windowFunc:GlobalSettings.spectrum.windowFunc,
        useFixedSampleRate:GlobalSettings.spectrum.useFixedSampleRate,
        sampleRate:GlobalSettings.spectrum.sampleRate
    })

    const pRef = React.useRef();
    const hRef = React.useRef();

    const{ logScale, autoScaleV, autoScaleH, useFixedSampleRate, sampleRate } = values;

    const formChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked,
        });
    };
    
    const formChangeAuto = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked,
        });
        pRef.current.setValuesGlobal();
    };

    const formChangeAuto2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked,
        });
        hRef.current.setValuesGlobal();
    };

    const formChangeSample = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked,
            sampleRate: GlobalSettings.spectrum.sampleRate,  // Change the sample rate to match the global one
        });
    };

    const windowChange = ((event: any, newValue: any) => {
        setValues({
            ...values,
            windowFunc: newValue,
        });
    });
    
    const sampleRateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value === '' ? '' : Number(event.target.value),
        });
    };
 

    React.useEffect(()=>{
        GlobalSettings.spectrum.logScale = values.logScale;
        GlobalSettings.spectrum.autoScaleV = values.autoScaleV;
        GlobalSettings.spectrum.autoScaleH = values.autoScaleH;
        GlobalSettings.spectrum.windowFunc = values.windowFunc;
        GlobalSettings.spectrum.useFixedSampleRate = values.useFixedSampleRate;
        GlobalSettings.spectrum.sampleRate = values.sampleRate;
    }) 

    return(
        <div >
             <FormGroup style={formStyle}>
                <FormControlLabel 
                    control={<Checkbox 
                                checked={logScale} 
                                onChange={formChange} 
                                name="logScale"  
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Log scale</Typography>} />
                <FormControlLabel 
                    control={<Checkbox 
                                checked={autoScaleV} 
                                onChange={formChangeAuto} 
                                name="autoScaleV" 
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Vertical auto scale</Typography>} />
            </FormGroup> 
            <DoubleSliderInput
                ref = {pRef}
                disabled={autoScaleV}
                step={0.01}
                minValue={-6}
                maxValue={6}
                menuFs={menuFs}
                settingHeader={"spectrum"}
                setting={["pmin","pmax"]}
                name={["pmin 10^","pmax 10^"]}    
                spacing={2.0}
                logscale={true}
                inputWidth="3.5em"
            />
            <FormGroup style={{...formStyle, marginTop:"2px"}}>
                <FormControlLabel 
                    control={<Checkbox 
                                checked={autoScaleH} 
                                onChange={formChangeAuto2} 
                                name="autoScaleH" 
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Frequency auto scale</Typography>} />
            </FormGroup> 
            <DoubleSliderInput
                ref = {hRef}
                disabled={autoScaleH}
                step={0.01}
                minValue={0}
                maxValue={120}
                menuFs={menuFs}
                settingHeader={"spectrum"}
                setting={["fmin","fmax"]}
                name={["fmin","fmax"]}    
                spacing={3.8}
                logscale={false}
                inputWidth="3.8em"
            />
            <Autocomplete
                onChange={windowChange} 
                options={windowOptions}
                defaultValue={defaultWindow}
                sx={{fontSize:"12px",marginTop:"8px"}} 
                openOnFocus
                renderOption={(props,option)=>(
                    <li {...props} style={{fontSize:menuFs}}> {option}</li>
                    )}
                renderInput={(params) => (
                    <TextField {...params} label="Windowing Function" variant="standard"  
                        InputProps={{ ...params.InputProps, style: { fontSize: menuFs } }}/>
                )}
            />
            <FormGroup style={{...formStyle, marginTop:"12px"}}>
                <FormControlLabel 
                    control={<Checkbox 
                                checked={useFixedSampleRate} 
                                onChange={formChangeSample} 
                                name="useFixedSampleRate" 
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Fixed sample rate (Hz)</Typography>} />
            <Input
              type="number" 
              name="sampleRate"
              disabled={!useFixedSampleRate}
              sx={{marginTop:1, width:"4em", height:"1.5rem", fontSize:menuFs}}
              value={sampleRate}
              onChange={sampleRateChange}
              inputProps={{
                step: 1,
                min:0,
                max:1e6,
                type: 'number',
              }}
            />
            </FormGroup> 

        </div>
    )

}