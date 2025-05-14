const ScheduledRidesbtn = document.getElementById('Scheduled-Rides-btn');
const PendingRidesRequestsbtn = document.getElementById('Pending-Rides-Requests-btn');
const VehiclesAvailablebtn = document.getElementById('Vehicles-Available-btn');
const CancelledRidesbtn = document.getElementById('Cancelled-Rides-btn');

ScheduledRidesbtn.addEventListener('click', () => {
    // Redirect to ride details page
    window.location.href = '/Scheduled-Rides';
});

PendingRidesRequestsbtn.addEventListener('click', () => {
    // Redirect to rider details page
    window.location.href = '/Pending-Rides-Requests';
});

VehiclesAvailablebtn.addEventListener('click', () => {
    // Redirect to driver details page
    window.location.href = '/Vehicles-Available';
});

CancelledRidesbtn.addEventListener('click', () => {
    // Redirect to ride details page
    window.location.href = '/Cancelled-Rides';
});