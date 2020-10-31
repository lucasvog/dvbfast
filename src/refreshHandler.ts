



var currentRefreshState = 0;
var isCurrentlyLoading = false;
var intervallTimeInSeconds = 15
var refreshIntervall = setInterval(()=>{
    if(currentRefreshState>intervallTimeInSeconds||isCurrentlyLoading==true){
        currentRefreshState=0;
    }else{
        currentRefreshState+=1;
    }
    var progress = currentRefreshState/intervallTimeInSeconds;
    if(progress>=1){
     //   refreshInfos();
}
    updateRefreshButtonProgress(progress);
},1000)



async function refreshInfos(){
    isCurrentlyLoading=true;
    setSpinnerState("on");
    await initData();
    setSpinnerState("off");
    isCurrentlyLoading = false;
}

function setSpinnerState(state:"on"|"off"){
   var spinner =  document.getElementById("refreshSpinner");
    if(state=="on"){
        spinner.classList.add("spinning");
    }else{
        spinner.classList.remove("spinning");
    }
}

/**
 * Updates the gradient on the refresh button
 * @param progress in a range from 0 to 1
 */
function updateRefreshButtonProgress(progress:number){
    console.log("updating",progress)
    var refreshbutton = document.getElementById("refreshButton");
    if(progress>=1||progress<=0){
        refreshbutton.setAttribute("style","");
    }else{
    var progressCSS = generateProgressGradientString(progress);
    refreshbutton.setAttribute("style",progressCSS);
    }
}

/**
 * Generates a gradient from left to right that displays a progress
 * @param progress in a range from 0 to 1
 */
function generateProgressGradientString(progress:number){
    var progressInPercent = progress*100;
    var html = `background: linear-gradient(90deg, #ff8f00 0%, #f57c00 ${progressInPercent}%, #ff8f00 ${progressInPercent}%);`;
    return html;
}