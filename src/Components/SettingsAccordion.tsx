import * as React from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BufferSizeSlider from './BufferSize.tsx';

import {SerialPortsList, SerialDialogProps} from './SerialSelect.tsx';
import SerialSettings from "./SerialSettings.tsx";

const titleFs = "0.9rem";

const summaryHeight = '40px';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    minHeight:"36px",
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ExpandMoreIcon  sx={{ fontSize: '1.25rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  fontSize:"1.6rem",
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(1.5),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function SettingsAccordion() {
  const [expanded, setExpanded] = React.useState<string | false>('panel0');

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    };

  return (
    <ThemeProvider theme={darkTheme}>
      <Accordion expanded={expanded === 'panel0'} onChange={handleChange('panel0')} >
        <AccordionSummary aria-controls="panel0d-content" id="panel0d-header" sx={{ height: summaryHeight, minHeight:summaryHeight}} >
          <Typography style={{fontSize:titleFs}}>Global</Typography>
        </AccordionSummary>
        <AccordionDetails >
          <SerialPortsList />

          <BufferSizeSlider />
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} >
        <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" sx={{ height: summaryHeight, minHeight:summaryHeight}} >
          <Typography style={{fontSize:titleFs}}>Time Series</Typography>
        </AccordionSummary>
        <AccordionDetails>
          
          <SerialSettings/>
          
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} >
        <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" sx={{ height: summaryHeight, minHeight:summaryHeight}} >
          <Typography style={{fontSize:titleFs}}>Spectrum</Typography>
        </AccordionSummary>
        <AccordionDetails>
          
          --
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary aria-controls="panel3d-content" id="panel3d-header" sx={{ height: summaryHeight, minHeight:summaryHeight}} >
          <Typography style={{fontSize:titleFs}}>Monitor</Typography>
        </AccordionSummary>
        <AccordionDetails>
          
          --
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}