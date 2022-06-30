import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { GlobalSettings } from "../Utils/GlobalSettings.js";

var minValue = -20;
var maxValue = 0;
var defaultValue = GlobalSettings.timeSeries.ymin;
var step = 1;
const menuFs = "0.8rem";

const Input = styled(MuiInput)`
  width: 42px;
`;

const divStyle = {
    display: "flex",
    alignItems: "center",
    flexFlow: "row wrap",
    height: "50px",
}

export default function SliderInput(props) {
    const [value, setValue] = React.useState<number | string | Array<number | string>>(
      defaultValue,
    );

    const disabled = props.disabled;
  
    
    function valueChanged(newValue){
      setValue(newValue)
      // Also update the global object
      GlobalSettings.timeSeries.ymin = newValue;
      
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
               ymin
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