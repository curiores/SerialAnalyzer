
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