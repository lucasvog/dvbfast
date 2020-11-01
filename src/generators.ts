const departureLimit = 6;


/**
 * Generates the HTML for a station including the departures
 * @param station station for the box
 * @param departuresContainer departure-element from the VVO API
 * @returns HTML
 */
function generateBox(station: rawDataStationElement, departuresContainer: DepartureContainer): string {
    const title = generateTitleHTML(station);
    let departuresHTML = "";
    let departures = departuresContainer.Departures;
    let thisDepartureLimit = 0;
    if(departures===undefined){
        return "";
    }
    for (const departure of departures) {
        if (thisDepartureLimit < departureLimit) {
            departuresHTML += generateDepartureHTML(departure);
        }
        thisDepartureLimit += 1;
    }
    let html = `
    <div class="col s12 m12 l6">
    <div class="card">
        ${title}
        ${departuresHTML}
    </div>
    </div>`
    return html;
}


/**
 * Generates the title HTML of a station
 * @param station station to generate html from
 */
function generateTitleHTML(station: rawDataStationElement) {
    const title = station.na;
    const distance = generateDistanceString(station.distance) || "unbekannt";
    const time = "null"
    let html = `
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

/**
 * Generates all departures as HTML
 * @param departure departure-element from the VVO API
 * @returns html
 */
function generateDepartureHTML(departure: Departure): string {
    const lineNumber = departure.LineName;
    const target = departure.Direction;
    const unparsedTimeStamp = departure.RealTime || departure.ScheduledTime;
    const time = generateClockTimeStringFromUnparsedUTCTimestamp(unparsedTimeStamp);
    let steig = "";
    const iconClass = calculateLineClassName(departure);
    try {
        steig = "Steig " + departure.Platform.Name;
    } catch (e) {
        steig = ""
    }
    let departureStatus = calculateDepartureStatus(departure);
    if(departureStatus===undefined||departureStatus==="undefined"){
        departureStatus = "Unbekannter Zustand";
    }
    let html = `
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

/**
 * Generates a class name from the mode of transport (MOT)
 * @param departure departure-Element from the VVO-API
 * @returns class-name
 */
function calculateLineClassName(departure: Departure): string {
    let returnClassValue = "bus";
    if (departure.Mot == undefined || departure.Mot == null || departure.Mot == "") {
        return returnClassValue;
    }
    const mot = departure.Mot;

    switch (mot) {
        case "Fähre":
            returnClassValue = "faehre";
            break;
        case "Ferry":
            returnClassValue = "faehre";
            break;
        case "S-Bahn":
            returnClassValue = "sbahn";
            break;
        case "SuburbanRailway":
            returnClassValue = "sbahn";
            break;

        case "Seil-/Schwebebahn":
            returnClassValue = "schwebebahn";
            break;
        case "Cableway":
            returnClassValue = "schwebebahn";
            break;
        case "Straßenbahn":
            returnClassValue = "strassenbahn";
            break;
        case "Tram":
            returnClassValue = "strassenbahn";
            break;
        case "Zug":
            returnClassValue = "zug";
            break;
        case "Train":
            returnClassValue = "zug";
            break;
        case "HailedSharedTaxi":
            returnClassValue = "taxi";
            break;
    }
    return returnClassValue;
}

/**
 * Calculates if the departure is on time, otherwise display the delay and sheduled plan
 * @param departure departure-Element from the VVO-API
 */
function calculateDepartureStatus(departure: Departure) {
    console.log(departure);
    const onTime = '<i class="material-icons-smaller onTime">check_circle</i>pünktlich';
    const unknown = '';
    const delayStart = '<i class="material-icons-smaller delayed">warning</i><span class="delayedText">';
    const delayEnd = "</span>"
    const toEarlyStart = '<i class="material-icons-smaller onTime">warning</i><span class="delayedText">';
    const unit = " min."
    const sheduledIcon = '<i class="material-icons-smaller delayIcon">wysiwygy</i>'
    const canceledHTML = '<i class="material-icons-smaller cancelIcon">cancel</i><span class="delayedText">Fällt aus</span>'
    if (departure.State == undefined) {
        return unknown;
    }
    if (departure.State === "InTime") {
        return onTime;
    }
    if(departure.State === "Cancelled"){
return canceledHTML;
    }
    const realTime = generateUTCStringFromUnparsedTimestamp(departure.RealTime || departure.ScheduledTime);
    const scheduledTime = generateUTCStringFromUnparsedTimestamp(departure.ScheduledTime);
    if (realTime == null || scheduledTime == null) {
        return unknown;
    }
    if (realTime !== scheduledTime) {
        let timeDifference = realTime - scheduledTime;
        let minutes = generateMinutesFromMilliseconds(timeDifference);
        if (timeDifference > 0) {//later
            const sheduledTimeString = generateHoursAndMinutesFromUtcDateString(scheduledTime);
            return delayStart + "+" + Math.abs(minutes).toString() + unit + " " + sheduledIcon + sheduledTimeString + " Uhr" + delayEnd;
        } else {//earlier
            const sheduledTimeString = generateHoursAndMinutesFromUtcDateString(scheduledTime);
            return toEarlyStart + "+" + Math.abs(minutes).toString() + unit + " " + sheduledIcon + sheduledTimeString + " Uhr" + delayEnd;
        }

    }
}

/**
 * Converts milliseconds to minutes
 * @param milliseconds milliseconds to calculate from
 */
function generateMinutesFromMilliseconds(milliseconds: number | string): number {
    if (typeof milliseconds == "string") {
        milliseconds = parseInt(milliseconds);
    }
    const minutes = milliseconds / 1000 / 60;
    return minutes;
}

/**
 * Generates a time string in Form 00:00 from a VVO API endpoint Date
 * @param unparsedTimestamp string from the VVO API like /Date(1604085840000-0000)/
 * @returns timestring onf form 00:00 or XX:XX 
 */
function generateClockTimeStringFromUnparsedUTCTimestamp(unparsedTimestamp: string): string {
    if (unparsedTimestamp == undefined || unparsedTimestamp == null || unparsedTimestamp === "") {
        return "XX:XX"
    }
    const dvbDate = generateUTCStringFromUnparsedTimestamp(unparsedTimestamp);
    if (dvbDate == null) {
        return "XX:XX"
    }
    return generateHoursAndMinutesFromUtcDateString(dvbDate);

}

/**
 * Generates a Time String in Form 00:00 from a utc timestamp
 * @param date a number in utc time format
 * @returns timestring onf form 00:00 or XX:XX 
 */
function generateHoursAndMinutesFromUtcDateString(date: number): string {
    try {
        let thisDate = new Date(date);
        let returnString = "";
        returnString += ('0' + thisDate.getHours()).substr(-2);
        returnString += ":"
        returnString += ('0' + thisDate.getMinutes()).substr(-2);
        return returnString;
    } catch (e) {
        return "XX:XX"
    }
}


/**
 * Generates a utc timestamp 
 * @param utcString String of unparsed DVB-String format, like /Date(1604085840000-0000)/
 */
function generateUTCStringFromUnparsedTimestamp(utcString: string): number | null {
    const dvbDateRegex = /\/Date\((\d+)-\d*\)\//g;
    const dateMatch = dvbDateRegex.exec(utcString);
    if (dateMatch == null || dateMatch.length != 2) {
        return null;
    }
    const returnValue = dateMatch[1]
    return parseInt(returnValue);
}

/**
 * Generates a short string describing the distance in km or m
 * @param distance in non-rounded km format 
 */
function generateDistanceString(distance: number): string {
    try {
        if (distance > 1) {
            const roundedDistanceString = (Math.round(distance * 100) / 100).toString().substr(0, 4);
            return roundedDistanceString + "km";
        } else {
            const roundedDistanceString = (Math.round(distance * 1000)).toString();

            return roundedDistanceString + "m";
        }

    } catch (e) {
        return ""
    }
}