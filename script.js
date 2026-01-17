// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in header
function updateCartCount() {
  const countElements = document.querySelectorAll('.cart-count');
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  
  countElements.forEach(element => {
    element.textContent = totalItems;
  });
  
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart function
function addToCart(product, selectedSize) {
  const existingItem = cart.find(item => 
    item.id === product.id && item.size === selectedSize
  );

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image[0],
      size: selectedSize,
      quantity: 1
    });
  }

  updateCartCount();
  showAddToCartFeedback();
}

// Show feedback when item is added to cart
function showAddToCartFeedback() {
  const feedback = document.createElement('div');
  feedback.className = 'cart-feedback';
  feedback.innerHTML = '<i class="fas fa-check"></i> Item added to cart!';
  document.body.appendChild(feedback);
  
  setTimeout(() => {
    feedback.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    feedback.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(feedback);
    }, 300);
  }, 2000);
}

// Remove item from cart
function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
  updateCartCount();
}

// Update quantity in cart
function updateQuantity(index, change) {
  cart[index].quantity += change;
  
  if (cart[index].quantity < 1) {
    cart.splice(index, 1);
  }
  
  renderCart();
  updateCartCount();
}

// Render cart items
function renderCart() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    totalPriceElement.textContent = '₹0';
    return;
  }
  
  let totalPrice = 0;
  
  cart.forEach((item, index) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="cart-item-image">
      <div class="cart-item-details">
        <div class="cart-item-header">
          <h3 class="cart-item-title">${item.name}</h3>
          <span class="cart-item-price">₹${item.price * item.quantity}</span>
        </div>
        <div class="cart-item-info">
          <span>Size: ${item.size}</span>
          <span>Price: ₹${item.price}</span>
        </div>
        <div class="cart-item-footer">
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button onclick="updateQuantity(${index}, -1)">-</button>
              <span>${item.quantity}</span>
              <button onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <span class="remove-item" onclick="removeFromCart(${index})">
              <i class="fas fa-trash"></i> Remove
            </span>
          </div>
        </div>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
    totalPrice += item.price * item.quantity;
  });
  
  totalPriceElement.textContent = `₹${totalPrice}`;
}

// Continue shopping
function continueShopping() {
  window.location.href = 'store.html';
}

