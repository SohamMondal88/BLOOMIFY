// Cart Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartTableBody = document.querySelector('.cart-table-body');
    const orderSummary = document.querySelector('.order-summary .summary-details');
    const crossSellGrid = document.querySelector('.cross-sell .product-grid');
    
    // Display cart items
    function displayCartItems() {
        cartTableBody.innerHTML = '';
        
        if (cart.length === 0) {
            document.querySelector('.cart-items').innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added anything to your cart yet</p>
                    <a href="products.html" class="btn primary">Continue Shopping</a>
                </div>
            `;
            document.querySelector('.order-summary').style.display = 'none';
            document.querySelector('.cross-sell').style.display = 'none';
            return;
        }
        
        // Update cart count in header
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-header h2').textContent = `Your Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`;
        document.querySelector('.cart-count').textContent = totalItems;
        
        // Display each cart item
        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-product">
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        ${item.color ? `<div class="variant">Color: ${item.color}</div>` : ''}
                        ${item.size ? `<div class="variant">Size: ${item.size}</div>` : ''}
                    </div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-index="${index}">-</button>
                        <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-index="${index}">
                        <button class="quantity-btn plus" data-index="${index}">+</button>
                    </div>
                </div>
                <div class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</div>
                <div class="cart-item-remove">
                    <button class="remove-item" data-index="${index}"><i class="fas fa-times"></i></button>
                </div>
            `;
            
            cartTableBody.appendChild(cartItem);
        });
        
        // Update order summary
        updateOrderSummary();
        
        // Add event listeners
        addCartEventListeners();
    }
    
    // Update order summary
    function updateOrderSummary() {
        const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 50 ? 0 : 5.99;
        const tax = subtotal * 0.08; // 8% tax
        const discount = 0; // Would be calculated if there's a coupon
        const total = subtotal + shipping + tax - discount;
        
        orderSummary.innerHTML = `
            <div class="summary-row">
                <span>Subtotal</span>
                <span class="value">$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping</span>
                <span class="value">${shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div class="summary-row">
                <span>Tax</span>
                <span class="value">$${tax.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
            <div class="summary-row discount">
                <span>Discount</span>
                <span class="value">-$${discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="summary-row total">
                <span>Total</span>
                <span class="value">$${total.toFixed(2)}</span>
            </div>
        `;
    }
    
    // Add event listeners to cart items
    function addCartEventListeners() {
        // Quantity minus buttons
        document.querySelectorAll('.quantity-btn.minus').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    saveCart();
                }
            });
        });
        
        // Quantity plus buttons
        document.querySelectorAll('.quantity-btn.plus').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart[index].quantity++;
                saveCart();
            });
        });
        
        // Quantity inputs
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const newQuantity = parseInt(this.value);
                
                if (newQuantity >= 1) {
                    cart[index].quantity = newQuantity;
                    saveCart();
                } else {
                    this.value = cart[index].quantity;
                }
            });
        });
        
        // Remove item buttons
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                cart.splice(index, 1);
                saveCart();
            });
        });
        
        // Update cart button
        const updateCartBtn = document.querySelector('.update-cart');
        if (updateCartBtn) {
            updateCartBtn.addEventListener('click', function() {
                // This would handle any bulk updates if needed
                saveCart();
                showNotification('Cart updated!');
            });
        }
        
        // Apply coupon button
        const applyCouponBtn = document.querySelector('.coupon-code button');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', function() {
                const couponInput = document.querySelector('.coupon-code input');
                const couponCode = couponInput.value.trim();
                
                if (couponCode === 'BLOOM10') {
                    // Apply 10% discount
                    showNotification('10% discount applied!');
                    couponInput.value = '';
                } else if (couponCode) {
                    showNotification('Invalid coupon code');
                }
            });
        }
    }
    
    // Save cart to localStorage and refresh display
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
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
    
    // Load cross-sell products
    function loadCrossSellProducts() {
        const crossSellProducts = [
            {
                id: 6,
                name: "Glass Vase",
                price: 19.99,
                image: "https://via.placeholder.com/300x300?text=Glass+Vase",
                category: "Accessories",
                rating: 4.7,
                reviews: 42
            },
            {
                id: 7,
                name: "Decorative Ribbon",
                price: 8.99,
                image: "https://via.placeholder.com/300x300?text=Decorative+Ribbon",
                category: "Accessories",
                rating: 4.3,
                reviews: 18
            },
            {
                id: 8,
                name: "Floral Foam",
                price: 12.99,
                image: "https://via.placeholder.com/300x300?text=Floral+Foam",
                category: "Accessories",
                rating: 4.5,
                reviews: 27
            },
            {
                id: 9,
                name: "Preserved Moss",
                price: 14.99,
                image: "https://via.placeholder.com/300x300?text=Preserved+Moss",
                category: "Accessories",
                rating: 4.6,
                reviews: 31
            }
        ];
        
        crossSellProducts.forEach(product => {
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
            
            crossSellGrid.appendChild(productCard);
        });
        
        // Add event listeners to cross-sell products
        crossSellGrid.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = crossSellProducts.find(p => p.id === productId);
                
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
                showNotification(`${product.name} added to cart!`);
                displayCartItems();
            });
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
    
    // Initialize the page
    displayCartItems();
    if (cart.length > 0) {
        loadCrossSellProducts();
    }
});