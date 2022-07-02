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

    return(
        <div>
            <SliderInput
                disabled={false}
                minValue={2}
                maxValue={20}
                step={1}
                menuFs={menuFs}
                settingHeader={"monitor"}
                setting={"fontSize"}
                name={"Font size"}                
            />
        </div>
    )

}