import { GlobalSettings } from "./GlobalSettings.js";
import { SerialDataObject } from "./SerialData.js";

export function reformatData(xvec,yarray,yindex){
    // This creates data arrays of the form [{x:100,y:23.44},{x:100,y:23.44},...]
    // From the serial data
    var data = [];
    for(var k = 0; k < xvec.length; k++){
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
        
        GlobalSettings.timeSeries.ymin = Math.floor( (ymid - dyNext)/nearestValue)*nearestValue;
        GlobalSettings.timeSeries.ymax = Math.ceil( ( ymid + dyNext)/nearestValue)*nearestValue;
    }

}