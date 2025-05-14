function initMap() {
    const pickupLocation = {
        lat: parseFloat(document.getElementById("pickupLat").value),
        lng: parseFloat(document.getElementById("pickupLng").value)
    };
    const driverLocation = {
        lat: parseFloat(document.getElementById("driverLat").value),
        lng: parseFloat(document.getElementById("driverLng").value)
    };
    const destination = {
        lat: 22.572790590435996, // Office location latitude
        lng: 88.43741479531052    // Office location longitude
    };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: pickupLocation,
    });

    // Markers for pickup, driver, and destination
    new google.maps.Marker({
        position: pickupLocation,
        map,
        title: "Pickup Location",
    });

    new google.maps.Marker({
        position: driverLocation,
        map,
        title: "Driver Location",
    });

    new google.maps.Marker({
        position: destination,
        map,
        title: "Destination",
    });

    // Optional: Draw a route from the driver to the pickup location
    const directionsService = new google.maps.DirectionsService();
    const directionsDisplay = new google.maps.DirectionsRenderer({ map });

    const request = {
        origin: driverLocation,
        destination: pickupLocation,
        travelMode: "DRIVING",
    };

    directionsService.route(request, (result, status) => {
        if (status === "OK") {
            directionsDisplay.setDirections(result);
        } else {
            console.error("Directions request failed due to " + status);
        }
    });
}
window.initMap = initMap;

// Call the initMap function when the page loads
window.onload = initMap;