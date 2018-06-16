var app = {}

app.setupDom = function() {

    console.log("app.setupDom is running.");

    app.dom = {}

    app.dom.mapWrapper = document.getElementById("map-wrapper")

    app.dom.lat
    app.dom.lon

}

app.addListeners = function() {

    console.log("app.addListeners is running.")

}

app.findUserLocation = function() {

    console.log("app.findUserLocation is running.");

    if ("geolocation" in navigator) {

        console.log("GeoLocation is supported, finding current position");

        // function to determine if success or error is run
        navigator.geolocation.getCurrentPosition(success, error)

    } else {

        console.log("GeoLocation is not supported.");

    }

    // if geo location works
    function success(position) {

        // variables for latitude and longitude
        app.dom.lat = position.coords.latitude,
            app.dom.lon = position.coords.longitude;

        // log coordinates in console
        console.log(app.dom.lat + "," + app.dom.lon);

        // run init map function
        app.initMap();

    }

    // if geolocation doesnt work
    function error() {

    }

}

app.initMap = function() {

    console.log("app.initMap is running.")

    // create new google map
    map = new google.maps.Map(app.dom.mapWrapper, {
        center: { lat: app.dom.lat, lng: app.dom.lon },
        zoom: 12,

    });
}

app.createStationUrl = function() {

}

app.request = function() {

    var request = new XMLHttpRequest();

    request.open('GET', '/my/url', true);

    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // Success!
            var data = JSON.parse(this.response);



        } else {
            // We reached our target server, but it returned an error

        }
    };

    request.onerror = function() {
        // There was a connection error of some sort
    };

    request.send();

}

app.initApp = function() {

    console.log("app.initApp is running.")

    // create container, map container, map wrapper, stations container and stations wrapper
    var container = document.createElement("div"),
        mapContainer = document.createElement("div"),
        mapWrapper = document.createElement("div"),
        stationsContainer = document.createElement("div");
    stationsWrapper = document.createElement("div");

    // append elements to the parent
    document.body.appendChild(container);
    container.appendChild(mapContainer);
    container.appendChild(stationsContainer);

    // append elements to map.stations container
    mapContainer.appendChild(mapWrapper);
    stationsContainer.appendChild(stationsWrapper);

    // set the id of the elements
    container.setAttribute("id", "container")
    mapContainer.setAttribute("id", "map-container")
    mapWrapper.setAttribute("id", "map-wrapper")
    stationsContainer.setAttribute("id", "stations-container")
    stationsWrapper.setAttribute("id", "stations-wrapper")

    // run dom setup
    app.setupDom();

    // run function to get users location
    app.findUserLocation();

}

window.onload = app.initApp