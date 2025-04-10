let allProducts = [];
document.addEventListener('DOMContentLoaded', function() {
  // Fetch and display products when page loads
  const userType=JSON.parse(localStorage.getItem('user'))
  const residentDiv=document.getElementById('residentDiv');
  if(!userType){
    residentDiv.style.display='none'
  }
  const filterButton = document.getElementById("filter-button");
  const filterContainer = document.getElementById("filter-container");

  filterButton.addEventListener("click", () => {
    // Toggle visibility
    filterContainer.style.display =
      filterContainer.style.display === "none" || filterContainer.style.display === ""
        ? "block"
        : "none";
  });
  fetchProducts();
  
});

const checkboxes = document.querySelectorAll('#filter-container input[type="checkbox"]');

checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', applyFilters);
  });

async function fetchProducts() {
  try {
      const response = await fetch('http://localhost/healthyhabit/get_product.php');
      const data = await response.json();
      
      if (data.success) {
        allProducts = data.products;
          displayProducts(data.products);
          displayProductsVote(data.products);

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

function applyFilters() {
    console.log("entered")
    const checkedLabels = Array.from(checkboxes)
      .filter(cb => cb.checked)
      .map(cb => {
        const label = document.querySelector(`label[for="${cb.id}"]`);
        return label ? label.textContent.trim() : '';
      });
      console.log(allProducts)
    let filtered = allProducts;
  
    if (checkedLabels.includes("Health Products/Services")) {
      filtered = filtered.filter(p => p.productCategory  === "Health Products/Services");
      
    }
  
    if (checkedLabels.includes("Less than £200")) {
      filtered = filtered.filter(p => parseFloat(p.price) < 200);
      console.log(filtered)
    }
    
    displayProducts(filtered);
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
function displayProductsVote(products) {
  const mainGrid = document.querySelector('.productByVote');
  // const =allProducts;
  console.log(products)
  // Filter products with vote_count > 1
  const filteredProducts = products
    .filter(product => product.vote_count > 1)
    .sort((a, b) => b.vote_count - a.vote_count); // Sort by vote_count descending

  if (filteredProducts.length === 0) {
    mainGrid.innerHTML = '<div class="no-products">No products available</div>';
    return;
  }

  // Clear existing content
  mainGrid.innerHTML = '';

  // Create product cards
  filteredProducts.forEach(product => {
    const productCard = document.createElement('article');
    productCard.className = 'card';
    productCard.id = 'cardId';
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
      localStorage.setItem('productDetails', JSON.stringify(product));
      window.location.href = 'EditProduct.html';
    });
  });
}




document.getElementById('logout').addEventListener('click', function() {
    localStorage.removeItem('user')
    localStorage.removeItem('formData')
    localStorage.removeItem('productDetails')
    window.location.href = 'login.html';
  });

