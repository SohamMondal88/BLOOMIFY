// Account Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabLinks = document.querySelectorAll('.account-menu a');
    const tabPanels = document.querySelectorAll('.account-tab');
    
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
    
    // Load wishlist items
    const wishlistGrid = document.querySelector('.wishlist-grid');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    function displayWishlistItems() {
        wishlistGrid.innerHTML = '';
        
        if (wishlist.length === 0) {
            wishlistGrid.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save your favorite items here for later</p>
                    <a href="products.html" class="btn primary">Browse Products</a>
                </div>
            `;
            return;
        }
        
        wishlist.forEach((item, index) => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="wishlist-item-details">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-price">$${item.price.toFixed(2)}</div>
                    <div class="wishlist-item-actions">
                        <button class="btn small primary add-to-cart" data-id="${item.id}">Add to Cart</button>
                        <button class="btn small secondary remove-wishlist" data-index="${index}"><i class="fas fa-times"></i> Remove</button>
                    </div>
                </div>
            `;
            
            wishlistGrid.appendChild(wishlistItem);
        });
        
        // Add event listeners
        addWishlistEventListeners();
    }
    
    // Add event listeners to wishlist items
    function addWishlistEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = wishlist.find(item => item.id === productId);
                
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
                
                // Update cart count in header
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
                document.querySelector('.cart-count').textContent = totalItems;
                
                // Show notification
                showNotification(`${product.name} added to cart!`);
            });
        });
        
        // Remove from wishlist buttons
        document.querySelectorAll('.remove-wishlist').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                const productName = wishlist[index].name;
                
                wishlist.splice(index, 1);
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                
                // Update wishlist count in summary
                document.querySelector('.summary-value:nth-child(2)').textContent = wishlist.length;
                
                // Show notification
                showNotification(`${productName} removed from wishlist!`);
                
                // Refresh wishlist display
                displayWishlistItems();
            });
        });
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
    
    // Initialize the page
    displayWishlistItems();
    
    // Update wishlist count in summary
    document.querySelector('.summary-value:nth-child(2)').textContent = wishlist.length;
    
    // Add new address button
    const addNewAddressBtn = document.querySelector('.add-new-address');
    if (addNewAddressBtn) {
        addNewAddressBtn.addEventListener('click', function() {
            // In a real app, this would show a form to add a new address
            alert('Add new address functionality would go here');
        });
    }
    
    // Account form submission
    const accountForm = document.querySelector('.account-form');
    if (accountForm) {
        accountForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would save the account details
            showNotification('Account details updated successfully!');
        });
    }
    
    // Password form submission
    const passwordForm = document.querySelector('.password-form');
    if (passwordForm) {
        passwordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real app, this would change the password
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword !== confirmPassword) {
                alert('New passwords do not match');
                return;
            }
            
            if (newPassword.length < 8) {
                alert('Password must be at least 8 characters');
                return;
            }
            
            // Clear form
            passwordForm.reset();
            showNotification('Password changed successfully!');
        });
    }
});