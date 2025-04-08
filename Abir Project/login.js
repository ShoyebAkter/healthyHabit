const $ = (el) => document.querySelector(el);

const logInBtn = $(".container__toggle-btn--login");
const registerBtn = $(".container__toggle-btn--register");
const btnHighlightEl = $(".container__btn-highlight");
const loginForm = $(".form--login");
const registerForm = $(".form--register");

logInBtn.onclick = () => {
  loginForm.style.transform = "translateX(0%)";
  registerForm.style.transform = "translateX(100%)";
  btnHighlightEl.style.left = "0";
};

registerBtn.onclick = () => {
  loginForm.style.transform = "translateX(100%)";
  registerForm.style.transform = "translateX(0%)";
  btnHighlightEl.style.left = "110px";
};
const form = document.querySelector('.form--login');
const containerButton = document.querySelector('.container__buttons');
const options = document.getElementById('options');

//login functionality 

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  // Get form values
  const email = form.querySelector('input[placeholder="Email"]').value;
  const password = form.querySelector('input[placeholder="Password"]').value;

  try {
    const response = await fetch('http://localhost/healthyhabit/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.success) {
      // Login successful
      console.log('Login successful', data.user);
      // Store user data in localStorage/sessionStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      if(data.user.user_type==="sme"){
        window.location.href = 'smeView.html';
      }else{
        window.location.href = 'residentView.html';
      }
      // Redirect to dashboard
      
    } else {
      // Login failed
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred during login');
  }
});

registerForm.addEventListener('submit',function(e){
  e.preventDefault();
  const username = registerForm.querySelector('input[placeholder="Name"]').value;
  const password = registerForm.querySelector('input[placeholder="Password"]').value;
  const contact = registerForm.querySelector('input[placeholder="Contact"]').value;
  const email = registerForm.querySelector('input[placeholder="Email"]').value;

  if(username && password && contact && email){
    containerButton.style.display = 'none';        // Hide form
    registerForm.style.display = 'none';        // Hide form
    options.style.display = 'block';
  }else {
    alert('Invalid username or password');
  }
})

const userTypeSelect = document.getElementById('userType');
    const companyFields = document.getElementById('companyFields');
    const residentFields = document.getElementById('residentFields');
    const councilFields = document.getElementById('councilFields');
    const optionsDiv = document.getElementById('options');
    const loginBackBtn = document.getElementById('loginBackBtn');
    const loginBackSMEBtn = document.getElementById('loginBackSMEBtn');
    const loginBackCouncilBtn = document.getElementById('loginBackCouncilBtn');
    const loginCouncilBtn = document.getElementById('loginCouncilBtn');

    loginBackSMEBtn.addEventListener('click',function(){
      optionsDiv.style.display='block';
      companyFields.style.display = 'none';
      residentFields.style.display = 'none';
    })
    loginBackBtn.addEventListener('click',function(){
      optionsDiv.style.display='block';
      companyFields.style.display = 'none';
      residentFields.style.display = 'none';
    })
    loginBackCouncilBtn.addEventListener('click',function(){
      optionsDiv.style.display='block';
      companyFields.style.display = 'none';
      residentFields.style.display = 'none';
      councilFields.style.display='none'
    })
    userTypeSelect.addEventListener('change', function() {
      if (this.value === 'sme') {
        optionsDiv.style.display = 'none'; // hide the dropdown
        companyFields.style.display = 'block'; // show new inputs
      } else if(this.value==='resident'){
        optionsDiv.style.display = 'none'; // hide the dropdown
        residentFields.style.display = 'block';
      } else{
        councilFields.style.display='block';
        optionsDiv.style.display='none'
      }
    });

    document.addEventListener('DOMContentLoaded', function() {
      const areaSelect = document.getElementById('area');
      
      // Fetch areas from backend
      fetch('http://localhost/healthyhabit/get_area.php')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(areas => {
              // Clear loading state if any
              areaSelect.innerHTML = '<option value="">-- Select Area --</option>';
              
              // Add area options
              areas.forEach(area => {
                  const option = document.createElement('option');
                  option.value = area.id;
                  option.textContent = area.name;
                  areaSelect.appendChild(option);
              });
          })
          .catch(error => {
              console.error('Error loading areas:', error);
              areaSelect.innerHTML = '<option value="">Error loading areas</option>';
          });
  });

  document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const formObject = {};
    
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Store in localStorage (note: passwords in localStorage is not secure)
    localStorage.setItem('formData', JSON.stringify(formObject));
    
    console.log('Form data saved to localStorage:', formObject);
    // alert('Form data saved locally!');
    
    // Optional: Clear the form after saving
    this.reset()
  })

  document.getElementById('loginResidentBtn').addEventListener('click', function() {
    // Collect all form data
    const residentData = {
        area_id: document.getElementById('area').value,
        area_name: document.getElementById('area').options[document.getElementById('area').selectedIndex].text,
        age: document.getElementById('age').value,
        gender: document.getElementById('gender').value,
        interest: document.getElementById('interest').value
    };

    // Validate required fields
    if (!residentData.area_id || !residentData.age || !residentData.gender || !residentData.interest) {
        alert('Please fill in all required fields');
        return;
    }

    // Get saved form data
    const savedFormData = JSON.parse(localStorage.getItem('formData'));
    if (!savedFormData) {
        alert('No registration data found! Please complete the first form.');
        return;
    }

    // Merge data
    const completeData = {
        ...savedFormData,
        ...residentData
    };

    console.log('Submitting:', completeData);
    
    // Send to server
    fetch('http://localhost/healthyhabit/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', // Important header
        },
        body: JSON.stringify(completeData) // Must stringify the data
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw err; });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            // Optional: Clear localStorage or redirect
            localStorage.removeItem('formData');
            // window.location.href = 'success.html';
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    })
    // .catch(error => {
    //     console.error('Error:', error);
    //     alert(error.message || 'Registration failed. Please try again.');
    // });
});

  document.getElementById("loginSMEBtn").addEventListener("click", async function (e) {
    e.preventDefault();

    // Get form values
    const companyName = document.getElementById("companyName").value.trim();
    const contact = document.getElementById("contactInfo").value.trim();

    // Get data from localStorage
    const formData = JSON.parse(localStorage.getItem("formData"));

    if (!formData || !formData.name || !formData.email || !formData.password) {
        alert("Missing user data in localStorage.");
        return;
    }

    // Optional: Add some validation
    if (!companyName || !contact) {
        alert("Please fill in all fields.");
        return;
    }
    const score=10;
    const payload = {
        companyName: companyName,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        contact: contact,
        sustainability_score: score // default score, or you can make it dynamic
    };

    try {
        const response = await fetch("http://localhost/healthyhabit/add_sme.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Registered successfully!");
            localStorage.removeItem('formData')
            // Optionally redirect or clear form
        } else {
            alert(result.error || "Registration failed.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Something went wrong. Please try again.");
    }
});
