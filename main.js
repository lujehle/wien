/* Vienna Sightseeing Beispiel */

// Stephansdom Objekt
let stephansdom = {
    lat: 48.208493,
    lng: 16.373118,
    zoom: 12,
    title: "Domkirche St. Stephan",
};

// Karte initialisieren
let map = L.map("map", {
    maxZoom:19
}).setView([stephansdom.lat, stephansdom.lng], stephansdom.zoom);

//Overlays definieren
let overlays = {
    sights: L.featureGroup().addTo(map),
    lines: L.featureGroup().addTo(map),
    stops: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),
    hotels: L.markerClusterGroup({
        disableClusteringAtZoom:17
    }).addTo(map),

}

// Layercontrol
L.control.layers({
    "BasemapAT watercolour": L.tileLayer.provider('Stadia.StamenWatercolor').addTo(map),
    "BasemapAT": L.tileLayer.provider('BasemapAT.basemap').addTo(map),
    "BasemapAT surface": L.tileLayer.provider('BasemapAT.surface').addTo(map),
    "BasemapAT orthophoto": L.tileLayer.provider('BasemapAT.orthofoto').addTo(map)
}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Vienna sightseeing Linien": overlays.lines,
    "Vienna sightseeing Haltstellen": overlays.stops,
    "Fußgängerzonen": overlays.zones,
    "Hotels und Unterkünfte": overlays.hotels,
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Sehenswürdigkeiten Standorte Wien
async function loadSights(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at' >Stadt Wien </a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: "icons/photo.png",
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });

        },
        onEachFeature: function(feature, layer) {
            //console.log(feature.properties);
            layer.bindPopup(`
                <img src="${feature.properties.THUMBNAIL}" alt"*">
                <h4>${feature.properties.NAME}</h4>
                <address>${feature.properties.ADRESSE}</address>
                <a href="${feature.properties.WEITERE_INF}" target="Wien"s> Website</a>
                `);
        }
    }).addTo(overlays.sights);
}

// Vekehrsmittel Linien
async function loadLines(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);

    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'>Stadt Wien</a>",
        style: function (feature) {
            let color;
            let name = feature.properties.LINE_NAME;

            if (name == "Yellow Line") {
                color = "#FFDC00";
            } else if (name == "Blue Line") {
                color = "#0074D9";
            } else if (name == "Red Line") {
                color = "#FF4136";
            } else if (name == "Green Line") {
                color = "#2ECC40";
            } else if (name == "Grey Line") {
                color = "#AAAAAA";
            } else if (name == "Orange Line") {
                color = "#FF851B";
            } else {
                color = "#111111"; // Standardfarbe
            }

            return {
                color: color,
                weight: 2,
                opacity: 0.7
            };
        },
        onEachFeature: function (feature, layer) {
            const props = feature.properties;
            layer.bindPopup(`
                <strong><i class="fa-solid fa-bus"></i> ${props.LINE_NAME}</strong><br>
                <i class="fa-regular fa-circle-dot"></i> ${props.FROM_NAME}<br>
                <i class="fa-solid fa-arrow-down"></i><br>
                <i class="fa-regular fa-circle-dot"></i> ${props.TO_NAME}
            `);
        }
    }).addTo(overlays.lines);
}



// Haltstellen
async function loadStops(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'>Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/bus_${feature.properties.LINE_ID}.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            console.log(feature.properties);
            const props = feature.properties;
            layer.bindPopup(`
                <strong><i class="fa-solid fa-bus"></i> ${props.LINE_NAME}</strong><br>
                <i class="fa-solid fa-location-dot"></i> ${props.STAT_NAME}
            `);
        }
    }).addTo(overlays.stops);
}



// Fußgängerzone
async function loadZones(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);
    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'>Stadt Wien</a>",
        style: function (feature) {
            return {
                color: "#F012BE",
                weight: 1,
                opacity: 0.4,
                fillOpacity: 0.1,
            };
        },
        onEachFeature: function (feature, layer) {
            const props = feature.properties;
            layer.bindPopup(`
                <strong>Fußgängerzone ${props.ADRESSE}</strong><br>
                <i class="fa-regular fa-clock"></i> ${props.ZEITRAUM}<br>
                <i class="fa-solid fa-circle-info"></i> ${props.AUSN_TEXT}
            `);
        }
    }).addTo(overlays.zones);
}


// Hotels
async function loadHotels(url) {
    console.log(url);
    let response = await fetch(url);
    let jsondata = await response.json();
    console.log(jsondata);

    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.wien.gv.at'>Stadt Wien</a>",
        pointToLayer: function (feature, latlng) {
            const props = feature.properties;
            let iconName;

            if (props.KATEGORIE_TXT == "5*") {
                iconName = "hotel_5stars.png";
            } else if (props.KATEGORIE_TXT == "4*") {
                iconName = "hotel_4stars.png";
            } else if (props.KATEGORIE_TXT == "3*") {
                iconName = "hotel_3stars.png";
            } else if (props.KATEGORIE_TXT == "2*") {
                iconName = "hotel_2stars.png";
            } else if (props.KATEGORIE_TXT == "1*") {
                iconName = "hotel_1stars.png";
            } else {
                iconName = "hotel_0stars.png";
            }

            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `icons/${iconName}`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37]
                })
            });
        },
        onEachFeature: function (feature, layer) {
            const props = feature.properties;
            layer.bindPopup(`
                <div style="min-width:200px">
                    <strong><i class="fa-solid fa-hotel"></i> ${props.BETRIEB}</strong><br>
                    Hotel ${props.KATEGORIE_TXT}<br>
                    <hr style="margin:4px 0">
                    <i class="fa-solid fa-location-dot"></i> ${props.ADRESSE}<br>
                    <i class="fa-solid fa-phone"></i> <a href="tel:${props.KONTAKT_TEL}">${props.KONTAKT_TEL}</a><br>
                    <i class="fa-solid fa-envelope"></i> <a href="mailto:${props.KONTAKT_EMAIL}">${props.KONTAKT_EMAIL}</a><br>
                    <a href="${props.WEBLINK1}" target="_blank">
                        <i class="fa-solid fa-globe"></i> Homepage
                    </a>
                </div>
            `);
        }
    }).addTo(overlays.hotels);
}

// GeoJSON und visualisieren
loadSights("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SEHENSWUERDIGOGD&srsName=EPSG:4326&outputFormat=json")
loadLines("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKLINIEVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadStops("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:TOURISTIKHTSVSLOGD&srsName=EPSG:4326&outputFormat=json")
loadZones("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FUSSGEHERZONEOGD&srsName=EPSG:4326&outputFormat=json")
loadHotels("https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:UNTERKUNFTOGD&srsName=EPSG:4326&outputFormat=json")