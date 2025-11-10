import { GlobalSettings } from "./GlobalSettings.js";
import { SerialDataObject } from "./SerialData.js";

/* These functions are used by the charts. 
   Right now there's not muchreuse... they are simply here
   to separate some of the functions that operate on the data
   from the presentation in Spectrum.js and SerialChart.js
*/
export function reformatData(xvec,yarray,yindex,step){
    // This creates data arrays of the form [{x:100,y:23.44},{x:100,y:23.44},...]
    // Uses a step size of step (so it can decimate the data)
    var data = [];
    for(var k = 0; k < xvec.length; k=k+step){
      data.push({ x: xvec[k], 
                  y: yarray[k][yindex]})
    }
    return data;
}

export function reformatDataVec(xvec,yvec){
    // This creates data arrays of the form [{x:100,y:23.44},{x:100,y:23.44},...]
    // From the serial data
    var data = [];
    for(var k = 0; k < xvec.length; k++){
      data.push({ x: xvec[k], 
                  y: yvec[k]})
    }
    return data;
}

export function nextPowerOf2(x){
    return Math.pow(2, Math.ceil(Math.log(x)/Math.log(2)));
}

export function autoResize(){
    if(GlobalSettings.timeSeries.autoScale && !SerialDataObject.pauseFlag){
        // Collect values only from visible variables
        const dataRows = SerialDataObject.data;
        if(!Array.isArray(dataRows) || dataRows.length === 0){ return; }
        const nvars = dataRows[dataRows.length - 1].length || 0;
        let vis = SerialDataObject.visibleVars;
        // Initialize visibility if missing or mismatched
        if(!Array.isArray(vis) || vis.length !== nvars){
            vis = new Array(nvars).fill(true);
            SerialDataObject.visibleVars = vis;
        }

        const values = [];
        for(const row of dataRows){
            for(let j=0;j<nvars;j++){
                if(vis[j] === true) {
                    const v = row[j];
                    if(typeof v === 'number' && !isNaN(v)) values.push(v);
                }
            }
        }
        if(values.length === 0){ return; }

        let ymin = Math.min(...values);
        let ymax = Math.max(...values);
        // If constant values, create a small symmetrical range
        if(ymax === ymin){
            const pad = Math.max(1, Math.abs(ymin) * 0.05);
            ymin -= pad;
            ymax += pad;
        }
        const span = ymax - ymin;
        const margin = span * 0.05; // 5% margin
        const yminUpdate = ymin - margin;
        const ymaxUpdate = ymax + margin;

        if(!isNaN(yminUpdate)){
            GlobalSettings.timeSeries.ymin = yminUpdate;
        }
        if(!isNaN(ymaxUpdate)){
            GlobalSettings.timeSeries.ymax = ymaxUpdate;
        }
    }
}

var minHistory = [];
var maxHistory = [];
export function autoResizeSpectrum(dataMin,dataMax){

    minHistory.push(dataMin);
    maxHistory.push(dataMax);
    if(minHistory.length>GlobalSettings.spectrum.NHistory){
        minHistory.shift();
        maxHistory.shift();
    }

    dataMin = Math.min(...minHistory);
    dataMax = Math.max(...maxHistory);
    
    if(GlobalSettings.spectrum.autoScaleV && !SerialDataObject.pauseFlag){
        var dataMinUpdate = 0;
        var dataMaxUpdate = 100;
        if(GlobalSettings.spectrum.logScale){
            dataMinUpdate = Math.floor(Math.log10(Math.abs(dataMin)));
            dataMaxUpdate = Math.ceil(Math.log10(Math.abs(dataMax)));
        }
        else{
            dataMinUpdate = -10;
            dataMaxUpdate = Math.log10(Math.ceil(nextPowerOf2(dataMax)/10)*10);
        }
   
        if(!isNaN(dataMinUpdate)){
            GlobalSettings.spectrum.pmin = dataMinUpdate;
        }
        if(!isNaN(dataMaxUpdate)){
            GlobalSettings.spectrum.pmax = dataMaxUpdate;
        }
    }
}
