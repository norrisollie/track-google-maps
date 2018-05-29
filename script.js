// script.js
var app = {};
app.dom = {};

app.setupDom = function() {

    app.dom.markerCounter = 0;
    app.dom.latitude;
    app.dom.longitude;
    app.dom.numberOfStations
    app.dom.map
    app.dom.marker
    app.dom.bounds
    app.dom.stationMarkerDataArr
    app.dom.stations

    app.dom.markerArr = [];
    app.dom.mapStationsContainer = document.getElementById("map-stations-container")
    app.dom.stationsContainer = document.getElementById("stations-container")
    app.dom.mapContainer = document.getElementById("map-container");
    app.dom.logoContainer = document.getElementById("logo-container");
    app.dom.container = document.getElementById("container");


};

// setup map to display stations
app.setupMap = function(stationMarkerDataArr) {

    // create new google map
    // set the map type, center position, and other seetings
    app.dom.map = new google.maps.Map(app.dom.mapContainer, {
        mapTypeId: "roadmap",
        center: { lat: app.dom.latitude, lng: app.dom.longitude },
        disableDefaultUI: true,
        zoom: 100
    });

    app.dom.bounds = new google.maps.LatLngBounds();

    // loop through the station marker array to add each station to the map
    for (i = 0; i < app.dom.stationMarkerDataArr.length; i++) {

        // create new marker
        app.dom.marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(app.dom.stationMarkerDataArr[i][2], app.dom.stationMarkerDataArr[i][3]),
            map: app.dom.map,
            station_name: app.dom.stationMarkerDataArr[i][0],
            station_code: app.dom.stationMarkerDataArr[i][1]
        });

        app.dom.markerArr.push(app.dom.marker);

        // add click event to each marker
        google.maps.event.addListener(app.dom.marker, 'click', app.clickMarkerHandler)

        // used toi specify the boundaries of the map so you can see all stations in the same view
        app.dom.bounds.extend(app.dom.marker.position);
    }

    // set the boundaries of the map
    setTimeout(function() {
        app.dom.map.fitBounds(app.dom.bounds);
    }, 500)


}

app.clickMarkerHandler = function() {

    // center map on marker position and change zoom level (to see closer);
    app.dom.map.panTo(this.getPosition());
    app.dom.map.setZoom(15);

    var stations = document.querySelectorAll(".stations");

    var markerStationCode = this.station_code;


    stations.forEach(function(element) {

        element.classList.remove("active");

        if (markerStationCode === element.dataset.code) {
            element.classList.add("active");
        };
    });
}

app.clickStationsHandler = function(e) {

    var target = e.currentTarget;
    var targetId = e.currentTarget.dataset.id;

    var stations = document.querySelectorAll(".stations");

    stations.forEach(function(element) {
        element.classList.remove("active");
    });

    target.classList.add("active");

    app.dom.map.panTo(app.dom.markerArr[targetId].getPosition());
    app.dom.map.setZoom(15);
}

app.getUserLocation = function() {

    if ("geolocation" in navigator) {
        //geolocation is available

        // if geolocation is supported and works
        app.success = function(position) {

            console.log("GeoLocation is supported, now finding user's location.");

            // create variables for the latitude and longitude;
            app.dom.latitude = position.coords.latitude;
            // app.dom.latitude = 51.5074
            app.dom.longitude = position.coords.longitude;
            // app.dom.longitude = 0.1278

            // 51.5074° N, 0.1278° W

            console.log("User Coordinates: " + app.dom.latitude + "," + app.dom.longitude);

            // run function to create URL
            app.createNearestStationsUrl(app.dom.latitude, app.dom.longitude);

        }

        // if geolocation is supported but doesnt work
        app.error = function() {

            console.log("GeoLocation is supported, but there is an error.");

        }

        // determines what function to run, either if geolocation is successful or if there is an error
        navigator.geolocation.getCurrentPosition(app.success, app.error)

    } else {
        // geolocation IS NOT available
        console.log("GeoLocation is not supported on this device/browser.");

    }
}

