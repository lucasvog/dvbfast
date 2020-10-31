var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var data = [];
function initStationsData() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var localData, cacheResult;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                localData = readStorage("data", true);
                                if (!(localData == undefined || localData == null)) return [3, 2];
                                return [4, asynchronouslyUpdateCache()];
                            case 1:
                                cacheResult = _a.sent();
                                resolve(cacheResult);
                                return [2];
                            case 2:
                                data = localData;
                                asynchronouslyUpdateCache();
                                resolve(true);
                                return [2];
                        }
                    });
                }); })];
        });
    });
}
function asynchronouslyUpdateCache() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var thisData;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, get("./assets/data/data.json")];
                            case 1:
                                thisData = _a.sent();
                                if (thisData == undefined || thisData == null) {
                                    showPush("Es ist ein Fehler beim Laden der Haltestellen aufgetreten.");
                                    resolve(false);
                                    return [2];
                                }
                                data = thisData;
                                setStorage("data", thisData, true);
                                resolve(true);
                                return [2];
                        }
                    });
                }); })];
        });
    });
}
function setStorage(key, value, isJSON) {
    if (isJSON === void 0) { isJSON = false; }
    if (isJSON) {
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}
function readStorage(key, isJSON) {
    if (isJSON === void 0) { isJSON = false; }
    try {
        var value = localStorage.getItem(key);
        if (isJSON == true) {
            value = JSON.parse(value);
        }
        return value;
    }
    catch (e) {
        return null;
    }
}
function findCloseStations(lat1, long1, radius) {
    if (radius === void 0) { radius = 0.4; }
    var results = [];
    for (var elementKey in data) {
        var element = data[elementKey];
        var distance = findDistance(lat1, long1, parseFloat(element.lat), parseFloat(element.lon));
        if (distance < radius) {
            element.distance = distance;
            results.push(element);
        }
    }
    var sortedResults = sortLocationsByDistance(results);
    return sortedResults;
}
function sortLocationsByDistance(elements) {
    try {
        var returnElements = elements.sort(function (a, b) { return a.distance - b.distance; });
        return returnElements;
    }
    catch (e) {
        return elements;
    }
}
var Rk = 6373;
function findDistance(latitude1, longitude1, latitude2, longitude2) {
    var lat1 = degree2rad(latitude1);
    var lon1 = degree2rad(longitude1);
    var lat2 = degree2rad(latitude2);
    var lon2 = degree2rad(longitude2);
    var dlat = lat2 - lat1;
    var dlon = lon2 - lon1;
    var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var dk = c * Rk;
    return dk;
}
function degree2rad(deg) {
    var rad = deg * Math.PI / 180;
    return rad;
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setAutoRefreshSwitchState("off");
                    M.AutoInit();
                    return [4, initStationsData()];
                case 1:
                    _a.sent();
                    return [4, initData()];
                case 2:
                    _a.sent();
                    setAutoRefreshSwitchState("on");
                    initialLoad = false;
                    return [2];
            }
        });
    });
}
init();
var closeStations = [];
function initData() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4, getCloseStations()];
                            case 1:
                                closeStations = _a.sent();
                                return [4, updateHTMLWithDepartures()];
                            case 2:
                                _a.sent();
                                resolve(true);
                                return [2];
                        }
                    });
                }); })];
        });
    });
}
function getCloseStations() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var position, e_1, closeStations;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                position = null;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, getPosition()];
                            case 2:
                                position = _a.sent();
                                return [3, 4];
                            case 3:
                                e_1 = _a.sent();
                                console.log(e_1);
                                if (e_1.code == 1) {
                                    showPush("Fehler: Berechtigung nicht erteilt. Bitte lassen Sie die Standorterkennung zu, damit Stationen in der Nähe erkannt werden können. ", 10000);
                                    return [2];
                                }
                                if (e_1.code == 2) {
                                    showPush("Fehler: Positionserkennung aktuell nicht verfügbar.", 10000);
                                    return [2];
                                }
                                showPush("Fehler: " + e_1.code, 5000);
                                return [2];
                            case 4:
                                if (position == null) {
                                    showPush("Standort kann nicht bestimmt werden.");
                                    return [2];
                                }
                                closeStations = findCloseStations(position.coords.latitude, position.coords.longitude);
                                if (closeStations == undefined || closeStations == null) {
                                    showPush("Stationen in der konntent nicht gefunden werden.");
                                    return [2];
                                }
                                if (closeStations.length <= 0) {
                                    showPush("Keine Stationen in dem Radius gefunden.");
                                    return [2];
                                }
                                resolve(closeStations);
                                return [2];
                        }
                    });
                }); })];
        });
    });
}
function updateHTMLWithDepartures() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var html, _i, closeStations_1, station, departures, target;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                html = "";
                                _i = 0, closeStations_1 = closeStations;
                                _a.label = 1;
                            case 1:
                                if (!(_i < closeStations_1.length)) return [3, 4];
                                station = closeStations_1[_i];
                                return [4, getDeparturesOfStation(station)];
                            case 2:
                                departures = _a.sent();
                                if (departures == undefined || departures == null) {
                                    showPush("Fehler beim Laden der nächsten Verbindungen.");
                                    resolve(false);
                                    return [2];
                                }
                                html += generateBox(station, departures);
                                _a.label = 3;
                            case 3:
                                _i++;
                                return [3, 1];
                            case 4:
                                target = document.getElementById("boxcontainer");
                                if (target == null) {
                                    showPush("Interner Fehler.");
                                    resolve(false);
                                    return [2];
                                }
                                target.innerHTML = html;
                                resolve(true);
                                return [2];
                        }
                    });
                }); })];
        });
    });
}
function showPush(message, displayLength) {
    if (displayLength === void 0) { displayLength = 4000; }
    M.toast({ html: message, displayLength: displayLength });
}
var departureLimit = 6;
function generateBox(station, departuresContainer) {
    var title = generateTitleHTML(station);
    var departuresHTML = "";
    var departures = departuresContainer.Departures;
    var thisDepartureLimit = 0;
    if (departures === undefined) {
        return "";
    }
    for (var _i = 0, departures_1 = departures; _i < departures_1.length; _i++) {
        var departure = departures_1[_i];
        if (thisDepartureLimit < departureLimit) {
            departuresHTML += generateDepartureHTML(departure);
        }
        thisDepartureLimit += 1;
    }
    var html = "\n    <div class=\"col s12 m12 l6\">\n    <div class=\"card\">\n        " + title + "\n        " + departuresHTML + "\n    </div>\n    </div>";
    return html;
}
function generateTitleHTML(station) {
    var title = station.na;
    var distance = generateDistanceString(station.distance) || "unbekannt";
    var time = "null";
    var html = "\n            <div class=\"stationTitle amber\">\n            <div class=\"row noBottomMargin verticalContainer\">\n            <div class=\"col s12 m12 l12 overflowHorizontalScroll\">\n            <h6 class=\"noMargin flow-text\"><i class=\"material-icons-smaller grey-text text-darken-4\">location_on</i>" + title + "</h6>\n            <small>Distanz: " + distance + "</small>\n            </div>\n            </div>\n            </div>";
    return html;
}
function generateDepartureHTML(departure) {
    var lineNumber = departure.LineName;
    var target = departure.Direction;
    var unparsedTimeStamp = departure.RealTime || departure.ScheduledTime;
    var time = generateClockTimeStringFromUnparsedUTCTimestamp(unparsedTimeStamp);
    var steig = "";
    var iconClass = calculateLineClassName(departure);
    try {
        steig = "Steig " + departure.Platform.Name;
    }
    catch (e) {
        steig = "";
    }
    var departureStatus = calculateDepartureStatus(departure);
    var html = "\n    <div class=\"tripContainer verticalContainer\">\n      <div class=\"row noMargin\">\n      <div class=\"col s2 m2 l2\">\n        <div class=\"tripIcon verticalMiddle " + iconClass + "\">\n          " + lineNumber + "\n        </div>\n      </div>\n      <div class=\"col s5 m5 l7 tripDestination\">\n        <h6 class=\"noMargin\">" + target + "</h6>\n        <small>" + steig + "</small>\n      </div>\n      <div class=\"col s5 m5 l3 tripDestination\">\n        <h6 class=\"noMargin\">" + time + " Uhr</h6>\n        <small>" + departureStatus + "</small>\n      </div>\n    </div>\n    </div>\n    ";
    return html;
}
function calculateLineClassName(departure) {
    var returnClassValue = "bus";
    if (departure.Mot == undefined || departure.Mot == null || departure.Mot == "") {
        return returnClassValue;
    }
    var mot = departure.Mot;
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
function calculateDepartureStatus(departure) {
    var onTime = '<i class="material-icons-smaller onTime">check_circle</i>pünktlich';
    var unknown = '';
    var delayStart = '<i class="material-icons-smaller delayed">warning</i><span class="delayedText">';
    var delayEnd = "</span>";
    var toEarlyStart = '<i class="material-icons-smaller onTime">warning</i><span class="delayedText">';
    var unit = " min.";
    var sheduledIcon = '<i class="material-icons-smaller delayIcon">wysiwygy</i>';
    if (departure.State == undefined) {
        return unknown;
    }
    if (departure.State === "InTime") {
        return onTime;
    }
    var realTime = generateUTCStringFromUnparsedTimestamp(departure.RealTime || departure.ScheduledTime);
    var scheduledTime = generateUTCStringFromUnparsedTimestamp(departure.ScheduledTime);
    if (realTime == null || scheduledTime == null) {
        return unknown;
    }
    if (realTime !== scheduledTime) {
        var timeDifference = realTime - scheduledTime;
        var minutes = generateMinutesFromMilliseconds(timeDifference);
        if (timeDifference > 0) {
            var sheduledTimeString = generateHoursAndMinutesFromUtcDateString(scheduledTime);
            return delayStart + "+" + Math.abs(minutes).toString() + unit + " " + sheduledIcon + sheduledTimeString + " Uhr" + delayEnd;
        }
        else {
            var sheduledTimeString = generateHoursAndMinutesFromUtcDateString(scheduledTime);
            return toEarlyStart + "+" + Math.abs(minutes).toString() + unit + " " + sheduledIcon + sheduledTimeString + " Uhr" + delayEnd;
        }
    }
}
function generateMinutesFromMilliseconds(milliseconds) {
    if (typeof milliseconds == "string") {
        milliseconds = parseInt(milliseconds);
    }
    var minutes = milliseconds / 1000 / 60;
    return minutes;
}
function generateClockTimeStringFromUnparsedUTCTimestamp(unparsedTimestamp) {
    if (unparsedTimestamp == undefined || unparsedTimestamp == null || unparsedTimestamp === "") {
        return "XX:XX";
    }
    var dvbDate = generateUTCStringFromUnparsedTimestamp(unparsedTimestamp);
    if (dvbDate == null) {
        return "XX:XX";
    }
    return generateHoursAndMinutesFromUtcDateString(dvbDate);
}
function generateHoursAndMinutesFromUtcDateString(date) {
    try {
        var thisDate = new Date(date);
        var returnString = "";
        returnString += ('0' + thisDate.getHours()).substr(-2);
        returnString += ":";
        returnString += ('0' + thisDate.getMinutes()).substr(-2);
        return returnString;
    }
    catch (e) {
        return "XX:XX";
    }
}
function generateUTCStringFromUnparsedTimestamp(utcString) {
    var dvbDateRegex = /\/Date\((\d+)-\d*\)\//g;
    var dateMatch = dvbDateRegex.exec(utcString);
    if (dateMatch == null || dateMatch.length != 2) {
        return null;
    }
    var returnValue = dateMatch[1];
    return parseInt(returnValue);
}
function generateDistanceString(distance) {
    try {
        if (distance > 1) {
            var roundedDistanceString = (Math.round(distance * 100) / 100).toString().substr(0, 4);
            return roundedDistanceString + "km";
        }
        else {
            var roundedDistanceString = (Math.round(distance * 1000)).toString();
            return roundedDistanceString + "m";
        }
    }
    catch (e) {
        return "";
    }
}
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
function getPosition() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    var timeout = setTimeout(function () {
                        reject({ code: 3, message: "timeout" });
                        return;
                    }, 30000);
                    try {
                        navigator.geolocation.getCurrentPosition(function (pos) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                clearTimeout(timeout);
                                resolve(pos);
                                return [2];
                            });
                        }); }, function (error) {
                            clearTimeout(timeout);
                            reject(error);
                            return;
                        }, options);
                    }
                    catch (e) {
                        console.log(e);
                    }
                })];
        });
    });
}
function post(url, data) {
    if (url === void 0) { url = ''; }
    if (data === void 0) { data = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var response, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4, fetch(url, {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            redirect: 'follow',
                            referrerPolicy: 'no-referrer',
                            body: JSON.stringify(data)
                        })];
                case 1:
                    response = _a.sent();
                    return [2, response.json()];
                case 2:
                    e_2 = _a.sent();
                    return [2, null];
                case 3: return [2];
            }
        });
    });
}
function get(url) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    try {
                        fetch(url, {
                            method: "GET"
                        })
                            .then(function (response) {
                            if (response.status == 200) {
                                var contentType = response.headers.get("content-type");
                                if (contentType && contentType.indexOf("application/json") !== -1) {
                                    return response.json();
                                }
                                else {
                                    resolve(null);
                                }
                            }
                            else {
                                resolve(null);
                            }
                        })
                            .then(function (json) { return resolve(json); });
                    }
                    catch (e) {
                        resolve(null);
                    }
                })];
        });
    });
}
var intervallTimeInSeconds = 20;
var isDisabled = false;
var isCurrentlyLoading = false;
var currentRefreshState = 0;
var initialLoad = true;
var refreshIntervall = setInterval(function () {
    if (getIfAutorefreshIsEnabled() == false) {
        isDisabled = true;
    }
    else {
        isDisabled = false;
    }
    if (currentRefreshState > intervallTimeInSeconds || isCurrentlyLoading == true || isDisabled == true || initialLoad == true) {
        currentRefreshState = 0;
    }
    else {
        currentRefreshState += 1;
    }
    var progress = currentRefreshState / intervallTimeInSeconds;
    if (progress >= 1) {
        refreshInfos();
    }
    updateRefreshButtonProgress(progress);
}, 1000);
function getIfAutorefreshIsEnabled() {
    var disabledButton = document.getElementById("autorefreshSwitch");
    return disabledButton.checked;
}
function refreshInfos() {
    return __awaiter(this, void 0, void 0, function () {
        var thisTimeout;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (isCurrentlyLoading == true) {
                        return [2];
                    }
                    thisTimeout = setTimeout(function () {
                        isCurrentlyLoading = false;
                    }, 120000);
                    isCurrentlyLoading = true;
                    setSpinnerState("on");
                    return [4, initData()];
                case 1:
                    _a.sent();
                    setSpinnerState("off");
                    clearTimeout(thisTimeout);
                    isCurrentlyLoading = false;
                    return [2];
            }
        });
    });
}
function setSpinnerState(state) {
    var spinner = document.getElementById("refreshSpinner");
    if (state == "on") {
        spinner.classList.add("spinning");
    }
    else {
        spinner.classList.remove("spinning");
    }
}
function setAutoRefreshSwitchState(state) {
    var thisSwitch = document.getElementById("autorefreshSwitch");
    if (state == "on") {
        thisSwitch.checked = true;
    }
    else {
        thisSwitch.checked = false;
    }
}
function updateRefreshButtonProgress(progress) {
    var refreshbutton = document.getElementById("refreshButton");
    if (progress >= 1 || progress <= 0) {
        refreshbutton.setAttribute("style", "");
    }
    else {
        var progressCSS = generateProgressGradientString(progress);
        refreshbutton.setAttribute("style", progressCSS);
    }
}
function generateProgressGradientString(progress) {
    var progressInPercent = progress * 100;
    var html = "background: linear-gradient(90deg, #ff8f00 0%, #f57c00 " + progressInPercent + "%, #ff8f00 " + progressInPercent + "%);";
    return html;
}
var departureEndpoint = 'https://webapi.vvo-online.de/dm';
function getDeparturesOfStation(station) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
                    var stationNumber, departures, e_3;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                stationNumber = station.num;
                                _a.label = 1;
                            case 1:
                                _a.trys.push([1, 3, , 4]);
                                return [4, post(departureEndpoint, { stopid: stationNumber, lim: 5 })];
                            case 2:
                                departures = _a.sent();
                                resolve(departures);
                                return [3, 4];
                            case 3:
                                e_3 = _a.sent();
                                showPush("Fehler beim Abfragen der Informationen über eine Station.");
                                reject(e_3);
                                return [3, 4];
                            case 4: return [2];
                        }
                    });
                }); })];
        });
    });
}
//# sourceMappingURL=script.js.map