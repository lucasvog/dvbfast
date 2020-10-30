

async function init(){
    //@ts-ignore
M.AutoInit();
    initData();
}
init();

async function initData(){
    var position:any = null;
    try{
        position = await getPosition();
        console.log("GE",position);

    }catch(e){
        showPush("Bitte lassen Sie die Standorterkennung zu, damit Stationen in der Nähe erkannt werden können.");
        return;
    }
    if(position==null){
        showPush("Standort kann nicht bestimmt werden.");
        return;
    }
    var closeStations:rawDataStationElement[] = findCloseStations(position.coords.latitude, position.coords.longitude);
   //var closeStations:rawDataStationElement[] = findCloseStations(51.053533, 13.816152); Seilbahnen testen
   //var closeStations:rawDataStationElement[] = findCloseStations(51.039867, 13.733739); Hauptbahnhof
    if(closeStations==undefined||closeStations==null){
        showPush("Stationen in der konntent nicht gefunden werden.");
        return;
    }
    if(closeStations.length<=0){
        showPush("Keine Stationen in dem Radius gefunden.");
        return;
    }
    console.log(closeStations);
    var html ="";
    for(const station of closeStations){
        var departures = await getDeparturesOfStation(station);
        if(departures==undefined||departures==null){
            showPush("Fehler beim Laden der nächsten Verbindungen.");
        return;
        }
       html+= generateBox(station,departures);
       
    }
    var target = document.getElementById("boxcontainer");
    if(target ==null){
        showPush("Interner Fehler.");
        return;
    }
    target.innerHTML = html;
    
}

/**
 * Shows a notofication
 * @param message Message to display as push notification 
 */
function showPush(message:string){
    //@ts-ignore
    M.toast({html: message})
}