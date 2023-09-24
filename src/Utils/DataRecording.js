import * as path from 'path';
import { GlobalSettings } from "./GlobalSettings.js";

const { ipcRenderer } = window.require('electron');

function getTruncatedDateString(){
    let date = new Date();
    let isoDateString = date.toISOString();
    let dateString = isoDateString.substring(0,10);
    return dateString;
}

function getOutputFilename(index){
    let dateTimeString = getTruncatedDateString();
    let fileIndexString = index.toString().padStart(3, '0');
    let filename = dateTimeString + "_Rec" + fileIndexString + ".txt";
    return filename;
}

function getOutputFilenameWithPath(index){
    return path.join(GlobalSettings.record.directory,getOutputFilename(index));
}

export async function setNextOutputFilename(){
    let index = 1;
    while( await ipcRenderer.invoke('fse','existsSync',getOutputFilenameWithPath(index)) ) {
        index = index+1;
        if(index > 10000){
            break;
        }
    }
    GlobalSettings.record.outputFilename = getOutputFilename(index);
}

export async function selectOutputDirectory(){
    const selectedDirectory = await ipcRenderer.invoke('dialog','showOpenDialog',{ properties: ['openDirectory'] });
    if(!selectedDirectory.canceled && (selectedDirectory.filePaths.length > 0)){
        GlobalSettings.record.directory = selectedDirectory.filePaths[0];
    }
}

export function writeDataIfRecording(data){
    try{
        if(GlobalSettings.record.recording && GlobalSettings.record.directory !== null){
            let filename = path.join(GlobalSettings.record.directory,GlobalSettings.record.outputFilename);
            let dataWithNewline = data + "\r\n";
            ipcRenderer.invoke('fse','appendFile',filename,dataWithNewline);
        }
    }
    catch(e){
       console.log("data recording error...")
       console.log(e);
    }
}