

/**
 * Finds the closest stations to a radius in km
 * @param {float} lat1 Latitude in decimal degrees
 * @param {float} long1 Longitude in decimal degrees 
 * @param {number} radius in km to search
 */
function findCloseStations(lat1:number, long1:number, radius = 0.4):rawDataStationElement[] {
    var results:rawDataStationElement[] = [];
    //@ts-ignore because data is not defined
    for (var elementKey in data) {
         //@ts-ignore
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


/**
 * Sorts an Array of stations by distance
 * @param {array} elements Array of station elements. Needs "distance" attribute per object in List
 */
function sortLocationsByDistance(elements:rawDataStationElement[]) {
    try {
        var returnElements = elements.sort(function (a, b) { return a.distance - b.distance });
        return returnElements;
    } catch (e) {
        return elements;
    }
}


var Rk = 6373; // the earths radius in km at ca 39 degrees from the equator. Wikipedia says otherwise.

/**
 * Finds the distance between two points in decimal degree format
 * @param {*} latitude1 Latitude of first point
 * @param {*} longitude1 Longitude of first point
 * @param {*} latitude2 Latitude of second point
 * @param {*} longitude2 Longitude of second point
 * @returns Distance in KM
 */
function findDistance(latitude1:number, longitude1:number, latitude2:number, longitude2:number) {

    // convert coordinates to rad
    var lat1 = degree2rad(latitude1);
    var lon1 = degree2rad(longitude1);
    var lat2 = degree2rad(latitude2);
    var lon2 = degree2rad(longitude2);

    // get differences
    var dlat = lat2 - lat1;
    var dlon = lon2 - lon1;

    //using the Haversine Formula to calculate distances on a round surface. Works well on short distances
    var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); // great circle distance in rad
    var dk = c * Rk; // great circle distance in km
    return dk;
}


/**
 *  convert degrees to radians
 * @param deg Degree
 * @returns radiant
 */
function degree2rad(deg:number) {
    var rad = deg * Math.PI / 180; // radians = degrees * pi/180
    return rad;
}
