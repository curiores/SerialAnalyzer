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
  
export default function SerialSettings(){

    const [values, setValues] = React.useState({
        scroll:true,
        autoScale:true,
        estimTime:false,
    })

    const yRef = React.useRef();

    const{ scroll, autoScale, estimTime } = values;

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
        yRef.current.setValuesGlobal();
    };


    React.useEffect(()=>{
        GlobalSettings.timeSeries.scroll = values.scroll;
        GlobalSettings.timeSeries.autoScale = values.autoScale;
        GlobalSettings.timeSeries.estimateTime = values.estimTime;
    }) 

    return(
        <div>
             <FormGroup style={formStyle}>
                <FormControlLabel 
                    control={<Checkbox 
                                checked={autoScale} 
                                onChange={formChangeAuto} 
                                name="autoScale" 
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Auto scale</Typography>} />
            </FormGroup> 
            <DoubleSliderInput
                ref = {yRef}
                disabled={autoScale}
                step={0.1}
                minValue={-20}
                maxValue={20}
                menuFs={menuFs}
                settingHeader={"timeSeries"}
                setting={["ymin","ymax"]}
                name={["ymin","ymax"]}    
                spacing={3.8}
                logscale={false}
                inputWidth="3em"
            />
            <FormGroup style={formStyle}>
                <FormControlLabel 
                    control={<Checkbox 
                                checked={scroll} 
                                onChange={formChange} 
                                name="scroll"  
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Scroll</Typography>} />
                <FormControlLabel 
                    control={<Checkbox checked={estimTime} 
                                onChange={formChange} 
                                name="estimTime" 
                                size="small"/>} 
                    label={<Typography sx={{ fontSize:menuFs,userSelect:"none"}}>Estimate time axis</Typography>} />
            </FormGroup> 
        </div>
    )

}