document.getElementById('ekleButton').addEventListener('click', async function(event) {
    event.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Get all form values
    const formData = {
        sme_id: user.id,
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        healthBenefits: document.getElementById('health').value,
        price: document.getElementById('price').value,
        stockQuantity: document.getElementById('stock').value,
        productCategory: document.getElementById('pcategory').value,
        pricingCategory: document.getElementById('prcategory').value
    };
    // console.log(formData)
    try {
        const response = await fetch('http://localhost/healthyhabit/add_product.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        console.log(result)
        if (result.success) {
            alert('Product added successfully!');
            // Optionally reset the form or redirect
            // window.location.href = 'products.html';
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to submit product');
    }
});