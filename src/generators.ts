var departureLimit = 6;

function generateBox(station: rawDataStationElement, departuresContainer: DepartureContainer) {
    var title = generateTitleHTML(station);
    var departuresHTML = "";
    var departures = departuresContainer.Departures;
    var thisDepartureLimit  = 0;
    for (const departure of departures) {
        if(thisDepartureLimit<departureLimit){
        departuresHTML += generateDepartureHTML(departure);
        }
        thisDepartureLimit +=1;
    }
    var html = `
    <div class="col s12 m12 l6">
    <div class="card">
    ${title}
    ${departuresHTML}
  </div>
  </div>
  `
    return html;
}


function generateTitleHTML(station: rawDataStationElement) {
    var title = station.na;
    var distance = generateDistanceString(station.distance) || "unbekannt";
    var time = "null"
    var html = `
<div class="stationTitle amber">
<div class="row noBottomMargin verticalContainer">
<div class="col s12 m12 l12 overflowHorizontalScroll">
  <h6 class="noMargin flow-text"><i class="material-icons-smaller grey-text text-darken-4">location_on</i>${title}</h6>
  <small>Distanz: ${distance}</small>
</div>
</div>
</div>`;
    return html;
}

function generateDepartureHTML(departure: Departure) {
    var lineNumber = departure.LineName;
    var target = departure.Direction;
    var unparsedTimeStamp = departure.RealTime||departure.ScheduledTime;
    var time = generateClockTimeStringFromUnparsedUTCTimestamp(unparsedTimeStamp);
    var steig = "";
    var iconClass = calculateLineClassName(departure);
    try{
        steig = "Steig "+departure.Platform.Name;
    }catch(e){
        steig = ""
    }
    var departureStatus = calculateDepartureStatus(departure);
    //var timeDifference = 
    var html = `
    <div class="tripContainer verticalContainer">
      <div class="row noMargin">
      <div class="col s2 m2 l2">
        <div class="tripIcon verticalMiddle ${iconClass}">
          ${lineNumber}
        </div>
      </div>
      <div class="col s5 m5 l7 tripDestination">
        <h6 class="noMargin">${target}</h6>
        <small>${steig}</small>
      </div>
      <div class="col s5 m5 l3 tripDestination">
        <h6 class="noMargin">${time} Uhr</h6>
        <small>${departureStatus}</small>
      </div>
    </div>
    </div>
    `;
    return html
}

function calculateLineClassName(departure:Departure){
    var returnClassValue = "bus";
    if(departure.Mot==undefined||departure.Mot==null||departure.Mot==""){
        return returnClassValue;
    }
    var mot = departure.Mot;
    
    switch(mot) {
        case "Fähre":
          returnClassValue="faehre";
          break;
          case "Ferry":
          returnClassValue="faehre";
          break;
          case "S-Bahn":
            returnClassValue="sbahn";
            break;
            case "SuburbanRailway":
            returnClassValue="sbahn";
            break;
            
            case "Seil-/Schwebebahn":
          returnClassValue="schwebebahn";
          break;
          case "Cableway":
              returnClassValue = "schwebebahn";
              break;
          case "Straßenbahn":
          returnClassValue="strassenbahn";
          break;
          case "Tram":
          returnClassValue="strassenbahn";
          break;
          case "Zug":
          returnClassValue="zug";
          break;
          case "Train":
          returnClassValue="zug";
          break;
          case "HailedSharedTaxi":
          returnClassValue = "taxi";
          break;
      } 
return returnClassValue;

// ["Fähre","Fähre"],
// ["Regionalbus","Regionalbus"],
// ["Rufbus","Rufbus"],
// ["S-Bahn","S-Bahn"],
// ["Seil-/Schwebebahn","Seil-/Schwebebahn"],
// ["Stadtbus","Stadtbus"],
// ["Straßenbahn","Straßenbahn"],["Zug","Zug"]]
}


function calculateDepartureStatus(departure:Departure){
    var onTime = '<i class="material-icons-smaller onTime">check_circle</i>pünktlich';
    var unknown = '';
    var delayStart = '<i class="material-icons-smaller delayed">warning</i><span class="delayedText">';
    var delayEnd = "</span>"
    var toEarlyStart = '<i class="material-icons-smaller onTime">warning</i><span class="delayedText">';
    var unit = " min."
    var sheduledIcon ='<i class="material-icons-smaller delayIcon">wysiwygy</i>'
    if(departure.State==undefined){
        return unknown;
    }
    if(departure.State==="InTime"){
        return onTime;
    }
    var realTime = generateUTCStringFromUnparsedTimestamp(departure.RealTime||departure.ScheduledTime);
    var scheduledTime = generateUTCStringFromUnparsedTimestamp(departure.ScheduledTime);
    if(realTime==null||scheduledTime==null){
        return unknown;
    }
    if(realTime!==scheduledTime){
        var timeDifference = realTime-scheduledTime; 
        var minutes = generateMinutesFromMiliseconds(timeDifference);
        if(timeDifference>0){//later
            var sheduledTimeString = generateHoursAndMinutesFromUtcDateString(scheduledTime);
                return delayStart+"+"+Math.abs(minutes).toString()+unit+" "+sheduledIcon+sheduledTimeString+" Uhr"+delayEnd;
        }else{
            return toEarlyStart+"+"+Math.abs(minutes).toString()+unit+" "+sheduledIcon+sheduledTimeString+" Uhr"+delayEnd;
        }
        
    }
}


function generateMinutesFromMiliseconds(miliseconds:number|string):number{
    if(typeof miliseconds =="string"){
        miliseconds = parseInt(miliseconds);
    }
    var minutes = miliseconds/1000/60;
    return minutes;
}

function generateClockTimeStringFromUnparsedUTCTimestamp(unparsedTimestamp:string):string{
    if(unparsedTimestamp==undefined||unparsedTimestamp==null||unparsedTimestamp===""){
        return "XX:XX"
    }
    var dvbDate = generateUTCStringFromUnparsedTimestamp(unparsedTimestamp);
    if(dvbDate ==null){
        return "XX:XX"
    }
    return  generateHoursAndMinutesFromUtcDateString(dvbDate);

}

function generateHoursAndMinutesFromUtcDateString(date:number):string{
    try{
        var thisDate = new Date(date);
        var returnString = "";
        returnString+=('0'+thisDate.getHours()).substr(-2);
        returnString+=":"
        returnString+=('0'+thisDate.getMinutes()).substr(-2);
        return returnString;
    }catch(e){
        return "XX:XX"
    }
}


/**
 * Generates a 
 * @param utcString String of unparsed DVB-String format, like /Date(1604085840000-0000)/
 */
function generateUTCStringFromUnparsedTimestamp (utcString:string):number|null{
    var dvbDateRegex = /\/Date\((\d+)-\d*\)\//g;
    var dateMatch = dvbDateRegex.exec(utcString);
    if(dateMatch==null||dateMatch.length!=2){
        return null;
    }
    var returnValue = dateMatch[1]
    return parseInt(returnValue);
}

function generateDistanceString(distance:number):string{
    var returnString = "";
    try{
    //var roundedDistance = distance*1000;//Meters
    if(distance>1){
    var roundedDistanceString = (Math.round(distance*100)/100).toString().substr(0,4);
    return roundedDistanceString+"km";
    }else{
        var roundedDistanceString = (Math.round(distance*1000)).toString();

        return roundedDistanceString+"m";
    }
    
    }catch(e){
        return ""
    }
}