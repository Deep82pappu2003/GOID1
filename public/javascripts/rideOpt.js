

// let riderId;

// // Get the ride options container
// const rideOptionsContainer = document.querySelector('.ride-options-container');

// // Add event listener for clicking on ride options
// rideOptionsContainer.addEventListener('click', async (event) => {
//   const target = event.target;

//   // Check if the clicked element is a ride option
//   if (target.classList.contains('ride-option')) {
//     const carType = target.dataset.carType;
//     // alert(carType);

//     try {
//       const response = await fetch('/rideOpt/get-rider-data');
//       const data = await response.json();
//       riderId = data.riderId;
//       const pickupLocation = data.homeLocation;
//       const pickupAddress = data.pickupAddress;
//       const eId = data.eId;

//       const bookingResponse = await fetch('/rideOpt/search-ride', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           riderId,
//           carType,
//           pickupLocation,
//           eId,
//           pickupAddress,
//         }),
//       });

//       const rideRequest = await bookingResponse.json();
//       console.log(rideRequest);

//       if (rideRequest.updatedRideRequest) {
//         if (rideRequest.updatedRideRequest.status === 'accepted') {
//           alert("Your ride is confirmed!");


// // Show the confirmation button
// document.getElementById("view-confirmation").style.display = "block";
// sessionStorage.setItem('rideRequestId', rideRequest.updatedRideRequest._id);

//           const pickupLocation = {
//             latitude: rideRequest.updatedRideRequest.pickupLocation.coordinates[1],
//             longitude: rideRequest.updatedRideRequest.pickupLocation.coordinates[0],
//           };
//           const driverLocation = {
//             latitude: rideRequest.driverLocation.latitude,
//             longitude: rideRequest.driverLocation.longitude,
//           };
//           const destination = {
//             latitude: 22.572790590435996,
//             longitude: 88.43741479531052,
//           };

//           const map = new google.maps.Map(document.getElementById("map"), {
//             center: { lat: pickupLocation.latitude, lng: pickupLocation.longitude },
//             zoom: 12,
//            });

//           new google.maps.Marker({
//             position: new google.maps.LatLng(pickupLocation.latitude, pickupLocation.longitude),
//             map,
//             title: "Pickup Location",
//           });

//           new google.maps.Marker({
//             position: new google.maps.LatLng(driverLocation.latitude, driverLocation.longitude),
//             map,
//             title: "Driver Location",
//           });

//           new google.maps.Marker({
//             position: new google.maps.LatLng(destination.latitude, destination.longitude),
//             map,
//             title: "Destination",
//           });

//           const directionsService = new google.maps.DirectionsService();
//           const directionsDisplay = new google.maps.DirectionsRenderer({
//             map,
//           });

//           const request = {
//             origin: new google.maps.LatLng(driverLocation.latitude, driverLocation.longitude),
//             destination: new google.maps.LatLng(pickupLocation.latitude, pickupLocation.longitude),
//             travelMode: "DRIVING",
//           };

//           directionsService.route(request, (result, status) => {
//             if (status === "OK") {
//               directionsDisplay.setDirections(result);
//             } else {
//               console.error("Directions request failed due to " + status);
//             }
//           });

//           document.getElementById("map").style.display = "block";
//           document.getElementById("cancel-ride").style.display = "block";
//         } else {
//           alert("No drivers available. Please try again later.");
//         }
//       } else {
//         alert("Unexpected response structure. Please try again.");
//         console.error("Response:", rideRequest);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }
// });

// // Add event listener for the Cancel Ride button
// document.getElementById("cancel-ride").addEventListener("click", async () => {
//   try {
//     const cancelResponse = await fetch('/rideOpt/cancel-ride', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         riderId: riderId,
//       }),
//     });

//     const cancelResult = await cancelResponse.json();

//     if (cancelResult.success) {
//       alert("Your ride has been cancelled successfully.");
//       document.getElementById("cancel-ride").style.display = "none";
//       document.getElementById("map").style.display = "none";
// document.getElementById("view-confirmation").style.display = "none";


//     } else {
//       alert("Failed to cancel the ride. Please try again.");
//     }
//   } catch (error) {
//     console.error("Error cancelling ride:", error);
//   }
// });


// // Add event listener for the View Confirmation button
// document.getElementById("view-confirmation").addEventListener("click", () => {
//   const rideRequestId = sessionStorage.getItem('rideRequestId');

//   window.location.href = `/rideOpt/view-confirmation/${rideRequestId}`; // Redirect to ride details page
// });


let riderId;

// Get the ride options container
const rideOptionsContainer = document.querySelector('.ride-options-container');

// Add event listener for clicking on ride options
rideOptionsContainer.addEventListener('click', async (event) => {
  const target = event.target;

  // Check if the clicked element is a ride option
  if (target.classList.contains('ride-option')) {
    const carType = target.dataset.carType;
    // alert(carType);

    try {
      const response = await fetch('/rideOpt/get-rider-data');
      const data = await response.json();
      riderId = data.riderId;
      const pickupLocation = data.homeLocation;
      const pickupAddress = data.pickupAddress;
      const eId = data.eId;

      const bookingResponse = await fetch('/rideOpt/search-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          riderId,
          carType,
          pickupLocation,
          eId,
          pickupAddress,
        }),
      });

      const rideRequest = await bookingResponse.json();
      console.log(rideRequest);

      if (rideRequest.message === "Ride request created successfully, awaiting driver acceptance.") {
        alert("Your ride request has been created successfully. Please wait for a driver to accept your request.");
      } else {
        alert(rideRequest.message);
      }

    } catch (error) {
      console.error(error);
    }
  }
});

// Add event listener for the Cancel Ride button
document.getElementById("cancel-ride").addEventListener("click", async () => {
  try {
    const cancelResponse = await fetch('/rideOpt/cancel-ride', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rideRequestId: sessionStorage.getItem('rideRequestId'),
      }),
    });

    const cancelResult = await cancelResponse.json();

    if (cancelResult.success) {
      alert("Your ride has been cancelled successfully.");
      document.getElementById("cancel-ride").style.display = "none";
      document.getElementById("map").style.display = "none";
      document.getElementById("view-confirmation").style.display = "none";
    } else {
      alert("Failed to cancel the ride. Please try again.");
 }
  } catch (error) {
    console.error("Error cancelling ride:", error);
  }
});

// Add event listener for the View Confirmation button
document.getElementById("view-confirmation").addEventListener("click", () => {
  const rideRequestId = sessionStorage.getItem('rideRequestId');

  window.location.href = `/rideOpt/view-confirmation/${rideRequestId}`; // Redirect to ride details page
});