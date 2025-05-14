const RegisteredRiderbtn = document.getElementById('Registered-Rider-btn');
const PendingRidersRequestsbtn = document.getElementById('Pending-Riders-Requests-btn');
const EditRidersDetailsbtn = document.getElementById('Edit-Riders-Details-btn');

RegisteredRiderbtn.addEventListener('click', () => {
    // Redirect to ride details page
    window.location.href = '/Registered-Riders';
});

PendingRidersRequestsbtn.addEventListener('click', () => {
    // Redirect to rider details page
    window.location.href = '/Pending-Riders-Requests';
});

EditRidersDetailsbtn.addEventListener('click', () => {
    // Redirect to driver details page
    window.location.href = '/Edit-Riders-Details';
});