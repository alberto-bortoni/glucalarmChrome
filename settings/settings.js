function saveFunction() {
    var tbaseString  = document.getElementById("baseUrl").value;
    var ttokenString = document.getElementById("tokenUrl").value;
    var turlString = "https://" + tbaseString + ".herokuapp.com/api/v1/entries/current/?token=" + ttokenString;
    var tdisplayBs = document.getElementById("displayBs").checked;

    //first do some token data verif.
    chrome.storage.local.set({'baseString': tbaseString, 'tokenString': ttokenString, 'targetUrl': turlString, 'iconBs': tdisplayBs},function() {
        console.log("Saved Data!!")
    });

    //to give immediate feedback change now with no value really
    if(tdisplayBs){
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
        context.fillText("NaN", 9, 6);
        context.fillText("--", 9, 15);
    
        chrome.browserAction.setIcon({
        imageData: context.getImageData(0, 0, 19, 19)
        });
    } else {
        chrome.browserAction.setIcon({
            path: {
                16:  "/../images/nightscout16.png",
                32:  "/../images/nightscout32.png",
                48:  "/../images/nightscout48.png",
                128: "/../images/nightscout128.png"
            }
        });
    }
}
/*----------------------------------------------------------------------------------------*/

document.getElementById("saveButton").addEventListener('click', onSaveClick, false)
    function onSaveClick () {
        console.log("User clicked save button.");
        saveFunction();
        document.getElementById("saveButton").blur();

        window.location.href = "/../popup.html";
}
/*----------------------------------------------------------------------------------------*/

document.getElementById("backButton").addEventListener('click', onBackClick, false)
    function onBackClick () {
        console.log("User clicked back button.");
        
        document.getElementById("backButton").blur();
        window.location.href = "/../popup.html";
        chrome.browserAction.setPopup({
            popup: "/../popup.html"
        });
}
/*----------------------------------------------------------------------------------------*/

window.onload = function() {
    console.log("loaded settings page");
    
    chrome.storage.local.get(["baseString","tokenString","iconBs"],function(data) {
        if(data.iconBs == undefined && data.baseString == undefined && data.tokenString == undefined) {
            document.getElementById("displayBs").checked = false;
            document.getElementById("baseUrl").value = "";
            document.getElementById("tokenUrl").value = "";
            console.log("No data avail for saved items.");
            return;
        } else {
            document.getElementById("displayBs").checked = data.iconBs;
            document.getElementById("baseUrl").value = data.baseString;
            document.getElementById("tokenUrl").value = data.tokenString;
            console.log("Retrieved values -- Base: " + data.baseString + ", Token: " +data.tokenString + ", display BS on Icon: " + data.iconBs)
        }
    });
}
/*----------------------------------------------------------------------------------------*/