

// Display products
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-badge">Bestseller</div>
                <button class="quick-view" data-id="${product.id}">Quick View</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span>(${product.reviews})</span>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', showQuickView);
    });
}

// Generate star rating HTML
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Update cart count
function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Quick view modal
function showQuickView(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-product-info">
                    <h2>${product.name}</h2>
                    <div class="modal-product-rating">
                        ${generateStars(product.rating)}
                        <span>${product.rating} (${product.reviews} reviews)</span>
                    </div>
                    <div class="modal-product-price">$${product.price.toFixed(2)}</div>
                    <p class="modal-product-description">This beautiful artificial ${product.name.toLowerCase()} is perfect for ${product.category.toLowerCase()}. Made with high-quality materials for a realistic look that lasts.</p>
                    <div class="modal-product-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="1" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="add-to-cart-modal" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    // Quantity selector
    const quantityInput = modal.querySelector('.quantity-input');
    modal.querySelector('.minus').addEventListener('click', () => {
        if (quantityInput.value > 1) {
            quantityInput.value--;
        }
    });
    
    modal.querySelector('.plus').addEventListener('click', () => {
        quantityInput.value++;
    });
    
    // Add to cart from modal
    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        updateCart();
        showNotification(`${quantity} ${product.name} added to cart!`);
        modal.remove();
        document.body.style.overflow = 'auto';
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    updateCart();
    
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            opacity: 1;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        }
        
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .modal-product {
            display: flex;
            gap: 30px;
        }
        
        .modal-product-image {
            flex: 1;
        }
        
        .modal-product-image img {
            width: 100%;
            height: auto;
            border-radius: 4px;
        }
        
        .modal-product-info {
            flex: 1;
        }
        
        .modal-product-rating {
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-product-price {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 15px 0;
            color: var(--primary-color);
        }
        
        .modal-product-description {
            margin-bottom: 20px;
        }
        
        .modal-product-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .quantity-selector {
            display: flex;
            align-items: center;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            background-color: var(--gray);
            border: none;
            font-size: 1rem;
            cursor: pointer;
        }
        
        .quantity-input {
            width: 50px;
            height: 30px;
            text-align: center;
            border: 1px solid var(--gray);
            margin: 0 5px;
        }
        
        .add-to-cart-modal {
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .modal-product {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
});

















document.addEventListener('DOMContentLoaded', function() {
  const heroScroll = document.querySelector('.hero-scroll');
  
  if (heroScroll) {
    heroScroll.addEventListener('click', function() {
      // Get the next section (categories)
      const nextSection = document.querySelector('.categories');
      
      if (nextSection) {
        // Smooth scroll to the next section
        nextSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  }
});














document.addEventListener('DOMContentLoaded', function() {
  const searchContainer = document.querySelector('.search-container');
  const searchIcon = document.querySelector('.search-icon');
  const searchInput = document.querySelector('.search-input');
  const searchResults = document.querySelector('.search-results');

  // Sample data - replace with your actual product data from backend
  const searchData = [
    { name: "Rose Bouquet", type: "product", url: "products/rose-bouquet" },
    { name: "Lily Arrangement", type: "product", url: "products/lily-arrangement" },
    { name: "Sunflower Decor", type: "product", url: "products/sunflower-decor" },
    { name: "Tulip Collection", type: "product", url: "products/tulip-collection" },
    { name: "Orchid Display", type: "product", url: "products/orchid-display" },
    { name: "About Us", type: "page", url: "about" },
    { name: "Contact", type: "page", url: "contact" },
    { name: "Spring Collection", type: "collection", url: "collections/spring" },
    { name: "Wedding Flowers", type: "collection", url: "collections/wedding" },
    { name: "Eco-Friendly Packaging", type: "page", url: "eco-packaging" }
  ];

  // Toggle search expansion
  searchIcon.addEventListener('click', function() {
    searchContainer.classList.toggle('expanded');
    if (searchContainer.classList.contains('expanded')) {
      searchInput.focus();
    } else {
      searchInput.value = '';
      hideResults();
    }
  });

  // Handle search input
  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.trim().toLowerCase();
    
    if (searchTerm.length > 0) {
      const results = searchData
        .filter(item => item.name.toLowerCase().includes(searchTerm))
        .slice(0, 5); // Limit to 5 results
      
      displayResults(results);
    } else {
      hideResults();
    }
  });

  // Display search results
  function displayResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'no-results';
      noResults.textContent = 'No results found';
      searchResults.appendChild(noResults);
    } else {
      results.forEach(item => {
        const resultItem = document.createElement('a');
        resultItem.className = 'search-result-item';
        resultItem.href = item.url;
        
        const icon = document.createElement('i');
        icon.className = `fas ${
          item.type === 'product' ? 'fa-leaf' : 
          item.type === 'collection' ? 'fa-puzzle-piece' : 
          'fa-file-alt'
        }`;
        
        const text = document.createElement('span');
        text.textContent = item.name;
        
        resultItem.appendChild(icon);
        resultItem.appendChild(text);
        searchResults.appendChild(resultItem);
      });
    }
    
    searchResults.classList.add('visible');
  }

  // Hide search results
  function hideResults() {
    searchResults.classList.remove('visible');
    searchResults.innerHTML = '';
  }

  // Close search when clicking outside
  document.addEventListener('click', function(e) {
    if (!searchContainer.contains(e.target)) {
      if (window.innerWidth <= 768) {
        searchContainer.classList.remove('expanded');
      }
      hideResults();
    }
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (window.innerWidth <= 768) {
        searchContainer.classList.remove('expanded');
      }
      hideResults();
    }
  });
});












