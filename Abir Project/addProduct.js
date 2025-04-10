document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display products when page loads
    const div=document.querySelector('.container')
    const userType=JSON.parse(localStorage.getItem('user'))
    if(userType){
        if(userType.user_type!=="sme"){
            div.style.display='none'
          }
    }else{
        div.style.display='none'
    }
  })

document.getElementById('ekleButton').addEventListener('click', function(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const fileInput = document.getElementById('image');
    const imageFile = fileInput.files[0];
    handleImageUpload(imageFile,user);
    
});

const handleImageUpload = async (image,user) => {
    try {
      
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "ml_default"); // Replace with your preset

      console.log("Uploading image...");

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dbc2m0cft/image/upload`, // Correct Cloudinary URL
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        const newformData = {
            sme_id: user.id,
            name: document.getElementById('name').value,
            description: document.getElementById('description').value,
            healthBenefits: document.getElementById('health').value,
            price: document.getElementById('price').value,
            stockQuantity: document.getElementById('stock').value,
            productCategory: document.getElementById('pcategory').value,
            pricingCategory: document.getElementById('prcategory').value,
            imgUrl:data.secure_url
        };
    
        try {
            console.log(newformData)
            const response = await fetch('http://localhost/healthyhabit/add_product.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newformData)
            });
            
            const result = await response.json();
            // console.log(result)
            if (result.success) {
                alert('Product added successfully!');
                // Optionally reset the form or redirect
                window.location.href = 'smeView.html';
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to submit product');
        }
      } else {
        console.error("Image upload failed:", data);
        throw new Error("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };