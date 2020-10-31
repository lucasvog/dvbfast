interface dataElement{
    na: string,
    num: string,
    lat: string,
    lon: string,
    l: string,
    distance?:number
}

let data:dataElement[] = []

/**
 * asynchtonously fetches local storage, if necessary, fills and updates it
 */
async function initStationsData(){
    return new Promise(async (resolve,reject)=>{
        let localData:dataElement[] = readStorage("data",true);
        if(localData==undefined||localData==null){
            const cacheResult = await asynchronouslyUpdateCache();
            resolve(cacheResult);
        return;
        }else{
            data = localData;
            asynchronouslyUpdateCache(); //without await, processing in the background
            resolve(true);
            return;
        } 
    })
}


/**
 * asynchronously fetches json of stations
 */
async function asynchronouslyUpdateCache() {
  return new Promise(async (resolve,reject)=>{
    let thisData:dataElement[] = await get("./assets/data/data.json");
    if(thisData==undefined||thisData==null){
        showPush("Es ist ein Fehler beim Laden der Haltestellen aufgetreten.");
        resolve(false);
        return;
    }
    data = thisData;
    setStorage("data",thisData,true);
    resolve(true);
    return;
  })
}

/**
 * sets item to local storage
 * @param key key of storage item
 * @param value value of storage item
 * @param isJSON if value is json, the value will be stringified
 */
function setStorage(key:string,value:any,isJSON=false){
    if(isJSON){
        value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
}

/**
 * gets an item from local storage
 * @param key key of item
 * @param isJSON if value is json, the value will be parsed
 */
function readStorage(key:string,isJSON=false):any{
    try{
        let value = localStorage.getItem(key);
        if(isJSON==true){
            value = JSON.parse(value);
        }
   return value;
    }catch(e){
        return null;
    }
}