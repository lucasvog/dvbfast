/**
 * The last result of the search. Is used to refresh result
 */
let lastResultStation:rawDataStationElement|null = null;

/**
 * Initializes the search bar
 */
function initSearch(){
    lastResultStation = null;
    const elems = document.querySelectorAll('.autocomplete');
    let optionsData:any = {};
    for (const element of data){
        const key = element.l+" "+element.na;
        optionsData[key] = null;
    }
    //@ts-ignore
    const instances = M.Autocomplete.init(elems, {
        data: optionsData,
        minLength:2,
        onAutocomplete:handleResult,
        sortFunction : sortResultFunction
    });
}
/**
 * Sorts Elements and prefers results from dresden
 * @param a array of autocomplete-elements
 * @param b array of autocomplete-elements
 * @param inputString text string to compare
 */
function sortResultFunction(a:string,b:string,inputString:string){
    let extra = 0;
    if(!inputString.startsWith("D")){
        return 0;
    }
    return (a.indexOf(inputString) - b.indexOf(inputString))+extra;
}

/**
 * Gets called, if the search bar is autocompleted
 * @param query text of the search bar
 */
async function handleResult(query:string){
    console.log(query);
    
    let result:rawDataStationElement|null = matchTitleWithStation(query);
    if(result==null){
        showPush("Station konnte nicht gefunden werden.");
        return;
    }
    lastResultStation = result;
    updateSearchResult();
    
}

/**
 * Will be called in refreshHandler
 */
async function updateSearchResult() {
    if(lastResultStation==null){
        return;
    }
    const departures = await getDeparturesOfStation(lastResultStation);
    if (departures == undefined || departures == null) {
        showPush("Fehler beim Laden der nächsten Verbindungen.");
        return;
    }
    const html =  generateBox(lastResultStation, departures,true);
    setSearchContainerVisibility("visible");
    setResultContainerHTML(html);

}
/**
 * Matches the autocompleted string with a station
 * @param title title of the station to search for
 */
function matchTitleWithStation(title:string):rawDataStationElement|null{
    for(const element of data){
        const key = element.l+" "+element.na;
        if(key===title){
            return element;
        }
    }
    showPush("Station wurde nicht gefunden.");
    return null;
}

/**
 * Closes the search result box
 */
function closeResult(){
    lastResultStation = null;
    setSearchContainerVisibility("hidden");
    setResultContainerHTML("");
}

/**
 * Sets the html of the result container box
 * @param html string to be set
 */
function setResultContainerHTML(html:string){
    let resultBox =document.getElementById("searchResult");
    resultBox.innerHTML=html;
}

/**
 * Sets the visibility of the search result container
 * @param status to be set
 */
function setSearchContainerVisibility(status:"visible"|"hidden"){
    let searchContainer = document.getElementById("searchResultContainer");
    if(status==="visible"){
        searchContainer.classList.remove("hidden");
    }  else{
        searchContainer.classList.add("hidden");
    }
}

/**
 * Checks if the search bar is emty
 */
function updateClearButtonVisibility(){
    var searchValue = getSearchBarValue();
    if(searchValue!==""){
        setClearStatus("visible");
    }else{
        setClearStatus("hidden");
    }
}

/**
 * Sets the status of the clear searchbar button
 * @param status status of the button
 */
function setClearStatus (status:"hidden"|"visible"){
    var clearButton = document.getElementById("clearSearchButton");
    if(status=="hidden"){
        clearButton.classList.add("hidden");
    }else{
        clearButton.classList.remove("hidden");
    }
}

/**
 * Gets the contents of the search bar
 */
function getSearchBarValue():string{
    var searchbar:any = document.getElementById("autocomplete-input");
    return searchbar.value;
}

/**
 * Clears the search bar
 */
function clearSearchBar(){
    var searchbar:any = document.getElementById("autocomplete-input");
    searchbar.value="";
    setClearStatus("hidden");
}