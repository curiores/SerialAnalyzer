import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import MuiInput from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import { styled } from '@mui/material/styles';


const Input = styled(MuiInput)`
  width: 42px;
`;

const minDistance = 5;

export default function MinimumDistanceSlider(props) {
  
    // Get the properties
    const name = props.name;
    const minValue = props.minValue;
    const settingHeader = props.settingHeader;
    const setting = props.setting;
    const maxValue = props.maxValue;
    const defaultValue = GlobalSettings[settingHeader][setting];
    const step = 1;
    const menuFs = props.menuFs;
    const disabled = props.disabled;
  
  const [value2, setValue2] = React.useState<number[]>([20, 37]);

  const [value, setValue] = React.useState<number | string | Array<number | string>>(
    defaultValue,
  );

  React.useEffect(()=>{
    if(!disabled){
      setValue(GlobalSettings[settingHeader][setting]);
    }
  }) 

  const handleChange2 = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setValue2([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setValue2([clamped - minDistance, clamped]);
      }
    } else {
      setValue2(newValue as number[]);
    }
  };



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
    <Box >

       <Grid container spacing={1} alignItems="center" >
           <Grid item style={{height:"14px"}} xs={14}  rowSpacing={0}  >
           <Slider 
              disabled={disabled}
              getAriaLabel={() => 'Minimum distance shift'}
              size="small"
              value={value2}
              onChange={handleChange2}
              valueLabelDisplay="auto"
              disableSwap
            />
          </Grid>
          <Grid item  >
            <Typography id="input-slider" gutterBottom style={{fontSize:menuFs}}>
               {name[0]}
            </Typography>
          </Grid>
          <Grid item >
            <Input
              type="number" 
              disabled={disabled}
              sx={{marginBottom:2, width:"3rem", height:"1.5rem",fontSize:menuFs}}
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
          <Grid item xs={3.8}>
          </Grid>
          <Grid item  >
            <Typography id="input-slider" gutterBottom style={{fontSize:menuFs}}>
               {name[1]}
            </Typography>
          </Grid>
          <Grid item >
            <Input
              type="number" 
              disabled={disabled}
              sx={{marginBottom:2, width:"3rem", height:"1.5rem",fontSize:menuFs}}
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
    </Box>
  );
}