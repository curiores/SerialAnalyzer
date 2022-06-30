import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import YMin from "./YMin.tsx";
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
    })
    const{ scroll, autoScale } = values;

    const formChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [event.target.name]: event.target.checked,
        });
    };

    React.useEffect(()=>{
        GlobalSettings.timeSeries.scroll = values.scroll;
        GlobalSettings.timeSeries.autoScale = values.autoScale;
    }) 

    return(
        <div>


            <FormGroup style={formStyle}>
                <FormControlLabel control={<Checkbox checked={scroll} onChange={formChange} name="scroll"  size="small"/>} 
                        label={<Typography sx={{ fontSize:menuFs}}>Scroll</Typography>} />
                <FormControlLabel control={<Checkbox checked={autoScale} onChange={formChange} name="autoScale" size="small"/>} 
                        label={<Typography sx={{ fontSize:menuFs}}>Auto scale</Typography>} />
            </FormGroup> 
            <DoubleSliderInput
                disabled={autoScale}
                minValue={0}
                maxValue={20}
                menuFs={menuFs}
                settingHeader={"timeSeries"}
                setting={"ymax"}
                name={["ymin","ymax"]}    
            />

            <YMin disabled={autoScale}/>
            <SliderInput
                disabled={autoScale}
                minValue={0}
                maxValue={20}
                menuFs={menuFs}
                settingHeader={"timeSeries"}
                setting={"ymax"}
                name={"ymax"}                
            />


        </div>
    )

}