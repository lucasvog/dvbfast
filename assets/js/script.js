function findCloseStations(lat1, long1, radius) {
    if (radius === void 0) { radius = 0.4; }
    var results = [];
    for (var elementKey in data) {
        var element = data[elementKey];
        var distance = findDistance(lat1, long1, element.lat, element.lon);
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
function generateBox(data) {
    var html = "<div class=\"card\">\n    <div class=\"stationTitle amber\">\n      <div class=\"row noBottomMargin verticalContainer\">\n      <div class=\"col s12 m12 l12 overflowHorizontalScroll\">\n        <h6 class=\"noMargin flow-text\"><i class=\"material-icons-smaller grey-text text-darken-4\">location_on</i>Albertplatz Bautzner/Rothenburger Stra\u00DFe</h6>\n        <small>Distanz: 300m |\u00A0Stand: 11:30 Uhr</small>\n      </div>\n    </div>\n    </div>\n    <div class=\"tripContainer verticalContainer\">\n      <div class=\"row noMargin\">\n      <div class=\"col s2 m2 l2\">\n        <div class=\"tripIcon verticalMiddle\">\n          333\n        </div>\n      </div>\n      <div class=\"col s7 m7 l7 tripDestination\">\n        <h6 class=\"noMargin\">Cosch\u00FCtz</h6>\n        <small>Steig 1</small>\n      </div>\n      <div class=\"col s3 m3 l3 tripDestination\">\n        <h6 class=\"noMargin\">11:30 Uhr</h6>\n        <small><i class=\"material-icons-smaller onTime\">check_circle</i>p\u00FCnktlich</small>\n      </div>\n    </div>\n    </div>\n  </div>";
}
function generateTitle(data) {
}
function generateTripBox(tripData) {
}
M.AutoInit();
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};
function getPosition() {
    navigator.geolocation.getCurrentPosition(geosuccess, geoerror, options);
}
getPosition();
function geosuccess(pos) {
    var crd = pos.coords;
    console.log('Your current position is:');
    console.log("Latitude : " + crd.latitude);
    console.log("Longitude: " + crd.longitude);
    console.log("More or less " + crd.accuracy + " meters.");
    var closeStations = findCloseStations(crd.latitude, crd.longitude);
    console.log(closeStations);
}
function geoerror(err) {
    console.warn("ERROR(" + err.code + "): " + err.message);
}
//# sourceMappingURL=script.js.map