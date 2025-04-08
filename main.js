/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map").setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);

//Overlays definieren
let Overlays = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
    hotels: L.featureGroup().addTo(map),
}

//Layercontrol
L.control.layers({
    "BasemapAT": L.tileLayer.provider('BasemapAT.basemap').addTo(map),
    "BasemapAT grau": L.tileLayer.provider('BasemapAT.grau').addTo(map),
    "BasemapAT Overlay": L.tileLayer.provider('BasemapAT.overlay').addTo(map),
    "BasemapAT Terrain": L.tileLayer.provider('BasemapAT.terrain').addTo(map),
    "BasemapAT Surface": L.tileLayer.provider('BasemapAT.surface').addTo(map),
    "BasemapAT highdpi": L.tileLayer.provider('BasemapAT.highdpi').addTo(map),
    "BasemapAT Orthofoto": L.tileLayer.provider('BasemapAT.orthofoto').addTo(map),



}, {
    "Sehenswürdigkeiten": Overlays.sights,
    "Vienna sightseeing Linien": Overlays.lines,
    "Vienna sightseeing Haltestellen": Overlays.stops,
    "Fußgängerzonen": Overlays.zones,
    "Hotels und Unterkünfte": Overlays.hotels

}).addTo(map);

//Maßstab
L.control.scale({
    imperial: false
}).addTo(map);

//Sehenswürdigkeiten Standorte Wien
async function loadSights(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href = 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(Overlays.sights);
}



//Touristische Kraftfahrlinien Liniennetz Vienna Sightseeing Linie Wien
async function loadLines(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href = 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(Overlays.lines);
}


//Touristische Kraftfahrlinien Haltestellen Vienna Sightseeing Linie Standorte Wien
async function loadStops(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href = 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(Overlays.stops);
}


//Fußgängerzonen Wien
async function loadZones(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href = 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(Overlays.zones);
}

//Hotels und Unterkünfte Wien
async function loadHotels(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    //console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href = 'https://data.wien.gv.at'> Stadt Wien</a>"
    }).addTo(Overlays.zones);
}
//GeoJSON laden und visualisiere
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")