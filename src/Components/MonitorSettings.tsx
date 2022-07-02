import * as React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import SliderInput from "./SliderInput.tsx";

const menuFs = GlobalSettings.style.menuFs;

const formStyle = {
    display: 'flex',
    flexDirection: 'row',
  };
  
export default function MonitorSettings(){

    const [values, setValues] = React.useState({
        fontSize:12,
    })

    const{ fontSize } = values;

    React.useEffect(()=>{
        GlobalSettings.monitor.fontSize = values.fontSize;
    }) 

    return(
        <div>
            <SliderInput
                disabled={false}
                minValue={0}
                maxValue={20}
                menuFs={menuFs}
                settingHeader={"monitor"}
                setting={"fontSize"}
                name={"Font size"}                
            />
        </div>
    )

}