import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import SliderInput from "./SliderInput.tsx";
import DoubleSliderInput from "./DoubleSliderInput.tsx";

const menuFs = GlobalSettings.style.menuFs;

const formStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  
export default function SpectrumSettings(){

    const [values, setValues] = React.useState({
        logScale:GlobalSettings.spectrum.logScale,
        autoScaleV:GlobalSettings.spectrum.autoScaleV,
        autoScaleH:GlobalSettings.spectrum.autoScaleH,
    })

    const pRef = React.useRef();

    const{ logScale, autoScaleV, autoScaleH } = values;

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


    const hRef = React.useRef();

    const formChangeAuto2 = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked,
        });
        hRef.current.setValuesGlobal();
    };


    React.useEffect(()=>{
        GlobalSettings.spectrum.logScale = values.logScale;
        GlobalSettings.spectrum.autoScaleV = values.autoScaleV;
        GlobalSettings.spectrum.autoScaleH = values.autoScaleH;
    }) 

    return(
        <div>
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
            <FormGroup style={formStyle}>
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
        </div>
    )

}