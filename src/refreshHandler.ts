
var intervallTimeInSeconds = 20; //time in seconds for the auto-refresh

var isDisabled = false;
var isCurrentlyLoading = false;
var currentRefreshState = 0; 

/**
 * Intervall that handles the progress of the auto refresh.
 */
var refreshIntervall = setInterval(() => {
    if (getIfAutorefreshIsEnabled() == false) {
        isDisabled = true;
    } else {
        isDisabled = false;
    }
    if (currentRefreshState > intervallTimeInSeconds || isCurrentlyLoading == true || isDisabled == true) {
        currentRefreshState = 0;
    } else {
        currentRefreshState += 1;
    }
    var progress = currentRefreshState / intervallTimeInSeconds;
    if (progress >= 1) {
        refreshInfos();
    }
    updateRefreshButtonProgress(progress);
}, 1000)


/**
 * returns the switch state of auto refresh
 */
function getIfAutorefreshIsEnabled() {
    var disabledButton: any = document.getElementById("autorefreshSwitch");
    return disabledButton.checked;
}

/**
 * calling this function results in a renewal of the displayed data.
 */
async function refreshInfos() {
    if (isCurrentlyLoading == true) {
        return;
    }
    var thisTimeout = setTimeout(() => {
        isCurrentlyLoading = false;
    }, 120000);//two minutes
    isCurrentlyLoading = true;
    setSpinnerState("on");
    await initData();
    setSpinnerState("off");
    clearTimeout(thisTimeout);
    isCurrentlyLoading = false;
}

/**
 * Sets the state of the icon in the refresh-button
 * @param state state of the spinner
 */
function setSpinnerState(state: "on" | "off") {
    var spinner = document.getElementById("refreshSpinner");
    if (state == "on") {
        spinner.classList.add("spinning");
    } else {
        spinner.classList.remove("spinning");
    }
}

/**
 * Sets the state of the switch that toggles the auto refresh
 * @param state state of the switch
 */
function setAutoRefreshSwitchState(state:"on"|"off"){
   var thisSwitch:any = document.getElementById("autorefreshSwitch");
if(state=="on"){
    thisSwitch.checked  =true;
}else{
    thisSwitch.checked = false;
}
}

/**
 * Updates the gradient on the refresh button
 * @param progress in a range from 0 to 1
 */
function updateRefreshButtonProgress(progress: number) {
    var refreshbutton = document.getElementById("refreshButton");
    if (progress >= 1 || progress <= 0) {
        refreshbutton.setAttribute("style", "");
    } else {
        var progressCSS = generateProgressGradientString(progress);
        refreshbutton.setAttribute("style", progressCSS);
    }
}

/**
 * Generates a gradient from left to right that displays a progress
 * @param progress in a range from 0 to 1
 */
function generateProgressGradientString(progress: number) {
    var progressInPercent = progress * 100;
    var html = `background: linear-gradient(90deg, #ff8f00 0%, #f57c00 ${progressInPercent}%, #ff8f00 ${progressInPercent}%);`;
    return html;
}