document.addEventListener('DOMContentLoaded', function() {
  // Testimonial Carousel
  const carousel = document.querySelector('.testimonial-carousel');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dotsContainer = document.querySelector('.carousel-dots');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  let currentIndex = 0;
  const slideCount = slides.length;
  
  // Create dots
  slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('carousel-dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
  
  // Update carousel position
  function updateCarousel() {
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
    
    // Add 3D effect to current slide
    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.style.transform = 'translateZ(20px)';
        slide.style.opacity = '1';
      } else {
        slide.style.transform = 'translateZ(0)';
        slide.style.opacity = '0.6';
      }
    });
  }
  
  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    if (currentIndex >= slideCount) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slideCount - 1;
    updateCarousel();
  }
  
  // Next slide
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }
  
  // Previous slide
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }
  
  // Event listeners
  nextBtn.addEventListener('click', nextSlide);
  prevBtn.addEventListener('click', prevSlide);
  
  // Auto-rotate (optional)
  let autoSlide = setInterval(nextSlide, 5000);
  
  // Pause on hover
  carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
  carousel.addEventListener('mouseleave', () => {
    autoSlide = setInterval(nextSlide, 5000);
  });
  
  // Initialize
  updateCarousel();
});

























































































/* ============================================= */
/* Main Product Display and Cart Functionality   */
/* ============================================= */

/**
 * Sample product data - Replace with your actual product data from backend
 * This array contains all products with their details
 */
const products = [
    {
        id: 1,
        name: "Elegant Rose Bouquet",
        price: 39.99,
        image: "https://via.placeholder.com/300x300?text=Rose+Bouquet",
        category: "Wedding Flowers",
        rating: 4.5,
        reviews: 24
    },
    {
        id: 2,
        name: "White Peony Arrangement",
        price: 34.99,
        image: "https://via.placeholder.com/300x300?text=Peony+Arrangement",
        category: "Home Decor",
        rating: 4.8,
        reviews: 18
    },
    {
        id: 3,
        name: "Spring Tulip Centerpiece",
        price: 29.99,
        image: "https://via.placeholder.com/300x300?text=Tulip+Centerpiece",
        category: "Party Decorations",
        rating: 4.2,
        reviews: 12
    },
    {
        id: 4,
        name: "Lavender Field Wreath",
        price: 27.99,
        image: "https://via.placeholder.com/300x300?text=Lavender+Wreath",
        category: "Seasonal Arrangements",
        rating: 4.7,
        reviews: 31
    }
];

// DOM Elements for product section
const productGrid = document.querySelector('.product-grid');
const cartCount = document.querySelector('.cart-count');
let cart = JSON.parse(localStorage.getItem('cart')) || [];

/* ============================================= */
/* Product Display and Cart Functionality         */
/* ============================================= */ 

/**
 * Displays all products in the product grid
 */
function displayProducts() {
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <!-- Product card HTML structure -->
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add event listeners to all "Quick View" buttons
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', showQuickView);
    });
}

/**
 * Generates star rating HTML based on product rating
 * @param {number} rating - The product's rating (0-5)
 * @returns {string} HTML string of star icons
 */
function generateStars(rating) {
    let stars = '';
    // ... star generation logic
    return stars;
}

/**
 * Adds a product to the shopping cart
 * @param {Event} e - Click event from the "Add to Cart" button
 */
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

/**
 * Updates the cart count in the header
 */
function updateCart() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Shows a temporary notification message
 * @param {string} message - The message to display
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animation timing
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/**
 * Shows the quick view modal for a product
 * @param {Event} e - Click event from the "Quick View" button
 */
function showQuickView(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Create modal HTML
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <!-- Modal HTML structure -->
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal event
    modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = 'auto';
    });
    
    // Quantity selector functionality
    const quantityInput = modal.querySelector('.quantity-input');
    modal.querySelector('.minus').addEventListener('click', () => {
        if (quantityInput.value > 1) quantityInput.value--;
    });
    
    modal.querySelector('.plus').addEventListener('click', () => {
        quantityInput.value++;
    });
    
    // Add to cart from modal
    modal.querySelector('.add-to-cart-modal').addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value);
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                ...product,
                quantity: quantity
            });
        }
        
        updateCart();
        showNotification(`${quantity} ${product.name} added to cart!`);
        modal.remove();
        document.body.style.overflow = 'auto';
    });
}

/* ============================================= */
/* Hero Scroll Functionality                     */
/* ============================================= */

/**
 * Handles the hero section scroll down button
 */
function setupHeroScroll() {
    const heroScroll = document.querySelector('.hero-scroll');
    
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const nextSection = document.querySelector('.categories');
            
            if (nextSection) {
                nextSection.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    }
}

