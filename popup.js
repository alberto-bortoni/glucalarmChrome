var timerPop = setTimeout(function () {
    //window.close();
}, 5000);
/*----------------------------------------------------------------------------------------*/

document.getElementById("gearButton").addEventListener('click', onclick, false)
    function onclick () {
        console.log("User clicked settings button.");
        document.getElementById("gearButton").blur();
        clearTimeout(timerPop);
        window.location.href = "settings/settings.html";
}
/*----------------------------------------------------------------------------------------*/

function noDataDisplay(){
    document.getElementById("bsText").innerHTML   = "NoDat";
    document.getElementById("dropText").innerHTML = "--";
    document.getElementById("timeText").innerHTML = "Can't load data, click on '?' for solutions.";
}
/*----------------------------------------------------------------------------------------*/


window.onload = function() {
    chrome.storage.local.get(["errorCode", "currBs", "currDrop", "currTime"], function(data) {
        if(data.errorCode == undefined) {
            console.log("Cannot retrieve error code.");
            noDataDisplay();
            return;
        } else if(data.currBs == undefined) {
            console.log("Cannot retrieve data avail for currentBS.");
            noDataDisplay();
            return;
        } else if(data.currDrop == undefined) {
            console.log("Cannot retrieve data avail for current Drop.");
            noDataDisplay();
            return;
        } else if(data.currTime == undefined) {
            console.log("Cannot retrieve data avail for fetch Time.");
            noDataDisplay();
            return;
        } else if(data.errorCode != 0){
            //Data retrieved, now deal with errors if any.
            document.getElementById("bsText").innerHTML   = "Err";
            document.getElementById("dropText").innerHTML = data.errorCode;
            document.getElementById("timeText").innerHTML = "Click on '?' for error codes.";
        } else{
            //Nothing here! ready to display as long as data is still relevant
            let tdatetime = new Date(data.currTime);
            let tnowtime  = new Date();
            var tdiff = Math.round(((tnowtime - tdatetime)/1000)/60);

            if(tdiff < 20){
                document.getElementById("bsText").innerHTML   = data.currBs;
                document.getElementById("dropText").innerHTML = data.currDrop;
                document.getElementById("timeText").innerHTML = "Fetched about " + tdiff + " min ago.";
            } else {
                document.getElementById("bsText").innerHTML   = "Err";
                document.getElementById("dropText").innerHTML = "6"; //TODO -- hard coded
                document.getElementById("timeText").innerHTML = "Click on '?' for error codes.";
            }

            console.log("BS: " + data.currBs + ", Drop: " + data.currDrop + ", Time: " + tdatetime);
        }
    });
}
/*----------------------------------------------------------------------------------------*/