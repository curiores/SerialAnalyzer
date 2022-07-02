import { GlobalSettings } from "./GlobalSettings.js";
import { SerialDataObject } from "./SerialData.js";

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

    if(GlobalSettings.timeSeries.autoScale){
        // Min and max of y
        var ymin = Math.min(...SerialDataObject.data.flat());
        var ymax = Math.max(...SerialDataObject.data.flat());
        // Give it some standardized space
        var ymid = (ymax+ymin)/2;
        var dy = ymax - ymid;
        var dyNext = nextPowerOf2(dy);
        var nearestValue = 1;
        if(dy > 2){
            nearestValue = 5;
        }
        var yminUpdate = Math.floor( (ymid - dyNext)/nearestValue)*nearestValue;
        var ymaxUpdate = Math.ceil( ( ymid + dyNext)/nearestValue)*nearestValue;

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
    
    if(GlobalSettings.spectrum.autoScaleV){
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
