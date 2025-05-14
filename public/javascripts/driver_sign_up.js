const container = document.getElementById('container');
const overlayCon = document.getElementById('overlayCon');
const overlayBtn = document.getElementById('overlayBtn');
const signInBtn = document.getElementById('signInBtn');
const signUpBtn = document.getElementById('signUpBtn');
const signInContainer = document.querySelector('.sign-in-container');
const signUpContainer = document.querySelector('.sign-up-container');

const registerForm = document.getElementById('register-form');
const signinForm = document.getElementById('driver-login-form');

const verifyBtn = document.getElementById('verify-btn');
const otpModal = document.getElementById('otp-modal');
const otpModalInput = document.getElementById('otp-modal-input');
const otpModalBtn = document.getElementById('otp-modal-btn');

verifyBtn.disabled = true;
signUpBtn.disabled = true;




// Add event listener to the overlay button
overlayBtn.addEventListener('click', () => {
  container.classList.toggle('right-panel-active');

  overlayBtn.classList.remove('btnScaled');
  window.requestAnimationFrame(() => {
    overlayBtn.classList.add('btnScaled');
  });
});

// Add event listener to the sign in button
signInBtn.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

// Add event listener to the sign up button
signUpBtn.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});


document.getElementById('driver_mail_id').addEventListener('input', () => {
    const email = document.getElementById('driver_mail_id').value;
    verifyBtn.disabled = !email;
});


// Add event listener to verify button
verifyBtn.addEventListener('click', async () => {
    
    const email = document.getElementById('driver_mail_id').value;
try{
    const response = await fetch('http://localhost:3005/driver/send-otp', {  
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dEmail: email }), 
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
    const email = document.getElementById('driver_mail_id').value;

    if (!otp) {
        alert('Please fill out all fields.');
        return;
    }

    if ( otp) {
        // Verify the OTP
        try {
            const response = await fetch('http://localhost:3005/driver/verify-otp', {  
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dEmail: email, otp }), 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }


            const data = await response.json();
            if (data.success) {
                // OTP is verified, enable the sign-up form
                otpModal.style.display = 'none'; // Hide the modal
                registerForm.style.display = 'block'; // Show the sign-up form
                signUpBtn.disabled = false; // Enable the sign-up button
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
document.getElementById('driver_address').addEventListener('input', () => {
    const address = document.getElementById('driver_address').value;
    if (address) {
      document.getElementById('get-location-btn').style.display = 'block';
    } else {
      document.getElementById('get-location-btn').style.display = 'none';
    }
  });
  
  // Add event listener to Get Location button
  document.getElementById('get-location-btn').addEventListener('click', () => {
    const address = document.getElementById('driver_address').value;
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

  const dName = document.getElementById('driver_name').value;
  const dEmail = document.getElementById('driver_mail_id').value;
  const dcontact = document.getElementById('driver_contact').value;
  const vehicleno = document.getElementById('vehicle_no').value;
//   const license = document.getElementById('license_no').value;
  const dAddress = document.getElementById('driver_address').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm_password').value;
  const latitude = document.getElementById('latitude').value;
  const longitude = document.getElementById('longitude').value;
  const carType = document.getElementById('carType').value; // Get the selected car type
  const govtIdCard = document.getElementById('govt_IdCard').files[0];
  const DrivingLicense = document.getElementById('Driving_License').files[0];


  if (!dName  || !dEmail || !dcontact || !vehicleno || !dAddress || !password || !confirmPassword||!carType || !govtIdCard || !DrivingLicense) {
      alert('Please fill out all fields.');
      return;
  }

  if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(dEmail)) {
      alert('Invalid email format.');
      return;
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  if (!passwordRegex.test(password)) {
      alert('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
  }

//   const govtIdRegex = /^\d{4}\s?\d{4}\s?\d{4}$/;
//   if (!govtIdRegex.test(govtId)) {
//       alert('Invalid GovtId format');
//       return;
//   }

//   const licenseRegex = /^[A-Z]{2}[0-9]{2}\s?[0-9]{4}\s?[0-9]{7}$/;
//   if (!licenseRegex.test(license)) {
//       alert('Invalid License format');
//       return;
//   }

function validateFiles(...files) {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5 MB
    return files.every(file => file && validTypes.includes(file.type) && file.size <= maxSize);
}

if (!validateFiles(govtIdCard, DrivingLicense)) {
    alert('Please upload valid files (PDF, JPG, JPEG, PNG) and ensure they are under 5 MB.');
    return;
}

// Create a FormData object for file and data submission
const formData = new FormData();
formData.append('dName', dName);
formData.append('dEmail', dEmail);
formData.append('dcontact', dcontact);
formData.append('vehicleno', vehicleno);
// formData.append('license', license);
formData.append('dAddress', dAddress);
formData.append('password', password);
formData.append('confirmPassword', confirmPassword);
formData.append('latitude', latitude);
formData.append('longitude', longitude);
formData.append('carType', carType);

// Append files to FormData
formData.append('govtIdCard', govtIdCard);
formData.append('DrivingLicense', DrivingLicense);

//   fetch('http://localhost:3005/driver/register', {  // Ensure this is the correct backend URL
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//           dName,
//           dEmail,
//           dcontact,
//           govtId,
//           license,
//           dAddress,
//           latitude,
//           longitude,
//           password,
//           carType,
//       }),
//   })
//   .then((response) => {
//       if (!response.ok) {
//           return response.json().then((data) => {
//               throw new Error(data.message);
//           });
//       }
//       return response.json();
//   })
//   .then((data) => {
//       console.log(data.message);
//       alert(data.message);
//       const handleResponse = (message) => {
//         console.log(message);
//         alert(message);
//         clearFormFields();
//       };
    
//     // Check the response message
//     alert(data.message);
    
//     if (data.message === "Driver created successfully") {
//        console.log(data.message);
//        alert(data.message);
//        window.location.href = '/drive';
//     } else {
//        handleResponse(data.message);
//     }
//   })
//   .catch((error) => {
//       console.error('Error:', error);
//       alert(error.message);
//       clearFormFields();
//   });
// });

async function registerDriver(formData) {
    try {
        const response = await fetch('http://localhost:3005/driver/register', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        if (response.ok && data.message === 'Driver created successfully') {
            alert(data.message);
            clearFormFields();
            window.location.href = '/drive';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed.');
    }
}

registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(registerForm); // Collect all form data

    // Call the registerDriver function with the form data
    registerDriver(formData);
});

// Function to clear form fields
function clearFormFields() {
  document.getElementById('driver_name').value = '';
  document.getElementById('driver_mail_id').value = '';
  document.getElementById('driver_contact').value = '';
  document.getElementById('govt_id').value = '';
  document.getElementById('license_no').value = '';
  document.getElementById('driver_address').value = '';
  document.getElementById('password').value = '';
  document.getElementById('vehicle_no').value = '';
  document.getElementById('confirm_password').value = '';
  document.getElementById('govt_IdCard').value='';
  document.getElementById('Driving_License').value='';
}



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