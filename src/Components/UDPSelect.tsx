import * as React from 'react';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import { SerialDataObject } from '../Utils/SerialData';

const titleFs = GlobalSettings.style.menuFs;

const selectStyles = {
  marginTop: '8px',
  marginBottom: '8px'
};

export function UDPPortSelect() {
  const [port, setPort] = React.useState<number>(SerialDataObject.udpPort || 5000);

  return (
    <div style={selectStyles}>
      <TextField
        label="UDP Port"
        type="number"
        size="small"
        fullWidth
        variant="standard"
        value={port}
        onChange={(e) => {
          const val = parseInt(e.target.value);
          if (!isNaN(val)) {
            // Clamp to valid UDP port range
            const clamped = Math.min(65535, Math.max(1, val));
            setPort(clamped);
            SerialDataObject.udpPort = clamped;
          }
        }}
        InputProps={{ inputProps: { min: 1, max: 65535, step: 1 }, style: { fontSize: GlobalSettings.style.menuFs } }}
      />
    </div>
  );
}