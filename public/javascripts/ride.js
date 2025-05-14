//         let map;
//         let directionsService;
//         let directionsRenderer;
//         let homeLocation; // Declare homeLocation globally


//         window.initMap = function () {
//             map = new google.maps.Map(document.getElementById('map'), {
//                 center: { lat: 22.572790590435996, lng: 88.43741479531052 },
//                 zoom: 14
//             });
        
//             directionsService = new google.maps.DirectionsService();
//             directionsRenderer = new google.maps.DirectionsRenderer();
//             directionsRenderer.setMap(map);
        
        
//         // Fetch the rider's home location
//         // fetch('/rideOpt/get-home-location')
//         // .then(response => response.json())
//         // .then(data => {
//         // homeLocation = { lat: data.homeLocation.latitude, lng: data.homeLocation.longitude };
//         // })
//         // .catch(error => console.error(error));
//         // }

//         fetch('/rideOpt/get-home-location')
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             return response.json();
//         })
//         .then(data => {
//             // Check if homeLocation exists in the response
//             if (data && data.homeLocation) {
//                 homeLocation = { lat: data.homeLocation.latitude, lng: data.homeLocation.longitude };
//             } else {
//                 throw new Error('Home location data is missing');
//             }
//         })
//         .catch(error => console.error('Error fetching home location:', error));
// }

//         function updateMap(rideType) {
//             // const homeLocation = { lat: 22.447610790228882, lng: 88.3960971752744 }; 
//             const officeLocation = { lat: 22.572790590435996, lng: 88.43741479531052 }; 
//             if (!homeLocation) {
//                 console.error('Home location is not defined');
//                 return; // Exit if homeLocation is not defined
//             }
//             if (rideType === 'hometooffice') {
//                 calculateAndDisplayRoute(homeLocation, officeLocation);
//             } else if (rideType === 'officetohome') {
//                 calculateAndDisplayRoute(officeLocation, homeLocation);
//             } else if (rideType === 'both') {
    
//             calculateAndDisplayRoute(homeLocation, officeLocation);
        
//             calculateAndDisplayRoute(officeLocation, homeLocation);
//             } else {
        
//                 directionsRenderer.setDirections({ routes: [] });
//             }
//         }

//         function calculateAndDisplayRoute(start, end) {
//                 directionsService.route({
//                     origin: start,
//                     destination: end,
//                     travelMode: google.maps.TravelMode.DRIVING
//                 },
//                 (response, status) => {
//                     if (status === 'OK') {
//                         directionsRenderer.setDirections(response);
//                     } else {
//                         window.alert('Directions request failed due to ' + status);
//                     }
//                 });
//         }

//         document.getElementById('hometooffice').addEventListener('click', () => updateMap('hometooffice'));
//         document.getElementById('officetohome').addEventListener('click', () => updateMap('officetohome'));
//         document.getElementById('both').addEventListener('click', () => updateMap('both'));


//         window.onload = initMap;


let map;
let directionsService;
let directionsRenderer;
let homeLocation; // Declare homeLocation globally

window.initMap = function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 22.572790590435996, lng: 88.43741479531052 },
        zoom: 14
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    // Fetch the rider's home location
    fetch('/rideOpt/get-home-location')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Check if homeLocation exists in the response
            if (data && data.homeLocation) {
                homeLocation = { lat: data.homeLocation.latitude, lng: data.homeLocation.longitude };
            } else {
                throw new Error('Home location data is missing');
            }
        })
        .catch(error => console.error('Error fetching home location:', error));
}

function updateMap(rideType) {
    const officeLocation = { lat: 22.572790590435996, lng: 88.43741479531052 }; 

    if (!homeLocation) {
        console.error('Home location is not defined');
        return; // Exit if homeLocation is not defined
    }

    if (rideType === 'hometooffice') {
        calculateAndDisplayRoute(homeLocation, officeLocation);
    } else if (rideType === 'officetohome') {
        calculateAndDisplayRoute(officeLocation, homeLocation);
    } else if (rideType === 'both') {
        calculateAndDisplayRoute(homeLocation, officeLocation);
        calculateAndDisplayRoute(officeLocation, homeLocation);
    } else {
        directionsRenderer.setDirections({ routes: [] });
    }
}

function calculateAndDisplayRoute(start, end) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.DRIVING
    },
    (response, status) => {
        if (status === 'OK') {
            directionsRenderer.setDirections(response);
        } else if (status === 'ZERO_RESULTS') {
            window.alert('No route found between the origin and destination.');
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

document.getElementById('hometooffice').addEventListener('click', () => updateMap('hometooffice'));
document.getElementById('officetohome').addEventListener('click', () => updateMap('officetohome'));
document.getElementById('both').addEventListener('click', () => updateMap('both'));

window.onload = initMap;