// function to create the url to get nearest stations
app.createNearestStationsUrl = function() {

    // app ID, app Key and base URL for the request
    var appID = "f6f36129";
    var appKey = "2b9b604a4495fb6e73df681edba652a1";
    var transportAPIUrl = "https://transportapi.com/v3/uk/train/stations/near.json?app_id=" + appID + "&app_key=" + appKey + "&lat=" + app.dom.latitude + "&lon=" + app.dom.longitude;

    console.log("URL: " + transportAPIUrl);

    // run the ajax request function
    app.ajaxRequest(transportAPIUrl, app.nearestStationsResponseHandler);

}

// handles the response for the request
app.nearestStationsResponseHandler = function(data) {

    // enter the stations array from the response
    var stationsData = data.stations;
    var numberOfStations = stationsData.length;

    var stationsArr = app.createElements(numberOfStations);

    app.dom.stationMarkerDataArr = [];

    // for loop to get each piece of info from the array
    for (var i = 0; i < numberOfStations; i++) {

        // variables for each property in station array and object
        var stationName = stationsData[i].name;
        var stationCode = stationsData[i].station_code;
        var stationLatitude = stationsData[i].latitude;
        var stationLongitude = stationsData[i].longitude;
        // converts meters to km
        var stationDistance = (stationsData[i].distance / 1000).toFixed(1) + "km";

        // console.log("Name: " + stationName + "\nCode: " + stationCode + "\nCoords: " + stationLatitude + "," + stationLongitude + "\nDistance: " + stationDistance);

        // add class to each div
        stationsArr[i].classList.add("stations");

        stationsArr[i].dataset.code = stationCode

        stationsArr[i].dataset.id = app.dom.markerCounter++

            // insert info in to each div
            stationsArr[i].innerHTML = "<b>Name:</b> " + stationName + "<br>" +
            "<b>Code:</b> " + stationCode + "<br>" +
            "<b>Lat:</b> " + stationLatitude + "<br>" +
            "<b>Lon:</b> " + stationLongitude + "<br>" +
            "<b>Distance:</b> " + stationDistance

        // add event listener to stations divs
        stationsArr[i].addEventListener("click", app.clickStationsHandler)

        var stationCoordsArr = [];
        app.dom.stationMarkerDataArr.push(stationCoordsArr);
        stationCoordsArr.push(stationName);
        stationCoordsArr.push(stationCode);
        stationCoordsArr.push(stationLatitude);
        stationCoordsArr.push(stationLongitude);

    }

    app.appendElements(stationsArr, app.dom.stationsContainer)

    app.setupMap(app.dom.stationMarkerDataArr);

    app.dom.logoContainer.style.height = "100px";
    // app.dom.container.style.gridTemplateRows = "100px";
}

// generic function that can be used to create elements dynamically
app.createElements = function(numberOfElements) {

    // empty array to
    var elementArray = [];

    // loop to create specified number of elements specified as an argument
    for (var i = 0; i < numberOfElements; i++) {

        // create a div element
        var element = document.createElement("div");

        // push each created element to the "elementArray" array
        elementArray.push(element);

    }

    // console.log(elementArray);

    // return the array so it can be used outside the function
    return elementArray

}

app.appendElements = function(elementsArray, container) {

    for (var i = 0; i < elementsArray.length; i++) {

        container.appendChild(elementsArray[i]);

    }


}


// generic ajax request to be reused
app.ajaxRequest = function(url, callback) {

    // create a variable for the request
    var req = new XMLHttpRequest();

    // open the request and specify the URL for it
    req.open('GET', url, true);

    // if request is successful, this function will run
    req.onload = function() {

        // if the status is between 200 and 399, the request is successful
        if (this.status >= 200 && this.status < 400) {

            console.log("The request was successful.")

            // create a variable for the data to be parsed
            var data = JSON.parse(this.response);

            // callback function that will run another function once the data has been loaded
            callback(data);

            // the server works but there is an error
        } else {
            // We reached our target server, but it returned an error
            console.log("The request reached the server, but there is an error.")

        }
    };

    // if there is an error
    req.onerror = function() {
        // There was a connection error of some sort
        console.log("There is an error.");
    };

    // send the request
    req.send();

}

app.init = function() {

    // run function to setup dom elements
    app.setupDom();

    // run function to get the user's location
    app.getUserLocation();

};

document.onload = app.init();