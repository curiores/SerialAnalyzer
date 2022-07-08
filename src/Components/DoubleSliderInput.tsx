import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import { GlobalSettings } from "../Utils/GlobalSettings.js";


/* Double slider includes two sliders and two inputs

  It also allows a reference so that more control is available
  to allow the parent to update this function.

  By default the minimum distance is 1/20 the total distance.

  TODO: There is occasionally bugginess near the minimum value...
  
*/

export default class DoubleSliderInput extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      values: [GlobalSettings[props.settingHeader][props.setting[0]],
      GlobalSettings[props.settingHeader][props.setting[1]]]
    };
  }

  // This is the basic hook function
  setValues(values) {
    this.setState((state) => {
      return { values: values }
    });
  }

  setValuesGlobal() {
    this.setValues([GlobalSettings[this.props.settingHeader][this.props.setting[0]],
    GlobalSettings[this.props.settingHeader][this.props.setting[1]]]);
  }

  sliderChange = (
    event: Event,
    sliderValues: number | number[],
    activeThumb: number,
  ) => {
    var max = this.props.maxValue;
    var min = this.props.minValue;

    var minDistance = (max - min) / (20.0);
    if (!Array.isArray(sliderValues)) {
      return;
    }
    if (sliderValues[1] - sliderValues[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(sliderValues[0], max - minDistance);
        this.valuesChanged([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(sliderValues[1], min - minDistance);
        this.valuesChanged([clamped - minDistance, clamped]);
      }
    } else {
      this.valuesChanged(sliderValues as number[]);
    }
  };

  valueChanged(newValue, index) {
    var newValues = this.state.values;
    newValues[index] = newValue;
    this.valuesChanged(newValues);
  }

  valuesChanged(newValues) {
    this.setValues(newValues)
    // Also update the global object
    for (var i = 0; i < 2; i++) {
      GlobalSettings[this.props.settingHeader][this.props.setting[i]] = newValues[i];
    }
  }

  handleInputChange0 = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.valueChanged(event.target.value === '' ? '' : Number(event.target.value), 0);
  };
  handleInputChange1 = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.valueChanged(event.target.value === '' ? '' : Number(event.target.value), 1);
  };

  render() {
    return (
      <Box >
        <Grid container spacing={1} alignItems="center" >
          <Grid item style={{ height: "14px", marginLeft:"10px",marginRight:"10px"  }} xs={14} rowSpacing={0}  >
            <Slider
              disabled={this.props.disabled}
              getAriaLabel={() => 'Minimum distance shift'}
              size="small"
              value={this.state.values}
              onChange={this.sliderChange}
              valueLabelDisplay="auto"
              disableSwap
              step={this.props.step}
              min={this.props.minValue}
              max={this.props.maxValue}
            />
          </Grid>
          <Grid item  >
            <Typography id="input-slider" gutterBottom
              style={{ fontSize: this.props.menuFs, userSelect: "none" }}>
              {this.props.name[0]}
            </Typography>
          </Grid>
          <Grid item >
            <Input
              type="number"
              disabled={this.props.disabled}
              sx={{ marginBottom: 2, width: this.props.inputWidth, height: "1.5rem", fontSize: this.props.menuFs }}
              value={this.state.values[0]}
              onChange={this.handleInputChange0}
              inputProps={{
                step: this.props.step,
                min: this.props.minValue,
                max: this.props.maxValue,
                type: 'number',
              }}
            />
          </Grid>
          <Grid item xs={this.props.spacing}>
          </Grid>
          <Grid item  >
            <Typography id="input-slider" gutterBottom
              style={{ fontSize: this.props.menuFs, userSelect: "none" }}>
              {this.props.name[1]}
            </Typography>
          </Grid>
          <Grid item >
            <Input
              type="number"
              disabled={this.props.disabled}
              sx={{ marginBottom: 2, width: this.props.inputWidth, height: "1.5rem", fontSize: this.props.menuFs }}
              value={this.state.values[1]}
              onChange={this.handleInputChange1}
              inputProps={{
                step: this.props.step,
                min: this.props.minValue,
                max: this.props.maxValue,
                type: 'number',
              }}
            />
          </Grid>
        </Grid>
      </Box>
    )
  };

}