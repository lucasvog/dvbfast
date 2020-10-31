interface rawDataStationElement {
    na: string,
    num: string,
    lat: string,
    lon: string,
    l: string,
    distance?: number
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
 * Talks to the geolocation-API and returns it
 * @returns Promise that returns to a geolocation-object
 */
async function getPosition():Promise<any> {
    return new Promise((resolve, reject) => {
        var timeout = setTimeout(() => {
            reject("timeout");
            return;
        }, 30000)//after X seconds: timeout
        navigator.geolocation.getCurrentPosition(async (pos: any) => {
            clearTimeout(timeout);
            resolve(pos);
            return;
        },
            (error) => {
                clearTimeout(timeout);
                reject(error);
                return;
            }, options);
    });
}
