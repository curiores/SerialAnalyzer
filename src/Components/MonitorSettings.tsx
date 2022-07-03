import * as React from 'react';
import { GlobalSettings } from "../Utils/GlobalSettings.js";
import SliderInput from "./SliderInput.tsx";

const menuFs = GlobalSettings.style.menuFs;

/* Settings pane for the serial monitor */
export default function MonitorSettings() {
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
        </div>
    )
}