/* ============================================= */
/* Search Functionality                          */
/* ============================================= */

/**
 * Sets up the search functionality
 */
function setupSearch() {
    const searchContainer = document.querySelector('.search-container');
    const searchIcon = document.querySelector('.search-icon');
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');

    // Sample search data - replace with your actual data
    const searchData = [
        // ... search data objects
    ];

    // Toggle search expansion
    searchIcon.addEventListener('click', function() {
        searchContainer.classList.toggle('expanded');
        if (searchContainer.classList.contains('expanded')) {
            searchInput.focus();
        } else {
            searchInput.value = '';
            hideResults();
        }
    });

    // Handle search input
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length > 0) {
            const results = searchData
                .filter(item => item.name.toLowerCase().includes(searchTerm))
                .slice(0, 5);
            
            displayResults(results);
        } else {
            hideResults();
        }
    });

    /**
     * Displays search results
     * @param {Array} results - Array of search result items
     */
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No results found';
            searchResults.appendChild(noResults);
        } else {
            results.forEach(item => {
                const resultItem = document.createElement('a');
                resultItem.className = 'search-result-item';
                resultItem.href = item.url;
                
                const icon = document.createElement('i');
                icon.className = `fas ${
                    item.type === 'product' ? 'fa-leaf' : 
                    item.type === 'collection' ? 'fa-puzzle-piece' : 
                    'fa-file-alt'
                }`;
                
                const text = document.createElement('span');
                text.textContent = item.name;
                
                resultItem.appendChild(icon);
                resultItem.appendChild(text);
                searchResults.appendChild(resultItem);
            });
        }
        
        searchResults.classList.add('visible');
    }

    /**
     * Hides the search results
     */
    function hideResults() {
        searchResults.classList.remove('visible');
        searchResults.innerHTML = '';
    }

    // Close search when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchContainer.contains(e.target)) {
            if (window.innerWidth <= 768) {
                searchContainer.classList.remove('expanded');
            }
            hideResults();
        }
    });

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (window.innerWidth <= 768) {
                searchContainer.classList.remove('expanded');
            }
            hideResults();
        }
    });
}

/* ============================================= */
/* Testimonial Carousel                          */
/* ============================================= */

/**
 * Sets up the testimonial carousel
 */
function setupTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    const slideCount = slides.length;
    
    // Create navigation dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    /**
     * Updates the carousel position and active states
     */
    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
        
        // Add 3D effect to current slide
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.style.transform = 'translateZ(20px)';
                slide.style.opacity = '1';
            } else {
                slide.style.transform = 'translateZ(0)';
                slide.style.opacity = '0.6';
            }
        });
    }
    
    /**
     * Navigates to a specific slide
     * @param {number} index - Slide index to navigate to
     */
    function goToSlide(index) {
        currentIndex = index;
        if (currentIndex >= slideCount) currentIndex = 0;
        if (currentIndex < 0) currentIndex = slideCount - 1;
        updateCarousel();
    }
    
    /**
     * Goes to next slide
     */
    function nextSlide() {
        goToSlide(currentIndex + 1);
    }
    
    /**
     * Goes to previous slide
     */
    function prevSlide() {
        goToSlide(currentIndex - 1);
    }
    
    // Event listeners for navigation buttons
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    
    // Auto-rotate (optional)
    let autoSlide = setInterval(nextSlide, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });
    
    // Initialize
    updateCarousel();
}

/* ============================================= */
/* Page Initialization                           */
/* ============================================= */

/**
 * Initializes the page when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize product display and cart
    displayProducts();
    updateCart();
    
    // Add notification styles dynamically
    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--primary-color);
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: 1000;
        }
        
        .notification.show {
            opacity: 1;
        }
        
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1001;
        }
        
        .modal-content {
            background-color: white;
            padding: 30px;
            border-radius: 8px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
        }
        
        .close-modal {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 1.5rem;
            cursor: pointer;
        }
        
        .modal-product {
            display: flex;
            gap: 30px;
        }
        
        .modal-product-image {
            flex: 1;
        }
        
        .modal-product-image img {
            width: 100%;
            height: auto;
            border-radius: 4px;
        }
        
        .modal-product-info {
            flex: 1;
        }
        
        .modal-product-rating {
            margin: 10px 0;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .modal-product-price {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 15px 0;
            color: var(--primary-color);
        }
        
        .modal-product-description {
            margin-bottom: 20px;
        }
        
        .modal-product-actions {
            display: flex;
            gap: 15px;
            align-items: center;
        }
        
        .quantity-selector {
            display: flex;
            align-items: center;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            background-color: var(--gray);
            border: none;
            font-size: 1rem;
            cursor: pointer;
        }
        
        .quantity-input {
            width: 50px;
            height: 30px;
            text-align: center;
            border: 1px solid var(--gray);
            margin: 0 5px;
        }
        
        .add-to-cart-modal {
            padding: 10px 20px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .modal-product {
                flex-direction: column;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Set up all page components
    setupHeroScroll();
    setupSearch();
    setupTestimonialCarousel();
});






