import * as React from 'react';
import { useState } from 'react';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import SliderInput from "./SliderInput.tsx";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Typography } from '@mui/material';

const menuFs = GlobalSettings.style.menuFs;

/* Settings pane for the serial monitor */
export default function MonitorSettings() {
    const [showTs, setShowTs] = useState(!!GlobalSettings.monitor.showTimestamp);
    const [showValsOnly, setShowValsOnly] = useState(!!GlobalSettings.monitor.showValuesOnly);
    return (
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
            <FormGroup style={{ display: 'flex', flexDirection: 'row', marginTop: '8px' }}>
                <FormControlLabel
                    control={<Checkbox
                        checked={showTs}
                        onChange={(e) => { const v = e.target.checked; setShowTs(v); GlobalSettings.monitor.showTimestamp = v; }}
                        name="showTimestamp"
                        size="small" />}
                    label={<Typography sx={{ fontSize: menuFs, userSelect: "none" }}>Show timestamp</Typography>} />
                <FormControlLabel
                    control={<Checkbox
                        checked={showValsOnly}
                        onChange={(e) => { const v = e.target.checked; setShowValsOnly(v); GlobalSettings.monitor.showValuesOnly = v; }}
                        name="showRaw"
                        size="small" />}
                    label={<Typography sx={{ fontSize: menuFs, userSelect: "none" }}>RAW Values</Typography>} />
            </FormGroup>
        </div>
    )
}