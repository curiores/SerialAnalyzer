import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';

import { SerialDataObject } from "../Utils/SerialData.js";

var minValue = 100;
var maxValue = 2000;
var defaultValue = SerialDataObject.bufferSize;
var step = 50;
const menuFs = "0.8rem";

const divStyle = {
  display: "flex",
  alignItems: "center",
  flexFlow: "row wrap",
  height: "50px",
}

/* Updates the buffer size using a slider + edit field 

   TODO: This code could be refactored to use the SliderInput, which is
   a generalization that can be used for multiple settings.

   However, the bufferSize setting would need to me moved into 
   GlobalSettings or the SliderInput would need to be modified.
*/

export default function BufferSizeSlider() {
  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    defaultValue,
  );

  function valueChanged(newValue) {
    setValue(newValue)
    // Also update the global object
    SerialDataObject.bufferSize = newValue;
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
        <Grid item style={{ height: "100%" }} >
          <Typography id="input-slider" gutterBottom style={{ fontSize: menuFs }}>
            Buffer size
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
          />
        </Grid>
        <Grid item >
          <Input
            type="number"
            sx={{ marginBottom: 2, width: "3rem", height: "2rem", fontSize: menuFs }}
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