// Proceed to checkout
function proceedToCheckout() {
  if (cart.length === 0) {
    alert('Your cart is empty. Please add some items before checkout.');
    return;
  }
  window.location.href = 'checkout.html';
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  
  // Render cart if on cart page
  if (document.getElementById('cart-items')) {
    renderCart();
  }
  
  // Slider functionality for index page
  const slides = document.querySelectorAll('.slide');
  if (slides.length > 0) {
    let currentSlide = 0;
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
      });
    }
    
    showSlide(currentSlide);
    
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }
  
  // Product filtering and display for store page
  const productGrid = document.getElementById('productGrid');
  if (productGrid) {
    const seasonFilter = document.getElementById('seasonFilter');
    const priceFilter = document.getElementById('priceFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    
    // Set season filter from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const seasonParam = urlParams.get('season');
    if (seasonParam && seasonFilter) {
      seasonFilter.value = seasonParam.charAt(0).toUpperCase() + seasonParam.slice(1);
    }
    
    function createImageSlider(images) {
      return `
        <div class="image-slider">
          ${images.map((src, index) => `
            <img src="${src}" class="${index === 0 ? 'active' : ''}" />
          `).join('')}
          <div class="slider-controls">
            <button class="prev-slide">‹</button>
            <button class="next-slide">›</button>
          </div>
        </div>
      `;
    }
    
    function renderProducts(season = "All", priceRange = "All", category = "All") {
      productGrid.innerHTML = '';
      
      let filteredProducts = products.filter(product => 
        (season === "All" || product.season === season) && 
        (category === "All" || product.category === category)
      );
      
      if (priceRange !== "All") {
        if (priceRange === "below500") {
          filteredProducts = filteredProducts.filter(product => product.price < 500);
        } else if (priceRange === "500to1000") {
          filteredProducts = filteredProducts.filter(product => product.price >= 500 && product.price <= 1000);
        } else if (priceRange === "above1000") {
          filteredProducts = filteredProducts.filter(product => product.price > 1000);
        }
      }
      
      filteredProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        const sizeOptions = product.size.map(size => `
          <option value="${size}">${size}</option>
        `).join('');
        
        productCard.innerHTML = `
          ${createImageSlider(product.image)}
          <div class="product-info">
            <h3>${product.name}</h3>
            <p class="description">${product.description}</p>
            <p class="price">₹${product.price}</p>
            <p class="category">Category: ${product.category}</p>
            <p class="season">Season: ${product.season}</p>
            <p class="rating">Rating: ${product.rating} / 5 (${product.reviews} reviews)</p>
            <p class="feedback"><em>${product.feedback}</em></p>
            <label>Size:
              <select class="size-selector">
                ${sizeOptions}
              </select>
            </label>
            <div class="product-actions">
              <button class="add-cart" data-id="${index}">Add to Cart</button>
              <button class="buy-now" onclick="window.location.href='login.html'">Buy Now</button>
            </div>
          </div>
        `;
        
        productGrid.appendChild(productCard);
      });
      
      // Initialize sliders
      initSliders();
      
      // Add event listeners to Add to Cart buttons
      document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', function() {
          const productId = parseInt(this.getAttribute('data-id'));
          const product = products[productId];
          const sizeSelector = this.closest('.product-card').querySelector('.size-selector');
          const selectedSize = sizeSelector.value;
          
          addToCart(product, selectedSize);
        });
      });
    }
    
    function initSliders() {
      document.querySelectorAll('.image-slider').forEach(slider => {
        const images = slider.querySelectorAll('img');
        let currentIndex = 0;
        
        const nextBtn = slider.querySelector('.next-slide');
        const prevBtn = slider.querySelector('.prev-slide');
        
        if (nextBtn && prevBtn) {
          nextBtn.addEventListener('click', () => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex + 1) % images.length;
            images[currentIndex].classList.add('active');
          });
          
          prevBtn.addEventListener('click', () => {
            images[currentIndex].classList.remove('active');
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            images[currentIndex].classList.add('active');
          });
        }
      });
    }
    
    // Event listeners for filters
    if (seasonFilter) {
      seasonFilter.addEventListener('change', () => {
        renderProducts(seasonFilter.value, priceFilter.value, categoryFilter.value);
      });
    }
    
    if (priceFilter) {
      priceFilter.addEventListener('change', () => {
        renderProducts(seasonFilter.value, priceFilter.value, categoryFilter.value);
      });
    }
    
    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => {
        renderProducts(seasonFilter.value, priceFilter.value, categoryFilter.value);
      });
    }
    
    // Initial render
    renderProducts(
      seasonFilter ? seasonFilter.value : "All",
      priceFilter ? priceFilter.value : "All",
      categoryFilter ? categoryFilter.value : "All"
    );
  }
});

