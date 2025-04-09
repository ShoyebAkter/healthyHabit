
  document.getElementById('addProduct').addEventListener('click', function() {
    window.location.href = 'addProduct.html';
  });
  document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('user')
    localStorage.removeItem('formData')
    localStorage.removeItem('productDetails')
    window.location.href = 'login.html';
  });

  document.addEventListener('DOMContentLoaded', function() {
    // Fetch and display products when page loads
    const div=document.querySelector('.products')
    const userType=JSON.parse(localStorage.getItem('user'))
    if(userType){
      if(userType.user_type!=="sme"){
        div.style.display='none'
      }
    }else{
      div.style.display='none'
    }
    fetchProducts(userType.id)
  })

  async function fetchProducts(id) {
    try {
        const response = await fetch('http://localhost/healthyhabit/get_product.php');
        const data = await response.json();
        
        if (data.success) {
          const filteredProducts = data.products.filter(product => product.sme_id === id);
          // console.log(typeof(id))
          // You can now work with filteredProducts array
          console.log('Filtered products:', filteredProducts);
          displayProducts(filteredProducts);
        } else {
            console.error('Error:', data.message);
            
        }
    } catch (error) {
        console.error('Fetch error:', error);
        
    }
  }

  function displayProducts(products) {
    // Select the tbody element in your table
    const tbody = document.querySelector('.tables table tbody');
    
    // Clear any existing rows (if needed)
    tbody.innerHTML = '';
    
    // Build a new row for each product and append it to the tbody
    products.forEach(product => {
      const row = document.createElement('tr');
      
      // Assuming product properties match the table columns:
      // id, name, category, price, quantity, status, created
      row.innerHTML = `
        <td>${product.id}</td>
        <td><span class="name">${product.name}</span></td>
        <td>${product.productCategory}</td>
        <td>${product.price}</td>
        <td>${product.stockQuantity}</td>
        <td>${product.createdAt}</td>
        <td class="edit-cell" style="cursor:pointer; color: blue; text-decoration: underline;">
        Edit
      </td>
      `;
      row.querySelector('.edit-cell').addEventListener('click', () => {
        localStorage.setItem('productDetails',JSON.stringify(product))
        // Navigate to editProduct.html and optionally pass the product id as a query parameter
        window.location.href = `editProduct.html`;
      });
      tbody.appendChild(row);
    });
  }