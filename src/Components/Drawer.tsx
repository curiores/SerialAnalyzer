import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import SerialChart from './SerialChart.js';
import Spectrum from './Spectrum.js';
import Monitor from './Monitor.js';
import { ToggleButtonNotEmpty } from './ChartSelector.tsx';
import { SerialDataObject } from '../Utils/SerialData';
import SerialPause from './SerialPause.tsx';
import SettingsAccordion from './SettingsAccordion.tsx'
import { GlobalSettings } from '../Utils/GlobalSettings.js';

const drawerWidth = GlobalSettings.style.drawerWidth;
var bgToolbar = '#0E4069';
var bgDrawer = 'rgb(30,30,30)';
const titleFs = GlobalSettings.style.titleFs;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 2,
  padding: theme.spacing(1),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const styles = {
  customizedAppBar: {
    top: '34px',
    backgroundColor: bgToolbar
  },
  customizedDrawerHeader: {
    marginTop: '34px',
    minHeight: '48px',
    justifyContent: 'space-between',
    color: 'rgb(180,180,180)'
  },
  customizedFlex: {
    background: 'purple',
    flex: '1 0 90%;'
  },
  lightColor: {
    color: 'rgb(220,220,200)'
  },
  customizedDivider: {
    background: 'rgb(80,80,80)'
  },
  sepStyle: {
    background: 'rgb(80,80,80)',
    height: '1px',
    margin: '0px 0px',
    padding: '0px'
  },
  customizedMain: {
    marginTop: '90px',
    height: '100 vh',
  },
  customizedToolbar: {
    justifyContent: 'space-between'
  }
};


/* This file encodes the major structure of the app. 
   The two main components are the toolbar and the drawer
*/

export default function PersistentDrawerLeft() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedPlots, setSelectedPlots] = React.useState(['Plot']);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function selectedPlotsChanged(buttonPlots) {
    setSelectedPlots(buttonPlots);

    var n = buttonPlots.length;
    if (n == 1) {
      SerialDataObject.chartHeightRatio = 0.95;
      SerialDataObject.chartMarginRatio = 0.0;
    }
    else if (n == 2) {
      SerialDataObject.chartHeightRatio = 0.925 / n;
      SerialDataObject.chartMarginRatio = 0.02;
    }
    else {
      SerialDataObject.chartHeightRatio = 0.9 / n;
      SerialDataObject.chartMarginRatio = 0.02;
    }
  }

  var serialChart = null;
  var spectrum = null;
  var monitor = null;
  if (selectedPlots.includes('Plot'))
    serialChart = <SerialChart />;
  if (selectedPlots.includes('Spectrum'))
    spectrum = <Spectrum />;
  if (selectedPlots.includes('Monitor'))
    monitor = <Monitor />;

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />

      {/* ------------- TOOLBAR ------------- */}
      <AppBar open={open} style={styles.customizedAppBar} >
        <Toolbar variant="dense" style={styles.customizedToolbar} >
          {/* HAMBURGER */}
          <div style={{ minWidth: "48px" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
          </div>

          {/* CHART SELECT */}
          <ToggleButtonNotEmpty onChange={selectedPlotsChanged} />

          {/* PAUSE/STOP/PLAY */}
          <SerialPause />
        </Toolbar>
      </AppBar>

      {/* ------------- DRAWER ------------- */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            color: 'white',
            backgroundColor: bgDrawer
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader style={styles.customizedDrawerHeader} >
          <div style={{ color: 'white', fontSize: titleFs, userSelect: 'none' }}> &nbsp; Settings </div>
          <IconButton onClick={handleDrawerClose} style={{ color: 'white' }}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider style={styles.customizedDivider} />
        <SettingsAccordion />
      </Drawer>
      <Main open={open} style={styles.customizedMain} >
        {/*Conditionally render the views*/}
        {serialChart}
        {spectrum}
        {monitor}
        <ToastContainer
          autoClose={1500}
          position="bottom-center"
          className="toast-container"
          closeOnClick={true}
          toastStyle={{ backgroundColor: "rgb(20,20,20)", fontSize: '0.9rem', color: "rgb(200,200,200)" }}
        />
      </Main>
    </Box>
  );
}
