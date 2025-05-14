const signinForm = document.getElementById('login-form');
const container = document.getElementById('container');
const overlayCon = document.getElementById('overlayCon');
const overlayBtn = document.getElementById('overlayBtn');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const signInContainer = document.querySelector('.sign-in-container');
const signUpContainer = document.querySelector('.sign-up-container');



// Login Form handling
signinForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dEmail = document.getElementById('driver-email').value;
    const password = document.getElementById('driver-pass').value;

    if (!dEmail || !password) {
        alert('Please fill out all fields.');
        return;
    }

    fetch('http://localhost:3005/driver/login', {  // Ensure this is the correct backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dEmail, password }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        if (data.message === "Login successful") {
            alert('Login successful');
            window.location.href = '/drive'; // Redirect on login success
        } else {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error during login.');
    });
});