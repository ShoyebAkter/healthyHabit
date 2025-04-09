const userType=JSON.parse(localStorage.getItem('user'))
document.addEventListener("DOMContentLoaded", function () {
    const productDetails = JSON.parse(localStorage.getItem("productDetails"));
    const user = JSON.parse(localStorage.getItem("user"));
    
    const div=document.querySelector('.container')
    if(!user){
        div.style.display='none'
    }
    if (productDetails) {
      // Fill standard inputs
      document.getElementById("name").value = productDetails.name || "";
      document.getElementById("description").value = productDetails.description || "";
      document.getElementById("health").value = productDetails.healthBenefits || "";
      document.getElementById("price").value = productDetails.price || "";
      document.getElementById("stock").value = productDetails.stockQuantity || "";
  
      // Replace select with readonly display for pcategory
      const pcatWrapper = document.getElementById("pcategory").parentElement;
      const pcatText = document.createElement("input");
      pcatText.type = "text";
      pcatText.className = "form-control";
      pcatText.id = "pcategory_readonly";
      pcatText.value = productDetails.productCategory || "";
      pcatText.readOnly = true;
      pcatWrapper.replaceChild(pcatText, document.getElementById("pcategory"));
  
      // Same for prcategory
      const prcatWrapper = document.getElementById("prcategory").parentElement;
      const prcatText = document.createElement("input");
      prcatText.type = "text";
      prcatText.className = "form-control";
      prcatText.id = "prcategory_readonly";
      prcatText.value = productDetails.pricingCategory || "";
      prcatText.readOnly = true;
      prcatWrapper.replaceChild(prcatText, document.getElementById("prcategory"));
  
      // Disable other inputs
      const otherInputs = document.querySelectorAll("#form input:not([id$='readonly'])");
      otherInputs.forEach(input => input.disabled = true);
  
      const button = document.getElementById("ekleButton");
      button.textContent = "Edit";
  
      let isEditable = false;
      if(userType.user_type==="sme"){
        button.addEventListener("click", function (e) {
            e.preventDefault();
            
            if (!isEditable) {
              // Enable inputs
              otherInputs.forEach(input => input.disabled = false);
      
              // Replace readonly text inputs back with select dropdowns
              const pcatSelect = document.createElement("select");
              pcatSelect.name = "pcategory";
              pcatSelect.id = "pcategory";
              pcatSelect.className = "ms-1 d-block w-100 form-control";
              pcatSelect.innerHTML = `
                <option></option>
                <option value="Reusable Health Products">Reusable Health Products</option>
                <option value="Eco-Friendly Fitness Gear">Eco-Friendly Fitness Gear</option>
                <option value="Organic Personal Care Products">Organic Personal Care Products</option>
                <option value="Home Wellness Products">Home Wellness Products</option>
              `;
              pcatSelect.value = productDetails.productcategory || "";
              pcatWrapper.replaceChild(pcatSelect, document.getElementById("pcategory_readonly"));
      
              const prcatSelect = document.createElement("select");
              prcatSelect.name = "prcategory";
              prcatSelect.id = "prcategory";
              prcatSelect.className = "ms-1 d-block w-100 form-control";
              prcatSelect.innerHTML = `
                <option></option>
                <option value="Affordable">Affordable</option>
                <option value="Moderate">Moderate</option>
                <option value="Premium">Premium</option>
              `;
              prcatSelect.value = productDetails.pricingcategory || "";
              prcatWrapper.replaceChild(prcatSelect, document.getElementById("prcategory_readonly"));
      
              button.textContent = "Save";
              isEditable = true;
            } else {
              // You can also re-save to localStorage if needed
      
              // Lock all inputs again
              const allInputs = document.querySelectorAll("#form input, #form select");
              allInputs.forEach(input => input.disabled = true);
      
              button.textContent = "Edit";
              isEditable = false;
              
              const updatedProduct = {
                product_id: productDetails.id, // Make sure you have the product ID in localStorage
                name: document.getElementById("name").value,
                description: document.getElementById("description").value,
                healthBenefits: document.getElementById("health").value,
                price: parseFloat(document.getElementById("price").value),
                stockQuantity: parseInt(document.getElementById("stock").value),
                productCategory: document.getElementById("pcategory").value,
                pricingCategory: document.getElementById("prcategory").value,
              };
              console.log(updatedProduct)
              fetch("http://localhost/healthyhabit/update_product.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedProduct),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.success) {
                    alert("Product updated!");
                  } else {
                    alert("Failed: " + data.message);
                  }
                })
                .catch((err) => console.error(err));
              
            }
          });
      }else{
        alert('Only SME can edit .')
      }
      
    }
  });
  
    // Get all vote buttons
    const voteButton = document.getElementById('voteButton');
    const productDetails = JSON.parse(localStorage.getItem("productDetails"));
    const userDetails = JSON.parse(localStorage.getItem("user"));
    // Add click event to each button
    
        voteButton.addEventListener('click', function(e) {
            e.preventDefault()
        // Make the API call
        if(userType.user_type==="resident"){
            fetch('http://localhost/healthyhabit/vote.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                resident_id: userDetails.id,
                product_id: productDetails.id
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Update vote count display
                const voteCountElement = document.getElementById(`vote-count-${productDetails.id}`);
                if (voteCountElement) {
                    voteCountElement.textContent = data.vote_count;
                }
                alert('Thank you for voting!');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting vote');
        });
        }else{
            alert("Only Resident can vote")
        }
    })
    
