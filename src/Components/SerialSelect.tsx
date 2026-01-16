import * as React from 'react';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { SerialDataObject, StartSerial, GetPortName, GetPortShortName } from '../Utils/SerialData';
import { GlobalSettings } from "../Utils/GlobalSettings.js";

const { SerialPort } = window.require("serialport");

const titleFs = GlobalSettings.style.titleFs;

const selectStyles = {
  marginTop: '8px',
  marginBottom: '8px'
};

const noneOption = { path: "None", friendlyName: "None" } as any;

export function SerialPortSelect() {
  const [options, setOptions] = React.useState<any[]>([noneOption]);
  const [value, setValue] = React.useState<any>(SerialDataObject.port?.path ? SerialDataObject.port : noneOption);

  const refreshPorts = React.useCallback(() => {
    SerialPort.list().then((portsLocal: any, err: any) => {
      if (err) {
        setOptions([noneOption]);
        return;
      }
      const opts = portsLocal && portsLocal.length > 0 ? portsLocal : [];
      const newOptions = [noneOption, ...opts];
      setOptions(newOptions);

      // Maintain selection if present, otherwise set to None
      const currentPath = value?.path;
      const exists = newOptions.some(p => p.path === currentPath);
      if (!exists) {
        // Close serial if it's running
        if (SerialDataObject.serialObj && SerialDataObject.serialObj.isOpen) {
          try { SerialDataObject.serialObj.close(); } catch (e) { console.log(e); }
        }
        SerialDataObject.port = { path: null, friendlyName: "None" } as any;
        setValue(noneOption);
      }
    });
  }, [value]);

  const handleChange = (_event: any, newValue: any) => {
    if (!newValue) { return; }
    setValue(newValue);
    if (newValue.path === "None") {
      // Stop serial and set None
      if (SerialDataObject.serialObj && SerialDataObject.serialObj.isOpen) {
        try { SerialDataObject.serialObj.close(); } catch (e) { console.log(e); }
      }
      SerialDataObject.port = { path: null, friendlyName: "None" } as any;
      return;
    }
    // Start serial on selected port
    try {
      StartSerial(newValue);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={selectStyles}>
      <Autocomplete
        options={options}
        value={value}
        onChange={handleChange}
        onOpen={refreshPorts}
        getOptionLabel={(option) => GetPortName(option)}
        isOptionEqualToValue={(option, val) => option.path === val.path}
        renderInput={(params) => (
          <TextField {...params} label="Serial Port" variant="standard"
            InputProps={{ ...params.InputProps, style: { fontSize: GlobalSettings.style.menuFs } }} />
        )}
        renderOption={(props, option) => (
          <li {...props} style={{ fontSize: GlobalSettings.style.menuFs }}>{GetPortName(option)}</li>
        )}
        size="small"
      />
      <Typography variant="subtitle1" component="div" style={{ fontSize: titleFs }}>
        Current: {GetPortShortName(SerialDataObject.port)}
      </Typography>
    </div>
  );
}

