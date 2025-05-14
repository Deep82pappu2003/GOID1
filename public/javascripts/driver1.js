const RegisteredDriverbtn = document.getElementById('Registered-Driver-btn');
const PendingDriversRequestsbtn = document.getElementById('Pending-Drivers-Requests-btn');
const EditDriversDetailsbtn = document.getElementById('Edit-Drivers-Details-btn');

RegisteredDriverbtn.addEventListener('click', () => {
    // Redirect to ride details page
    window.location.href = '/Registered_Drivers';
});

PendingDriversRequestsbtn.addEventListener('click', () => {
    // Redirect to rider details page
    window.location.href = '/Pending-Drivers-Requests';
});

EditDriversDetailsbtn.addEventListener('click', () => {
    // Redirect to driver details page
    window.location.href = '/Edit-Drivers-Details';
});