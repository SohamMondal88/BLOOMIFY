// Product Detail Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Thumbnail image click handler
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.getElementById('mainImage');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Remove active class from all thumbnails
            thumbnails.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked thumbnail
            this.classList.add('active');
            
            // Update main image
            const newImageSrc = this.getAttribute('data-image');
            mainImage.src = newImageSrc;
        });
    });
    
    // Quantity selector
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    
    minusBtn.addEventListener('click', function() {
        if (quantityInput.value > 1) {
            quantityInput.value--;
        }
    });
    
    plusBtn.addEventListener('click', function() {
        quantityInput.value++;
    });
    
    // Add to cart button
    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', function() {
        const product = {
            id: 1,
            name: 'Elegant Rose Bouquet',
            price: 39.99,
            image: 'https://via.placeholder.com/300x300?text=Rose+Bouquet',
            quantity: parseInt(quantityInput.value),
            color: document.getElementById('color').value,
            size: document.getElementById('size').value
        };
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id && item.color === product.color && item.size === product.size);
        
        if (existingItem) {
            existingItem.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
        
        // Show notification
        showNotification(`${product.quantity} ${product.name} added to cart!`);
    });
    
    // Add to wishlist button
    const addToWishlistBtn = document.querySelector('.add-to-wishlist');
    addToWishlistBtn.addEventListener('click', function() {
        const product = {
            id: 1,
            name: 'Elegant Rose Bouquet',
            price: 39.99,
            image: 'https://via.placeholder.com/300x300?text=Rose+Bouquet'
        };
        
        let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingItem = wishlist.find(item => item.id === product.id);
        
        if (!existingItem) {
            wishlist.push(product);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Change icon to solid heart
            this.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
            
            // Show notification
            showNotification(`${product.name} added to wishlist!`);
        } else {
            // Remove from wishlist
            wishlist = wishlist.filter(item => item.id !== product.id);
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
            
            // Change icon to outline heart
            this.innerHTML = '<i class="far fa-heart"></i> Wishlist';
            
            // Show notification
            showNotification(`${product.name} removed from wishlist!`);
        }
    });
    
    // Check if product is in wishlist
    const checkWishlist = () => {
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        const existingItem = wishlist.find(item => item.id === 1);
        
        if (existingItem) {
            addToWishlistBtn.innerHTML = '<i class="fas fa-heart"></i> Wishlist';
        }
    };
    
    checkWishlist();
    
    // Tab functionality
    const tabLinks = document.querySelectorAll('.tabs-nav a');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all tabs
            tabLinks.forEach(tab => tab.parentNode.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked tab
            this.parentNode.classList.add('active');
            
            // Show corresponding panel
            const panelId = this.getAttribute('href').substring(1);
            document.getElementById(panelId).classList.add('active');
        });
    });
    
    // Load related products
    const relatedProductsGrid = document.querySelector('.related-products .product-grid');
    const relatedProducts = [
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
        },
        {
            id: 5,
            name: "Sunflower Bouquet",
            price: 32.99,
            image: "https://via.placeholder.com/300x300?text=Sunflower+Bouquet",
            category: "Wedding Flowers",
            rating: 4.6,
            reviews: 19
        }
    ];
    
    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
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
        
        relatedProductsGrid.appendChild(productCard);
    });
    
    // Add event listeners to related products
    relatedProductsGrid.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = relatedProducts.find(p => p.id === productId);
            
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
            document.querySelector('.cart-count').textContent = totalItems;
            
            // Show notification
            showNotification(`${product.name} added to cart!`);
        });
    });
    
    // Quick view functionality
    relatedProductsGrid.querySelectorAll('.quick-view').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = relatedProducts.find(p => p.id === productId);
            
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
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                const existingItem = cart.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({
                        ...product,
                        quantity: quantity
                    });
                }
                
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
                showNotification(`${quantity} ${product.name} added to cart!`);
                modal.remove();
                document.body.style.overflow = 'auto';
            });
        });
    });
    
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
    
    // Update cart count
    function updateCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }
});