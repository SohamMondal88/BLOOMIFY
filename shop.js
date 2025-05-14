// Extended product data for listing page
const allProducts = [
    // Previous products plus additional ones
    {
        id: 5,
        name: "Sunflower Bouquet",
        price: 32.99,
        image: "https://via.placeholder.com/300x300?text=Sunflower+Bouquet",
        category: "Wedding Flowers",
        color: "yellow",
        rating: 4.6,
        reviews: 19
    },
    {
        id: 6,
        name: "Red Rose Centerpiece",
        price: 45.99,
        image: "https://via.placeholder.com/300x300?text=Red+Rose+Centerpiece",
        category: "Home Decor",
        color: "red",
        rating: 4.9,
        reviews: 27
    },
    // Add more products as needed...
];

// DOM Elements
const productGrid = document.querySelector('.product-grid');
const colorOptions = document.querySelectorAll('.color-option');
const priceRange = document.getElementById('priceRange');
const applyFiltersBtn = document.querySelector('.apply-filters');
const resetFiltersBtn = document.querySelector('.reset-filters');
const sortSelect = document.getElementById('sort');

// Filter state
let filters = {
    category: 'all',
    color: [],
    price: 100,
    rating: []
};

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayProducts(allProducts);
    setupEventListeners();
});

// Display products
function displayProducts(products) {
    productGrid.innerHTML = '';
    
    if (products.length === 0) {
        productGrid.innerHTML = '<div class="no-results">No products match your filters. Try adjusting your criteria.</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <button class="quick-view" data-id="${product.id}">Quick View</button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="product-meta">${product.category}</div>
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
    
    // Update results count
    document.querySelector('.results-count').textContent = `Showing ${products.length} of ${allProducts.length} products`;
    
    // Add event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    document.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', showQuickView);
    });
}

// Generate star rating HTML (same as in script.js)
function generateStars(rating) {
    // Same implementation as before
}

// Setup event listeners
function setupEventListeners() {
    // Category filter
    document.querySelectorAll('.filter-list li a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.filter-list li a.active').classList.remove('active');
            this.classList.add('active');
            filters.category = this.textContent === 'All Products' ? 'all' : this.textContent;
            applyFilters();
        });
    });
    
    // Color filter
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('selected');
            const color = this.getAttribute('data-color');
            
            if (this.classList.contains('selected')) {
                if (!filters.color.includes(color)) {
                    filters.color.push(color);
                }
            } else {
                filters.color = filters.color.filter(c => c !== color);
            }
        });
    });
    
    // Price filter
    priceRange.addEventListener('input', function() {
        filters.price = parseInt(this.value);
        document.querySelector('.price-values span:first-child').textContent = `$0`;
        document.querySelector('.price-values span:last-child').textContent = `$${this.value}+`;
    });
    
    // Rating filter
    document.querySelectorAll('.rating-filter input').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const rating = parseInt(this.id.replace('rating', ''));
            
            if (this.checked) {
                if (!filters.rating.includes(rating)) {
                    filters.rating.push(rating);
                }
            } else {
                filters.rating = filters.rating.filter(r => r !== rating);
            }
        });
    });
    
    // Apply filters button
    applyFiltersBtn.addEventListener('click', applyFilters);
    
    // Reset filters button
    resetFiltersBtn.addEventListener('click', resetFilters);
    
    // Sort options
    sortSelect.addEventListener('change', sortProducts);
}

// Apply filters
function applyFilters() {
    let filteredProducts = [...allProducts];
    
    // Category filter
    if (filters.category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === filters.category);
    }
    
    // Color filter
    if (filters.color.length > 0) {
        filteredProducts = filteredProducts.filter(product => filters.color.includes(product.color));
    }
    
    // Price filter
    filteredProducts = filteredProducts.filter(product => product.price <= filters.price);
    
    // Rating filter
    if (filters.rating.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            const productRating = Math.floor(product.rating);
            return filters.rating.includes(productRating);
        });
    }
    
    displayProducts(filteredProducts);
}

// Reset filters
function resetFilters() {
    // Reset filter state
    filters = {
        category: 'all',
        color: [],
        price: 100,
        rating: []
    };
    
    // Reset UI
    document.querySelector('.filter-list li a.active').classList.remove('active');
    document.querySelector('.filter-list li a:first-child').classList.add('active');
    
    colorOptions.forEach(option => option.classList.remove('selected'));
    
    priceRange.value = 100;
    document.querySelector('.price-values span:first-child').textContent = '$0';
    document.querySelector('.price-values span:last-child').textContent = '$100+';
    
    document.querySelectorAll('.rating-filter input').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    sortSelect.value = 'popular';
    
    // Show all products
    displayProducts(allProducts);
}

// Sort products
function sortProducts() {
    const sortBy = sortSelect.value;
    let productsToSort = [...document.querySelectorAll('.product-card')];
    
    productsToSort.sort((a, b) => {
        const aId = parseInt(a.querySelector('.add-to-cart').getAttribute('data-id'));
        const bId = parseInt(b.querySelector('.add-to-cart').getAttribute('data-id'));
        
        const productA = allProducts.find(p => p.id === aId);
        const productB = allProducts.find(p => p.id === bId);
        
        switch (sortBy) {
            case 'newest':
                return bId - aId; // Assuming higher IDs are newer
            case 'price-low':
                return productA.price - productB.price;
            case 'price-high':
                return productB.price - productA.price;
            case 'rating':
                return productB.rating - productA.rating;
            default: // 'popular'
                return productB.reviews - productA.reviews;
        }
    });
    
    productGrid.innerHTML = '';
    productsToSort.forEach(product => productGrid.appendChild(product));
}

// Add to cart function (same as in script.js)
function addToCart(e) {
    // Same implementation as before
}

// Quick view modal (same as in script.js)
function showQuickView(e) {
    // Same implementation as before
}