// Product data
const products = [
  {
    id: 1,
    name: "Cotton T-Shirt",
    description: "Soft and breathable cotton T-shirt, perfect for summer.",
    price: 499,
    category: "Men",
    season: "Summer",
    rating: 4.5,
    reviews: 120,
    feedback: "Very comfortable and good quality!",
    size: ["S", "M", "L", "XL"],
    image: ["shirt1.jpg", "shirt2.jpg", "shirt3.jpg"]
  },
{
      name: "Denim Shorts",
      description: "Trendy denim shorts with a relaxed fit.",
      price: 799,
      category: "Men",
      season: "Winter",
      rating: 4.3,
      reviews: 85,
      feedback: "Looks great and fits well.",
      size: ["S", "M", "L"],
      image: ["short1.jpg", "short2.jpg"]
    },
    {
      name: "Cute coffee pockets floral",
      description: "Floral dress with pockets-perfect for your little sunshine summer twirls.",
      price: 599,
      category: "Kids",
      season: "Summer",
      rating: 4.2,
      reviews: 85,
      feedback: "Looks very cute for girls.",
      size: ["S", "M", "L"],
      image: ["floral1.jpg", "floral2.jpg"]
    },
   {
      name: "Wrap neck skirts",
      description: "Elegant wrap neck skirts for stylish everyday look.",
      price: 1999,
      category: "Kids",
      season: "Summer",
      rating: 4,
      reviews: 63,
      feedback: "Super comfortable and stylish.",
      size: ["S", "M", "L"],
      image: ["skirt1.jpg", "skirt2.jpg"]
    },
   {
      name: "collar short shirt",
      description: "Stylish comfort.",
      price: 899,
      category: "Men",
      season: "Summer",
      rating: 4,
      reviews: 45,
      feedback: "Loved it.",
      size: ["S", "M", "L"],
      image: ["collar1.jpg", "collar2.jpg"]
    },
   {
      name:" Cotton shirt",
      description: "Breathable elegance.",
      price: 999,
      category: "Men",
      season: "Summer",
      rating: 4.2,
      reviews: 23,
      feedback: "Super comfy.",
      size: ["S", "M", "L"],
      image: ["a1.jpg", "a2.jpg"]
    },
  {
      name: "Cotton hoodie",
      description: "Cozy essential.",
      price: 1799,
      category: "Men",
      season: "Summer",
      rating: 4.5,
      reviews: 90,
      feedback: "Perfect warmth.",
      size: ["S", "M", "L"],
      image: ["a3.jpg", "a4.jpg"]
    },
  {
      name: "cotton hat",
      description: "Lightweight shade.",
      price: 399,
      category: "Men",
      season: "Summer",
      rating: 4,
      reviews: 85,
      feedback: "so comfy.",
      size: ["S", "M", "L"],
      image: ["a5.jpg"]
    },
  {
      name: "shoes for men",
      description: "Sleek comfort.",
      price: 999,
      category: "Men",
      season: "Summer",
      rating: 4,
      reviews: 50,
      feedback: "excellent fit.",
      size: ["S", "M", "L"],
      image: ["a6.jpg", "a7.jpg"]
    },

{
      name: "Sanddles for women",
      description: "Elegant stride.",
      price: 1799,
      category: "Women",
      season: "Summer",
      rating: 4.3,
      reviews: 85,
      feedback: "Super stylish.",
      size: ["S", "M", "L"],
      image: ["a8.jpg", "a9.jpg"]
    },
{
      name: "Kurthi",
      description: "Breezy elegance.",
      price: 1499,
      category: "Women",
      season: "Summer",
      rating: 4.2,
      reviews: 75,
      feedback: "Light,comfy and perfect for summer.",
      size: ["S", "M", "L"],
      image: ["a10.jpg", "a11.jpg"]
    },
 {
      name: "Sweat shirt",
      description: "Warm hug.",
      price: 1399,
      category: "Kids",
      season: "Winter",
      rating: 4,
      reviews: 85,
      feedback: "Super cozy and perfect for chilly days!.",
      size: ["S", "M", "L"],
      image: ["a12.jpg", "a13.jpg"]
    },
  {
      name: "Hoodies",
      description: "Snug style.",
      price: 999,
      category: "Kids",
      season: "Winter",
      rating: 4.3,
      reviews: 85,
      feedback: "Keeps me warm and looks great.",
      size: ["S", "M", "L"],
      image: ["a14.jpg", "a15.jpg"]
    },
 {
      name: "Winter coat",
      description: "Timeless warmth .",
      price: 799,
      category: "Men",
      season: "Winter",
      rating: 4.3,
      reviews: 60,
      feedback: "perfect for cold weather.",
      size: ["S", "M", "L"],
      image: ["b11.jpg", "b12.jpg"]
    },
{
      name: "Hat",
      description: "Cozy cover.",
      price: 399,
      category: "Men",
      season: "Winter",
      rating: 3.5,
      reviews: 85,
      feedback: "Warm,soft,and fits perfectly.",
      size: ["S", "M", "L"],
      image: ["b13.jpg", "b14.jpg"]
    },
{
      name: "Shoes",
      description: "Frost-ready.",
      price: 799,
      category: "Men",
      season: "Winter",
      rating: 4,
      reviews: 80,
      feedback: "Warm,durable and great for cold days.",
      size: ["S", "M", "L"],
      image: ["b5.jpg", "b6.jpg"]
    },
{
      name: "Winter Luxe parka Coat",
      description: "perfect for snowy strolls.",
      price: 899,
      category: "Women",
      season: "Winter",
      rating: 4.3,
      reviews: 85,
      feedback: "Super warm and elegant -loved the fit.",
      size: ["S", "M", "L"],
      image: ["b7.jpg", "b8.jpg"]
    },
{
      name: "Cozy Cutie Hoodie for girls",
      description: "perfect for playful winter days.",
      price: 799,
      category: "Women",
      season: "Winter",
      rating: 4.5,
      reviews: 85,
      feedback: "Super cute and warm-my girl absolutely loved it!.",
      size: ["S", "M", "L"],
      image: ["b9.jpg", "b10.jpg"]
    },

 {
      name: "Middi",
      description: "Warm and elegant middi.",
      price: 499,
      category: "Women",
      season: "Winter",
      rating: 4.3,
      reviews: 23,
      feedback: "Loved the fit-stylish,comfy,and great for chilly days.",
      size: ["S", "M", "L"],
      image: ["c1.jpg", "c2.jpg"]
    },
{
      name: "Women casual shoes",
      description: "Stylish and warm casual shoes perfect for winter comfort.",
      price: 799,
      category: "Women",
      season: "Winter",
      rating: 4.3,
      reviews: 75,
      feedback: "Great grip and super cozy.",
      size: ["S", "M", "L"],
      image: ["c3.jpg", "c4.jpg"]
    },
{
      name: "Spring style blazer beige",
      description: "Stylish comfort.",
      price: 1499,
      category: "Men",
      season: "Spring",
      rating: 4.3,
      reviews: 63,
      feedback: "Classy looks.",
      size: ["S", "M", "L"],
      image: ["c5.jpg", "c6.jpg"]
    },
{
      name: "Spring dress+denim jacket",
      description: "Fresh layers.",
      price: 699,
      category: "Women",
      season: "Spring",
      rating: 4.1,
      reviews: 23,
      feedback: "Chic combo.",
      size: ["S", "M", "L"],
      image: ["c7.jpg", "c8.jpg"]
    },
{
      name: "Trousers set",
      description: "Breezy,modern,smart casual.",
      price: 1499,
      category: "Women",
      season: "Spring",
      rating: 4.8,
      reviews: 87,
      feedback: "Effortlessely stylish.",
      size: ["S", "M", "L"],
      image: ["c9.jpg", "c10.jpg"]
    },
{
      name: "casual shirts",
      description: "light,relaxed,breathable fit.",
      price: 499,
      category: "Men",
      season: "Spring",
      rating: 4.5,
      reviews: 29,
      feedback: "Easy going vibe.",
      size: ["S", "M", "L"],
      image: ["c11.jpg", "c12.jpg"]
    },
{
      name: "kids' olive cordudory set ",
      description: "Cozy,trendy,playful outfit.",
      price: 499,
      category: "Kids",
      season: "Spring",
      rating: 4.8,
      reviews: 63,
      feedback: "Adorably stylish.",
      size: ["S", "M", "L"],
      image: ["c13.jpg", "c14.jpg"]
    },
{
      name: "Bowknot decor flower pattern dress",
      description: "Soft ,cute,spring-ready.",
      price: 299,
      category: "Kids",
      season: "Spring",
      rating: 4.3,
      reviews: 28,
      feedback: "Delightfully charming.",
      size: ["S", "M", "L"],
      image: ["c15.jpg", "c16.jpg"]
    },
{
      name: "Classical Men casual shoes",
      description: "Durable,sleek,all-day comfort.",
      price: 1499,
      category: "Men",
      season: "Spring",
      rating: 4.3,
      reviews: 65,
      feedback: "Stylishly reliable.",
      size: ["S", "M", "L"],
      image: ["c17.jpg", "c18.jpg"]
    },
{
      name: "Front stake shoes",
      description: "Elegant,sharp,standout design.",
      price: 1999,
      category: "Women",
      season: "Spring",
      rating: 4.7,
      reviews: 73,
      feedback: "Confidently chic.",
      size: ["S", "M", "L"],
      image: ["c19.jpg", "c20.jpg"]
    },
{
      name: "kids fancy High Heels",
      description: "Sparkly,playful,part-ready.",
      price: 899,
      category: "Kids",
      season: "Spring",
      rating: 4.3,
      reviews: 65,
      feedback: "Cute and fun.",
      size: ["S", "M", "L"],
      image: ["c21.jpg", "c22.jpg"]
    },
{
      name: "Trendy crop-top",
      description: "Bold,breezy.",
      price: 1599,
      category: "Women",
      season: "Autumn",
      rating: 4,
      reviews: 63,
      feedback: "Stylish and elegant.",
      size: ["S", "M", "L"],
      image: ["d1.jpg", "d2.jpg"]
    },

{
      name: "Autumn casual Zip jacket",
      description: "Light weight,layered comfort.",
      price: 899,
      category: "Men",
      season: "Autumn",
      rating: 4.9,
      reviews: 89,
      feedback: "Perfectly transitional.",
      size: ["S", "M", "L"],
      image: ["d3.jpg", "d4.jpg"]
    },

{
      name: "classic Leather belts",
      description: "Durable,sleek,everday essential.",
      price: 699,
      category: "Men",
      season: "Autumn",
      rating: 4,
      reviews: 38,
      feedback: "Smart and reliable.",
      size: ["S", "M", "L"],
      image: ["d5.jpg", "d6.jpg"]
    },

{
      name: "Women's Ankle Boots",
      description: "Warm,chic,season-ready style.",
      price: 899,
      category: "Women",
      season: "Autumn",
      rating: 4.1,
      reviews: 45,
      feedback: "Stylishly cozy.",
      size: ["S", "M", "L"],
      image: ["d7.jpg", "d8.jpg"]
    },

{
      name: "Boys checkered suspender outfit",
      description: "Dapper,photo-ready look.",
      price: 699,
      category: "Kids",
      season: "Autumn",
      rating: 4.2,
      reviews: 65,
      feedback: "Absolutely adorable.",
      size: ["S", "M", "L"],
      image: ["d9.jpg", "d10.jpg"]
    },

{
      name: "Boy's checker hoodie set",
      description: "Cool,comfy,street-style.",
      price: 1199,
      category: "Kids",
      season: "Autumn",
      rating: 4.3,
      reviews: 65,
      feedback: "Trend and playful.",
      size: ["S", "M", "L"],
      image: ["d11.jpg", "d12.jpg"]
    },

{
      name: "Girls Floral print dress",
      description: "Bright ,cheerful,spring-perfect.",
      price: 799,
      category: "Kids",
      season: "Autumn",
      rating: 4.1,
      reviews: 64,
      feedback: "Adorably fresh.",
      size: ["S", "M", "L"],
      image: ["d13.jpg", "d14.jpg"]
    },

{
      name: "Women vintage Midi dress",
      description: "Retro,elegant,charm.",
      price: 899,
      category: "Women",
      season: "Autumn",
      rating: 4.3,
      reviews: 65,
      feedback: "Beautifully nostalgic.",
      size: ["S", "M", "L"],
      image: ["d15.jpg", "d16.jpg"]
    },

{
      name: "Vintage plaid midi skirt",
      description: "Elegant,timeless,garden-ready.",
      price: 899,
      category: "Women",
      season: "Autumn",
      rating: 4,
      reviews: 35,
      feedback: "Gracefully classic.",
      size: ["S", "M", "L"],
      image: ["d17.jpg", "d18.jpg"]
    },

{
      name: "Men's Beige V-Neck ",
      description: "polished,minimal.",
      price: 899,
      category: "Men",
      season: "Autumn",
      rating: 3.2,
      reviews: 30,
      feedback: "Effortlessly classy.",
      size: ["S", "M", "L"],
      image: ["d19.jpg", "d20.jpg"]
    },

    {
      name: "Sunglasses",
      description: "UV-protected stylish sunglasses for sunny days.",
      price: 999,
      category: "Men",
      season: "Spring",
      rating: 4.8,
      reviews: 200,
      feedback: "Perfect for the beach!",
      size: ["One Size"],
      image: ["sunglasses.jpg"]
    }
];