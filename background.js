var queryInts  = 10;
var currBs     = '---';
var currDrop   = 'nan';
var currTime   = 'nan';
var iconText   = '---';
var errorCode  = 0;


chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.local.set({'errorCode': errorCode,'currTime': currTime,'currBs': currBs,'currDrop': currDrop},function() {
        console.log("Saved -- errorCode: " + errorCode + " fetch Time: " + currTime + " currentBS: " + currBs + " current Drop: " + currDrop);
    });
});
/*----------------------------------------------------------------------------------------*/


setInterval(webRequest, queryInts * 1000);
/*----------------------------------------------------------------------------------------*/

function webRequest(callbackFunc,fullChart) {
    chrome.storage.local.get("targetUrl", function(data) {
        if(chrome.runtime.lastError) {
            errorCode = 1;
            webError();
            return;
        }
        targetUrl = data.targetUrl;

        var xhr = new XMLHttpRequest();
        xhr.open("GET", targetUrl, true);

        xhr.onerror = function(e) {
            errorCode = 3;
            webError();
        };

        xhr.onload = function(e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    parseBsData(xhr.responseText);
                    setTextIcon();
                    saveBsData();
                    return;
                } else {
                    errorCode = 2;
                    webError();
                }
            }
        };

        xhr.send(null);
    });
}
/*----------------------------------------------------------------------------------------*/

function parseBsData(rawString){
    try{
        //split data by tab separator
        var tparts = rawString.split("\t");

        //get time and trow error if lag is more than 20 min
        var tstr = tparts[0];
        currTime = tstr.substring(1,tstr.length-1);

        let tdatetime = new Date(currTime);
        let tnowtime  = new Date();

        if(Math.round(((tnowtime - tdatetime)/1000)/60) > 20){
            errorCode = 6;
            webError();
            return;
        }
        
        //get BS and make sure it is a number from 20-500
        currBs   = tparts[2];
        if(currBs<=20 && currBs>=500){
            errorCode = 7;
            webError();
            return;
        }

        //make sure that we can parse the drop
        currDrop = arrowValues(tparts[3].substr(1).slice(0,-1));
        if(currDrop == ""){
            errorCode = 8;
            webError();
            return;
        }
        
        //if we reach this far, things are good
        errorCode = 0;
        webError();

    }
    catch {
        errorCode = 5;
        webError();
    }
}
/*----------------------------------------------------------------------------------------*/

function setTextIcon(){
    chrome.storage.local.get("iconBs", function(data) {
        if(chrome.runtime.lastError) {
            errorCode = 4;
            webError();
            iconBs = false;
        }
        else {
            iconBs = data.iconBs;
        }

        if (iconBs && errorCode == 0) {
            var canvas    = document.createElement('canvas'); 
            canvas.width  = 19;
            canvas.height = 19;
    
            var context = canvas.getContext('2d');
            context.fillStyle = "#222f3c";
            context.fillRect(0, 0, 19, 19);
    
            context.fillStyle    = "#FFFFFF";
            context.textAlign    = "center";
            context.textBaseline = "middle";
            context.font         = "10px Arial";
            context.fillText(currBs, 9, 6);
            context.fillText(currDrop, 9, 15);
    
            chrome.browserAction.setIcon({
            imageData: context.getImageData(0, 0, 19, 19)
            });
        }
        else {
            chrome.browserAction.setIcon({
                path: {
                    16:  "images/nightscout16.png",
                    32:  "images/nightscout32.png",
                    48:  "images/nightscout48.png",
                    128: "images/nightscout128.png"
                }
            });
        }
    });
}
/*----------------------------------------------------------------------------------------*/

function saveBsData(){
    chrome.storage.local.set({'errorCode': errorCode,'currTime': currTime,'currBs': currBs,'currDrop': currDrop},function() {
        console.log("Saved -- errorCode: " + errorCode + " fetch Time: " + currTime + " currentBS: " + currBs + " current Drop: " + currDrop);
    });
}
/*----------------------------------------------------------------------------------------*/

function arrowValues(direction) {
    var exportString = "";
    switch (direction) {
        case "DoubleUp":
            exportString = "↑↑"
            break;
        case "SingleUp":
            exportString = "↑"
            break;
        case "FortyFiveUp":
            exportString = "↗"
            break;
        case "Flat":
            exportString = "→"
            break;
        case "FortyFiveDown":
            exportString = "↘"
            break;
        case "SingleDown":
            exportString = "↓"
            break;
        case "DoubleDown":
            exportString = "↓↓"
            break;
    }
    return exportString;
}
/*----------------------------------------------------------------------------------------*/

function webError() {
    switch (errorCode) {
        case 0:
            break;
        case 1:
            console.log("ERROR: Cannot retrieve (or does not exist) target URL! CODE: " + errorCode);
            break;
        case 2:
            console.log("ERROR: Target URL reached but unsuccesfuly. CODE: " + errorCode);
            break;
        case 3:
            console.log("ERROR: Target URL could not be reached. CODE: " + errorCode);
            break;
        case 4:
            console.log("ERROR: Cant retrieve setting for icon display. CODE: " + errorCode);
            break;
        case 5:
            console.log("ERROR: Cant parse data from site. CODE: " + errorCode);
            break;
        case 6:
            console.log("ERROR: Fetched data is older than 20 min. CODE: " + errorCode);
            break;
        case 7:
            console.log("ERROR: Fetched BS seems not to match the expected value range. CODE: " + errorCode);
            break;
        case 8:
            console.log("ERROR: Fetched BS Drop seems not to match the expected values. CODE: " + errorCode);
            break;
        default:
            console.log("ERROR: Something happened but this error is not registered? CODE: " + errorCode);
            break;
    }

    chrome.storage.local.set({'errorCode': errorCode});
}
/*----------------------------------------------------------------------------------------*/