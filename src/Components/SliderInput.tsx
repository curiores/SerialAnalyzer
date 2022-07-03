import * as React from 'react';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { GlobalSettings } from "../Utils/GlobalSettings.js";

const divStyle = {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    height: "50px",
}

/* Creates a slider and an input value
   Would need to be modified to support external changes 
   of the global settings. (For example, by converting
    it to a class like the double slider input)
*/

export default function SliderInput(props) {
  
    // Get the properties
    const name = props.name;
    const minValue = props.minValue;
    const settingHeader = props.settingHeader;
    const setting = props.setting;
    const maxValue = props.maxValue;
    const defaultValue = GlobalSettings[settingHeader][setting];
    const step = props.step;
    const menuFs = props.menuFs;
    const disabled = props.disabled;
  
    const [value, setValue] = React.useState<number | string | Array<number | string>>(
      defaultValue,
    );

    function valueChanged(newValue){
        setValue(newValue)
        // Also update the global object
        GlobalSettings[settingHeader][setting] = newValue;
    }

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
      valueChanged(newValue);
    };
  
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      valueChanged(event.target.value === '' ? '' : Number(event.target.value));
    };
  
    const handleBlur = () => {
      if (value < minValue) {
        valueChanged(minValue);
      } else if (value > maxValue) {
        valueChanged(maxValue);
      }
    };
  
    return (
      <div >
        <Grid container spacing={2} alignItems="center" >
          <Grid item style={{height:"100%"}} >
            <Typography id="input-slider" gutterBottom style={{fontSize:menuFs}}>
               {name}
            </Typography>
          </Grid>
          <Grid item sm>
            <Slider
              size="small"
              value={typeof value === 'number' ? value : 0}
              onChange={handleSliderChange}
              aria-labelledby="input-slider"
              min={minValue}
              max={maxValue}
              step={step}
              disabled={disabled}
            />
          </Grid>
          <Grid item >
            <Input
              type="number" 
              disabled={disabled}
              sx={{marginBottom:2, width:"3rem", height:"2rem",fontSize:menuFs}}
              value={value}
              onChange={handleInputChange}
              onBlur={handleBlur}
              inputProps={{
                step: step,
                min: minValue,
                max: maxValue,
                type: 'number',
              }}
            />
          </Grid>
        </Grid>
      </div>
    );
  }