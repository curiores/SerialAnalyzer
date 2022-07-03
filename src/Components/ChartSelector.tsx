import * as React from 'react';
import Stack from '@mui/material/Stack';
import MuiToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import SvgIcon from '@mui/material/SvgIcon';
import Tooltip from '@mui/material/Tooltip';
import { styled } from "@mui/material/styles";

import { GlobalSettings } from "../Utils/GlobalSettings.js";

var iconColor = GlobalSettings.style.iconColor;

const ToggleButton = styled(MuiToggleButton)({
  "&.Mui-selected, &.Mui-selected:hover": {
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.3)'
  }
});

const styles = {
  ToggleButton: {
    flexDirection: 'row',
    fontSize: '11px',
    color: iconColor
  },
  svgIcons: {
    transform: 'scale(1.3)'
  },
  svgIcons2: {
    transform: 'scale(1.2)'
  }
};

/* Creates the chart selection buttons in the toolbar. 
   
  The choices are "Plot", "Spectrum", and "Monitor"
  
  The Tooltip has a bug so that it can only be placed
  on the SvgIcon, not around the whole button
*/

export function ToggleButtonNotEmpty(props) {
  const [selection, setSelection] = React.useState(() => ['Plot', 'Spectrum']);
  const stateRef = React.useRef();

  React.useEffect(() => {
    props.onChange(selection);
  })

  const handleSelection = (
    event: React.MouseEvent<HTMLElement>,
    newSelection: string[]
  ) => {
    if (newSelection.length) {
      setSelection(newSelection);
    }
  };

  return (
    <Stack direction="row" spacing={4}>
      <ToggleButtonGroup
        value={selection}
        onChange={handleSelection}
        aria-label="device"
      >
        <ToggleButton value="Plot" aria-label="Plot" style={styles.ToggleButton} >
          <Tooltip title="Time Series" disableInteractive>
            <SvgIcon style={styles.svgIcons}>
              <path d="m1.9102 2.1348-0.14062 0.24219-1.3633 2.3594h0.89258v15.229 0.61133h0.61133 0.61133 18.689v0.89453l2.6035-1.5059-0.24414-0.14062-2.3594-1.3633v0.89453h-18.689v-11.336c0.5625 0.22656 1.0193 0.71508 1.4277 1.1504 1.8714 2.1376 3.0768 4.7709 5.082 6.7891 0.86086 0.86114 2.0388 1.569 3.3027 1.3965 1.3969-0.18674 2.4636-1.2279 3.3262-2.2598 1.5903-1.9197 2.7344-4.1777 4.4043-6.0469 0.50924-0.52611 1.1009-1.1257 1.877-1.1582-0.0059-0.62891-0.011718-1.2578-0.017578-1.8867-1.3496 0.0012601-2.4763 0.90236-3.334 1.8594-1.8247 2.0319-3.0121 4.5474-4.8613 6.5664-0.51945 0.51877-1.1556 1.1349-1.9492 1.0488-0.88974-0.18437-1.5099-0.93191-2.082-1.584-1.6915-2.0571-2.8736-4.4889-4.7363-6.4023-0.66859-0.67207-1.4965-1.2685-2.4395-1.4375v-1.3184h0.89258l-1.5039-2.6016z" />
            </SvgIcon>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="Spectrum" aria-label="Spectrum" style={styles.ToggleButton} >
          <Tooltip title="Spectrum" disableInteractive>
            <SvgIcon style={styles.svgIcons}>
              <path d="m1.9102 2.1348-0.14062 0.24219-1.3633 2.3594h0.89258v15.229 0.61133h0.61133 0.61133 18.689v0.89453l2.6035-1.5059-0.24414-0.14062-2.3594-1.3633v0.89453h-18.689v-2.0352l0.085938 0.17774c1.1653-0.48282 1.6047-1.4214 1.9805-1.875a1.0395 0.96216 0 0 0 0.025391-0.033203c1.062-1.4006 1.971-2.9588 2.5098-4.6582 0.064099 0.1616 0.13226 0.31908 0.20703 0.4707 0.97249 2.0035 2.9675 3.2112 4.9102 3.9277a1.0395 0.96216 0 0 0 0.001954 0c3.1435 1.1557 6.4425 1.6321 9.6387 2.041a1.0395 0.96216 0 0 0 0.007813 0c0.28749 0.034863 0.57439 0.069346 0.86133 0.10156l0.25-1.9102c-0.28071-0.031517-0.56037-0.063772-0.83984-0.097656l-0.001953-0.001953c-3.1661-0.40518-6.2924-0.87002-9.1484-1.9199h-0.001954c-1.6446-0.60673-3.1268-1.5752-3.7832-2.9297a1.0395 0.96216 0 0 0-0.0019532-0.007812c-0.36144-0.7319-0.64215-2.0816-0.80469-3.4023-0.16254-1.3207-0.23245-2.6142-0.31836-3.4434a1.0395 0.96216 0 0 0-1.0547-0.86914 1.0395 0.96216 0 0 0-1.0176 0.90625s-0.25374 3.8254-0.60938 5.4727a1.0395 0.96216 0 0 0-0.0039063 0.023438c-0.34825 1.8422-1.289 3.5896-2.498 5.1855-0.18515 0.22449-0.25311 0.25332-0.39453 0.42969v-7.8711-2.3008h0.89258l-1.5039-2.6016z" />
            </SvgIcon>
          </Tooltip>
        </ToggleButton>
        <ToggleButton value="Monitor" aria-label="Monitor" style={styles.ToggleButton} >
          <Tooltip title="Monitor" disableInteractive>
            <SvgIcon style={styles.svgIcons2}>
              <path d="m2.5866 3.1788c-0.441 0-0.82776 0.16559-1.1585 0.49634s-0.49527 0.7164-0.49527 1.1574v14.333c0 0.441 0.16452 0.82666 0.49527 1.1574s0.71751 0.49634 1.1585 0.49634h18.743c0.441 0 0.82665-0.16559 1.1574-0.49634s0.49634-0.7164 0.49634-1.1574v-14.333c0-0.441-0.16559-0.82665-0.49634-1.1574s-0.7164-0.49634-1.1574-0.49634zm0 3.9686h18.743v12.018h-18.743zm1.7744 1.9229v1.3351h15.151v-1.3351zm0 3.3797v1.3361h15.151v-1.3361zm0 3.3807v1.3361h10.737v-1.3361z" />
            </SvgIcon>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Stack>
  );
}