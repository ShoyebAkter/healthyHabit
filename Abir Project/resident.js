document.addEventListener('DOMContentLoaded', function() {
  // Fetch and display products when page loads
  const userType=JSON.parse(localStorage.getItem('user'))
  const residentDiv=document.getElementById('residentDiv');
  if(!userType){
    residentDiv.style.display='none'
  }
  fetchProducts();
});
async function fetchProducts() {
  try {
      const response = await fetch('http://localhost/healthyhabit/get_product.php');
      const data = await response.json();
      
      if (data.success) {
          displayProducts(data.products);
      } else {
          console.error('Error:', data.message);
          // Show error to user
          document.querySelector('.main.bd-grid').innerHTML = `
              <div class="error-message">Failed to load products: ${data.message}</div>
          `;
      }
  } catch (error) {
      console.error('Fetch error:', error);
      document.querySelector('.main.bd-grid').innerHTML = `
          <div class="error-message">Network error loading products. Please try again.</div>
      `;
  }
}

function displayProducts(products) {
  const mainGrid = document.querySelector('.main.bd-grid');
  
  if (products.length === 0) {
      mainGrid.innerHTML = '<div class="no-products">No products available</div>';
      return;
  }

  // Clear existing content
  mainGrid.innerHTML = '';
  
  // Create product cards
  products.forEach(product => {
      const productCard = document.createElement('article');
      productCard.className = 'card';
      productCard.id='cardId'
      productCard.innerHTML = `
          <div class="card__img">
              <img src="${product.imageUrl || 'health.png'}" alt="${product.name}">
          </div>
          <div class="card__name">
              <p>${product.name}</p>
          </div>
          <div class="card__precis">
              <a href="#" class="card__icon"><ion-icon name="heart-outline"></ion-icon></a>
              
              <div>
                  <span class="description">${product.description}</span>
                  <span class="card__preci card__preci--now">$${product.price.toFixed(2)}</span>
              </div>
              
              <a href="#" class="card__icon" data-id="${product.id}">
                  <ion-icon name="cart-outline"></ion-icon>
              </a>
          </div>
      `;
      mainGrid.appendChild(productCard);
        
      productCard.addEventListener('click', function () {
        
        // console.log(product)
        localStorage.setItem('productDetails',JSON.stringify(product))
        window.location.href = 'EditProduct.html';
    });
  });

}

