export var GlobalSettings = {
    timeSeries: {
        ymin: -5,
        ymax: 5,
        scroll: true,
        autoScale: true,
        estimateTime: false,
    },
    spectrum:{
        pmin:-3,
        pmax:3,        
        fmin:0,
        fmax:60,
        logScale:true,
        autoScaleV:false,
        autoScaleH:true,
        NHistory:20,
        windowFunc:"hann",
        useFixedSampleRate: false,
        sampleRate: 100,
    },
    monitor:{
        fontSize:12,
    },
    style:{
        menuFs:"0.8rem",
        
    }


};