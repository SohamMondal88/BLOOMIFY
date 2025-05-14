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







































































// Enhanced Account Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize user data
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || {};
    const userOrders = JSON.parse(localStorage.getItem(`userOrders_${currentUser.id}`)) || [];
    const userWishlist = JSON.parse(localStorage.getItem(`userWishlist_${currentUser.id}`)) || [];
    const userAddresses = JSON.parse(localStorage.getItem(`userAddresses_${currentUser.id}`)) || [];
    
    // Set welcome message
    document.querySelector('.user-name').textContent = currentUser.name || 'Guest';
    
    // Tab switching
    const switchTab = (tabId) => {
        document.querySelectorAll('.account-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.getElementById(tabId).classList.add('active');
        
        // Load tab-specific data
        if(tabId === 'orders') loadOrders();
        if(tabId === 'wishlist') loadWishlist();
        if(tabId === 'addresses') loadAddresses();
    };
    
    // Load orders data
    const loadOrders = () => {
        const ordersTable = document.querySelector('#orders .orders-table-body');
        ordersTable.innerHTML = '';
        
        if(userOrders.length === 0) {
            ordersTable.innerHTML = `
                <div class="empty-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No orders yet</h3>
                    <p>Your order history will appear here</p>
                    <a href="products.html" class="btn primary">Start Shopping</a>
                </div>
            `;
            return;
        }
        
        userOrders.forEach(order => {
            const orderRow = document.createElement('div');
            orderRow.className = 'order-row';
            orderRow.innerHTML = `
                <div class="order-item order">
                    <span class="mobile-label">Order:</span>
                    <span class="order-number">${order.orderNumber}</span>
                </div>
                <div class="order-item date">
                    <span class="mobile-label">Date:</span>
                    <span class="order-date">${formatDate(order.date)}</span>
                </div>
                <div class="order-item status">
                    <span class="mobile-label">Status:</span>
                    <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>
                <div class="order-item total">
                    <span class="mobile-label">Total:</span>
                    <span class="order-total">$${order.total.toFixed(2)}</span>
                </div>
                <div class="order-item actions">
                    <a href="#" class="btn small" data-order-id="${order.id}">View</a>
                    ${order.status === 'Processing' ? 
                        `<a href="#" class="btn small secondary cancel-order" data-order-id="${order.id}">Cancel</a>` : ''}
                </div>
            `;
            ordersTable.appendChild(orderRow);
        });
        
        // Add event listeners for order actions
        document.querySelectorAll('.cancel-order').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const orderId = this.getAttribute('data-order-id');
                cancelOrder(orderId);
            });
        });
    };
    
    // Load wishlist data
    const loadWishlist = () => {
        const wishlistGrid = document.querySelector('.wishlist-grid');
        wishlistGrid.innerHTML = '';
        
        if(userWishlist.length === 0) {
            wishlistGrid.innerHTML = `
                <div class="empty-wishlist">
                    <i class="fas fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save your favorite eco-friendly decor items here</p>
                    <a href="products.html" class="btn primary">Browse Our Collection</a>
                </div>
            `;
            return;
        }
        
        userWishlist.forEach(item => {
            const wishlistItem = document.createElement('div');
            wishlistItem.className = 'wishlist-item';
            wishlistItem.innerHTML = `
                <div class="wishlist-item-image">
                    <img src="${item.image}" alt="${item.name}">
                    ${item.onSale ? `<span class="sale-badge">Sale</span>` : ''}
                </div>
                <div class="wishlist-item-details">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-price">
                        $${item.price.toFixed(2)}
                        ${item.originalPrice ? `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    ${item.inStock ? 
                        `<div class="stock in-stock"><i class="fas fa-check-circle"></i> In Stock</div>` : 
                        `<div class="stock out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</div>`}
                    <div class="wishlist-item-actions">
                        <button class="btn small primary add-to-cart" data-id="${item.id}">
                            <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                        <button class="btn small secondary remove-wishlist" data-id="${item.id}">
                            <i class="fas fa-times"></i> Remove
                        </button>
                    </div>
                </div>
            `;
            wishlistGrid.appendChild(wishlistItem);
        });
        
        // Add wishlist event listeners
        document.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                addToCartFromWishlist(productId);
            });
        });
        
        document.querySelectorAll('.remove-wishlist').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                removeFromWishlist(productId);
            });
        });
    };
    
    // Load addresses
    const loadAddresses = () => {
        const addressesGrid = document.querySelector('.addresses-grid');
        addressesGrid.innerHTML = '';
        
        userAddresses.forEach(address => {
            const addressCard = document.createElement('div');
            addressCard.className = `address-card ${address.isDefault ? 'default' : ''}`;
            addressCard.innerHTML = `
                <div class="address-header">
                    <h3>${address.type} ${address.isDefault ? '(Default)' : ''}</h3>
                    <div class="address-actions">
                        <button class="btn small edit-address" data-address-id="${address.id}">Edit</button>
                        ${!address.isDefault ? 
                            `<button class="btn small set-default-address" data-address-id="${address.id}">Set Default</button>
                             <button class="btn small secondary delete-address" data-address-id="${address.id}">Delete</button>` : ''}
                    </div>
                </div>
                <div class="address-details">
                    <p>${address.fullName}<br>
                    ${address.addressLine1}<br>
                    ${address.addressLine2 ? address.addressLine2 + '<br>' : ''}
                    ${address.city}, ${address.state} ${address.zipCode}<br>
                    ${address.country}</p>
                    <p class="address-phone">Phone: ${address.phone}</p>
                </div>
            `;
            addressesGrid.appendChild(addressCard);
        });
        
        // Add new address card
        const addNewCard = document.createElement('div');
        addNewCard.className = 'add-new-address';
        addNewCard.innerHTML = `
            <button class="btn primary" id="add-new-address-btn">
                <i class="fas fa-plus"></i> Add New Address
            </button>
        `;
        addressesGrid.appendChild(addNewCard);
        
        // Add address event listeners
        document.querySelectorAll('.edit-address').forEach(btn => {
            btn.addEventListener('click', function() {
                const addressId = this.getAttribute('data-address-id');
                openAddressForm(addressId);
            });
        });
        
        document.querySelectorAll('.set-default-address').forEach(btn => {
            btn.addEventListener('click', function() {
                const addressId = this.getAttribute('data-address-id');
                setDefaultAddress(addressId);
            });
        });
        
        document.querySelectorAll('.delete-address').forEach(btn => {
            btn.addEventListener('click', function() {
                const addressId = this.getAttribute('data-address-id');
                deleteAddress(addressId);
            });
        });
        
        document.getElementById('add-new-address-btn').addEventListener('click', openAddressForm);
    };
    
    // Address form modal
    const openAddressForm = (addressId = null) => {
        const address = addressId ? userAddresses.find(a => a.id === addressId) : null;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>${address ? 'Edit Address' : 'Add New Address'}</h2>
                <form id="address-form">
                    <input type="hidden" id="address-id" value="${address ? address.id : ''}">
                    
                    <div class="form-group">
                        <label for="address-type">Address Type</label>
                        <select id="address-type" required>
                            <option value="Home" ${address && address.type === 'Home' ? 'selected' : ''}>Home</option>
                            <option value="Work" ${address && address.type === 'Work' ? 'selected' : ''}>Work</option>
                            <option value="Other" ${address && address.type === 'Other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="full-name">Full Name</label>
                            <input type="text" id="full-name" value="${address ? address.fullName : ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="phone">Phone Number</label>
                            <input type="tel" id="phone" value="${address ? address.phone : ''}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="address-line1">Address Line 1</label>
                        <input type="text" id="address-line1" value="${address ? address.addressLine1 : ''}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address-line2">Address Line 2 (Optional)</label>
                        <input type="text" id="address-line2" value="${address ? address.addressLine2 : ''}">
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="city">City</label>
                            <input type="text" id="city" value="${address ? address.city : ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="state">State/Region</label>
                            <input type="text" id="state" value="${address ? address.state : ''}" required>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="zip-code">ZIP/Postal Code</label>
                            <input type="text" id="zip-code" value="${address ? address.zipCode : ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="country">Country</label>
                            <select id="country" required>
                                <option value="United States" ${address && address.country === 'United States' ? 'selected' : ''}>United States</option>
                                <option value="Canada" ${address && address.country === 'Canada' ? 'selected' : ''}>Canada</option>
                                <option value="United Kingdom" ${address && address.country === 'United Kingdom' ? 'selected' : ''}>United Kingdom</option>
                                <!-- More countries would be added in production -->
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="set-default" ${address && address.isDefault ? 'checked disabled' : ''}>
                        <label for="set-default">Set as default shipping address</label>
                    </div>
                    
                    <div class="form-actions">
                        <button type="submit" class="btn primary">${address ? 'Update Address' : 'Save Address'}</button>
                        <button type="button" class="btn secondary cancel-address">Cancel</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners for modal
        document.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        document.querySelector('.cancel-address').addEventListener('click', () => modal.remove());
        
        // Form submission
        document.getElementById('address-form').addEventListener('submit', function(e) {
            e.preventDefault();
            saveAddress(this);
            modal.remove();
        });
    };
    
    // Save address function
    const saveAddress = (form) => {
        const addressId = form.querySelector('#address-id').value;
        const isDefault = form.querySelector('#set-default').checked;
        
        const newAddress = {
            id: addressId || generateId(),
            type: form.querySelector('#address-type').value,
            fullName: form.querySelector('#full-name').value,
            phone: form.querySelector('#phone').value,
            addressLine1: form.querySelector('#address-line1').value,
            addressLine2: form.querySelector('#address-line2').value,
            city: form.querySelector('#city').value,
            state: form.querySelector('#state').value,
            zipCode: form.querySelector('#zip-code').value,
            country: form.querySelector('#country').value,
            isDefault: isDefault
        };
        
        if(addressId) {
            // Update existing address
            const index = userAddresses.findIndex(a => a.id === addressId);
            userAddresses[index] = newAddress;
        } else {
            // Add new address
            if(isDefault) {
                // Remove default status from other addresses
                userAddresses.forEach(a => a.isDefault = false);
            }
            userAddresses.push(newAddress);
        }
        
        // Save to localStorage
        localStorage.setItem(`userAddresses_${currentUser.id}`, JSON.stringify(userAddresses));
        
        // Reload addresses
        loadAddresses();
        updateSummaryCounts();
        
        // Show notification
        showNotification(`Address ${addressId ? 'updated' : 'added'} successfully!`);
    };
    
    // Set default address
    const setDefaultAddress = (addressId) => {
        userAddresses.forEach(a => {
            a.isDefault = a.id === addressId;
        });
        
        localStorage.setItem(`userAddresses_${currentUser.id}`, JSON.stringify(userAddresses));
        loadAddresses();
        showNotification('Default address updated!');
    };
    
    // Delete address
    const deleteAddress = (addressId) => {
        if(confirm('Are you sure you want to delete this address?')) {
            userAddresses = userAddresses.filter(a => a.id !== addressId);
            localStorage.setItem(`userAddresses_${currentUser.id}`, JSON.stringify(userAddresses));
            loadAddresses();
            updateSummaryCounts();
            showNotification('Address deleted successfully!');
        }
    };
    
    // Add to cart from wishlist
    const addToCartFromWishlist = (productId) => {
        const product = userWishlist.find(item => item.id === productId);
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        const existingItem = cart.find(item => item.id === productId);
        if(existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Update cart count in header
        updateCartCount();
        
        showNotification(`${product.name} added to cart!`);
    };
    
    // Remove from wishlist
    const removeFromWishlist = (productId) => {
        const productIndex = userWishlist.findIndex(item => item.id === productId);
        if(productIndex !== -1) {
            const productName = userWishlist[productIndex].name;
            userWishlist.splice(productIndex, 1);
            localStorage.setItem(`userWishlist_${currentUser.id}`, JSON.stringify(userWishlist));
            
            // Update wishlist display
            loadWishlist();
            updateSummaryCounts();
            
            showNotification(`${productName} removed from wishlist!`);
        }
    };
    
    // Cancel order
    const cancelOrder = (orderId) => {
        if(confirm('Are you sure you want to cancel this order?')) {
            const orderIndex = userOrders.findIndex(o => o.id === orderId);
            if(orderIndex !== -1 && userOrders[orderIndex].status === 'Processing') {
                userOrders[orderIndex].status = 'Cancelled';
                localStorage.setItem(`userOrders_${currentUser.id}`, JSON.stringify(userOrders));
                loadOrders();
                showNotification('Order cancelled successfully!');
            }
        }
    };
    
    // Update summary counts
    const updateSummaryCounts = () => {
        document.querySelector('.summary-value:nth-child(1)').textContent = userOrders.length;
        document.querySelector('.summary-value:nth-child(2)').textContent = userWishlist.length;
        document.querySelector('.summary-value:nth-child(3)').textContent = userAddresses.length;
    };
    
    // Helper functions
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    const generateId = () => {
        return Math.random().toString(36).substr(2, 9);
    };
    
    const showNotification = (message) => {
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
    };
    
    const updateCartCount = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = totalItems;
        });
    };
    
    // Initialize page
    updateSummaryCounts();
    loadOrders();
    
    // Tab click event listeners
    document.querySelectorAll('.account-menu a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.account-menu li.active').classList.remove('active');
            this.parentNode.classList.add('active');
            switchTab(this.getAttribute('href').substring(1));
        });
    });
});