const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');

const verifyBtn = document.getElementById('verify-btn');
const signupBtn = document.getElementById('signup-btn');
const otpModal = document.getElementById('otp-modal');
const otpModalInput = document.getElementById('otp-modal-input');
const otpModalBtn = document.getElementById('otp-modal-btn');



// Disable verify and signup buttons initially
verifyBtn.disabled = true;
signupBtn.disabled = true;

// Add event listener to email input field
document.getElementById('employee_mail_id').addEventListener('input', () => {
    const email = document.getElementById('employee_mail_id').value;
    verifyBtn.disabled = !email;
});

// Add event listener to verify button
verifyBtn.addEventListener('click', async () => {
    
        const email = document.getElementById('employee_mail_id').value;
    try{
        const response = await fetch('http://localhost:3005/rider/send-otp', {  
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eEmail: email }), 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.success) {
            
            otpModal.style.display = 'block';
        } else {
            alert('Error sending OTP');
        }
        } catch (error) {
            console.error(error);
            alert('Error sending OTP.');
        }
    });

        
otpModalBtn.addEventListener('click', async () => {
            const otp = otpModalInput.value;
            const email = document.getElementById('employee_mail_id').value;

            if ( otp) {
                // Verify the OTP
                try {
                    const response = await fetch('http://localhost:3005/rider/verify-otp', {  
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ eEmail: email, otp }), 
                    });
        
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
        

                    const data = await response.json();
                    if (data.success) {
                        otpModal.style.display = 'none'; 
                        signupForm.style.display = 'block';
                        signupBtn.disabled = false; 
                    } else {
                        if (data.message === 'OTP has expired') {
                            alert('OTP has expired. Please request a new OTP.');
                          } else {
                            alert('Invalid OTP. Please try again.');
                          }    
                                                    
                        }
                } catch (error) {
                    console.error(error);
                    alert('Error verifying OTP.');
                }
            }
        });
   



// Add event listener to address input field
document.getElementById('employee_address').addEventListener('input', () => {
    const address = document.getElementById('employee_address').value;
    if (address) {
      document.getElementById('get-location-btn').style.display = 'block';
    } else {
      document.getElementById('get-location-btn').style.display = 'none';
    }
  });
  
  // Add event listener to Get Location button
  document.getElementById('get-location-btn').addEventListener('click', () => {
    const address = document.getElementById('employee_address').value;
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyDu3n8SgW9peGPFRl5Qe7fYvGdeuk8xzrI`;
    fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.status === 'OK'){
        const lat = data.results[0].geometry.location.lat;
        const lng = data.results[0].geometry.location.lng;
        document.getElementById('latitude').value = lat;
        document.getElementById('longitude').value = lng;
        console.log(`Latitude: ${lat}, Longitude: ${lng}`);
      } else {
        alert('Location not found');
      }
    })
    .catch(error => {
      console.error(error);
      alert('Error fetching location');
    });
});


//   function initMap() {
//     const mapContainer = document.getElementById('map-container');
//     const map = new google.maps.Map(mapContainer, {
//       center: { lat: 37.7749, lng: -122.4194 },
//       zoom: 13,
//     });
//   }


signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const eName = document.getElementById('employee_name').value;
    const eId = document.getElementById('employee_id').value;
    const eEmail = document.getElementById('employee_mail_id').value;
    const contact = document.getElementById('employee_contact').value;
    const eAddress = document.getElementById('employee_address').value;

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;
    const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;

    if (!eName || !eId || !eEmail || !contact || !eAddress || !password || !confirmPassword) {
        alert('Please fill out all fields.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(eEmail)) {
        alert('Invalid email format.');
        return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
        return;
    }

    const idRegex = /^E_\d{4}$/;
    if (!idRegex.test(eId)) {
        alert('Invalid Employee ID format.');
        return;
    }

    fetch('http://localhost:3005/rider/register', {  // Ensure this is the correct backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            eName,
            eId,
            eEmail,
            contact,
            eAddress,
            latitude,
            longitude,
            password,
        }),
    })
    .then((response) => {
        if (!response.ok) {
            return response.json().then((data) => {
                throw new Error(data.message);
            });
        }
        return response.json();
    })
    .then((data) => {
        console.log(data.message);
        alert(data.message);
            
        const handleResponse = (message) => {
            console.log(message);
            alert(message);
            clearFormFields();
        };
            
            // Check the response message
        // alert(data.message);
            
        if (data.message === "User created successfully") {
            console.log(data.message);
            alert(data.message);
            window.location.href = '/home';
        } else {
            handleResponse(data.message);
        }
    })
    
    .catch((error) => {
        console.error('Error:', error);
        alert(error.message);
        clearFormFields();
    });
});

// Function to clear form fields
function clearFormFields() {
    document.getElementById('employee_name').value = '';
    document.getElementById('employee_id').value = '';
    document.getElementById('employee_mail_id').value = '';
    document.getElementById('employee_contact').value = '';
    document.getElementById('employee_address').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirm_password').value = '';
}

// Login Form handling
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const eId = document.getElementById('employee-id').value;
    const password = document.getElementById('password-log').value;

    if (!eId || !password) {
        alert('Please fill out all fields.');
        return;
    }

    fetch('http://localhost:3005/rider/login', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eId, password }),
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
            window.location.href = '/home'; 
        } else {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error during login.');
    });
});