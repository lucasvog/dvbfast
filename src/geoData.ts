//@ts-ignore
M.AutoInit();
interface rawDataStationElement {
    na: string,
    num: string,
    lat: string,
    lon: string,
    l: string,
    distance?:number
  }

  /**
   * Options for geolocation-API
   */
var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

/**
 * Talks to the geolocation-API
 */
function getPosition() {
    navigator.geolocation.getCurrentPosition(geosuccess, geoerror, options);
}
getPosition();

/**
 * When Geo request was successfull
 * @param {geolocation-position} pos Position from the geolocation-api
 */
function geosuccess(pos:any) {
    var crd = pos.coords;
    console.log('Your current position is:');
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);
    var closeStations = findCloseStations(crd.latitude, crd.longitude);
    console.log(closeStations);
}

/**
 * Gets called if an error occured on the geolocation-API
 * @param err geolocation-error
 */
function geoerror(err:any) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
}


