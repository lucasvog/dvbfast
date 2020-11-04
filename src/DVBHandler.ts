
const departureEndpoint:string = 'https://webapi.vvo-online.de/dm';

interface DepartureContainer {
    Departures: Departure[],
    ExpirationTime: string,
    Name: string,
    Place: string,
    Status: { Code: string },

}
/**
 * Not a full interface, but the relevant data from each departure
 */
interface Departure {
    Direction: string,
    LineName: string,
    Mot: string,
    Platform?: { Name: string, Type: string },
    RealTime: string,
    ScheduledTime: string,
    State: string
}

/**
 * Finds the next departures from a given station
 * @param station an element from the stations json
 */
async function getDeparturesOfStation(station: rawDataStationElement): Promise<DepartureContainer | null> {
    return new Promise(async (resolve, reject) => {
        const stationNumber = station.num;
        try {
            const departures: DepartureContainer = await post(departureEndpoint, { stopid: stationNumber, lim: 5 })
            resolve(departures);
        } catch (e) {
            showPush("Fehler beim Abfragen der Informationen über eine Station.")
            reject(e);
        }
        
    });
}
