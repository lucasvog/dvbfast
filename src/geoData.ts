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
const options = {
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
        let timeout = setTimeout(() => {
            reject({code:3,message:"timeout"});
            return;
        }, 30000)//after X seconds: timeout
        try{
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
        }catch(e){
            console.log(e);
        }
    });

}
