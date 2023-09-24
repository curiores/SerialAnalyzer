/* Global settings variables 
   These are used by the charts, etc. and updated by the settings pane.
   Some of these are constant (like the style components).
   TODO: 
     * Could be separated into two parts: constants and globals.
     * The styles could also be refactored into themes, which
       would work be more consistent with REACT/MUI.
*/
export var GlobalSettings = {
    global: {
        decimation: 1,
        lineThickness: 2,
        pointRadius: 0,
        firstColumnTime: false,
        drawerOpen: true,
    },
    timeSeries: {
        ymin: -5,
        ymax: 5,
        scroll: true,
        autoScale: true,
        estimateTime: false,
        refreshRate: 50
    },
    spectrum: {
        pmin: -3,
        pmax: 3,
        fmin: 0,
        fmax: 60,
        logScale: true,
        autoScaleV: true,
        autoScaleH: true,
        NHistory: 20,
        windowFunc: "hann",
        useFixedSampleRate: false,
        sampleRate: 100,
        refreshRate: 150,
    },
    monitor: {
        fontSize: 12,
        refreshRate: 50,
    },
    record: {
        recording: false,
        directory: null,
        outputFilename: null
    },
    style: {
        menuFs: "0.8rem",
        titleFs: "0.9rem",
        iconColor: 'rgb(230,230,230)',
        drawerWidth: 300,
        gridColor: 'rgba(100,100,100,0.3)',
        plotFontColor: 'rgb(180,180,180)',
        axisColor: 'rgb(180,180,180)',
        plotPadChars: 10,
        playPauseTrayOutlineColor:'rgb(255,255,255,0.4)'
    }
};