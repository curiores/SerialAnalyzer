import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

import { GlobalSettings } from "../Utils/GlobalSettings.js";

/* UNUSED 
   This was replaced by a class to allow easier use of references.
   Keeping this in case it is used later. 
*/

export default function MinimumDistanceSlider(props) {

  // Get the properties
  const name = props.name;
  const minValue = props.minValue;
  const settingHeader = props.settingHeader;
  const setting = props.setting;
  const maxValue = props.maxValue;
  const menuFs = props.menuFs;
  const disabled = props.disabled;
  const defaultValue = [GlobalSettings[settingHeader][setting[0]],
                        GlobalSettings[settingHeader][setting[1]]];
  const step = props.step;
  const minDistance = (maxValue - minValue) / (20.0);
  const [values, setValues] = React.useState<number[]>([defaultValue[0], defaultValue[1]]);

  const sliderChange = (
    event: Event,
    newValues: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValues)) {
      return;
    }
    if (newValues[1] - newValues[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValues[0], maxValue - minDistance);
        valuesChanged([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValues[1], minValue - minDistance);
        valuesChanged([clamped - minDistance, clamped]);
      }
    } else {
      valuesChanged(newValues as number[]);
    }
  };

  function valueChanged(newValue, index) {
    var newValues = values;
    newValues[index] = newValue;
  }

  function valuesChanged(newValues) {
    setValues(newValues)
    // Also update the global object
    for (var i = 0; i < 2; i++)
      GlobalSettings[settingHeader][setting[i]] = newValues[i];
  }

  const handleInputChange0 = (event: React.ChangeEvent<HTMLInputElement>) => {
    valueChanged(event.target.value === '' ? '' : Number(event.target.value), 0);
  };
  const handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    valueChanged(event.target.value === '' ? '' : Number(event.target.value), 1);
  };

  return (
    <Box >
      <Grid container spacing={1} alignItems="center" >
        <Grid item style={{ height: "14px" }} xs={14} rowSpacing={0}  >
          <Slider
            disabled={disabled}
            getAriaLabel={() => 'Minimum distance shift'}
            size="small"
            value={values}
            onChange={sliderChange}
            valueLabelDisplay="auto"
            disableSwap
            step={step}
            min={minValue}
            max={maxValue}
          />
        </Grid>
        <Grid item  >
          <Typography id="input-slider" gutterBottom style={{ fontSize: menuFs, userSelect: "none" }}>
            {name[0]}
          </Typography>
        </Grid>
        <Grid item >
          <Input
            type="number"
            disabled={disabled}
            sx={{ marginBottom: 2, width: "3rem", height: "1.5rem", fontSize: menuFs }}
            value={values[0]}
            onChange={handleInputChange0}
            inputProps={{
              step: step,
              min: minValue,
              max: maxValue,
              type: 'number',
            }}
          />
        </Grid>
        <Grid item xs={3.8}>
        </Grid>
        <Grid item  >
          <Typography id="input-slider" gutterBottom style={{ fontSize: menuFs, userSelect: "none" }}>
            {name[1]}
          </Typography>
        </Grid>
        <Grid item >
          <Input
            type="number"
            disabled={disabled}
            sx={{ marginBottom: 2, width: "3rem", height: "1.5rem", fontSize: menuFs }}
            value={values[1]}
            onChange={handleInputChange1}
            inputProps={{
              step: step,
              min: minValue,
              max: maxValue,
              type: 'number',
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}