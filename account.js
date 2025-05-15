// account.js - Frontend Logic
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!localStorage.getItem('bloomifyToken')) {
        window.location.href = '/login.html';
        return;
    }

    // DOM Elements
    const accountContainer = document.querySelector('.account-container');
    const userNameElement = document.querySelector('.user-name');
    const summaryValues = document.querySelectorAll('.summary-value');
    const ordersTableBody = document.querySelector('.orders-table-body');
    const wishlistGrid = document.querySelector('.wishlist-grid');
    const addressesGrid = document.querySelector('.addresses-grid');
    const accountForm = document.querySelector('.account-form');
    const passwordForm = document.querySelector('.password-form');
    const logoutContent = document.querySelector('.logout-content');

    // Global State
    let currentUser = {};
    let userOrders = [];
    let userWishlist = [];
    let userAddresses = [];

    // Initialize the page
    async function init() {
        try {
            // Load user data
            currentUser = await fetchUserData();
            userNameElement.textContent = currentUser.name;

            // Load all data in parallel
            await Promise.all([
                loadOrders(),
                loadWishlist(),
                loadAddresses()
            ]);

            // Update summary counts
            updateSummaryCounts();

            // Set up event listeners
            setupEventListeners();
        } catch (error) {
            console.error('Initialization error:', error);
            showNotification('Failed to load account data', 'error');
        }
    }

    // Fetch user data from backend
    async function fetchUserData() {
        const response = await fetch('/api/users/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user data');
        }

        return await response.json();
    }

    // Load orders data
    async function loadOrders() {
        try {
            const response = await fetch('/api/users/orders', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load orders');
            }

            userOrders = await response.json();
            renderOrders();
        } catch (error) {
            console.error('Error loading orders:', error);
            showNotification('Failed to load order history', 'error');
        }
    }

    // Render orders table
    function renderOrders() {
        ordersTableBody.innerHTML = '';

        if (userOrders.length === 0) {
            ordersTableBody.innerHTML = `
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
                    <span class="order-date">${new Date(order.date).toLocaleDateString()}</span>
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
                    <a href="#" class="btn small view-order" data-order-id="${order.id}">View</a>
                    ${order.status === 'Processing' ? 
                        `<a href="#" class="btn small secondary cancel-order" data-order-id="${order.id}">Cancel</a>` : ''}
                </div>
            `;
            ordersTableBody.appendChild(orderRow);
        });

        // Add event listeners for order actions
        document.querySelectorAll('.view-order').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const orderId = this.getAttribute('data-order-id');
                viewOrderDetails(orderId);
            });
        });

        document.querySelectorAll('.cancel-order').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const orderId = this.getAttribute('data-order-id');
                cancelOrder(orderId);
            });
        });
    }

    // Load wishlist data
    async function loadWishlist() {
        try {
            const response = await fetch('/api/users/wishlist', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load wishlist');
            }

            userWishlist = await response.json();
            renderWishlist();
        } catch (error) {
            console.error('Error loading wishlist:', error);
            showNotification('Failed to load wishlist', 'error');
        }
    }

    // Render wishlist items
    function renderWishlist() {
        wishlistGrid.innerHTML = '';

        if (userWishlist.length === 0) {
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
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                    ${item.onSale ? `<span class="sale-badge">Sale</span>` : ''}
                    ${item.ecoCertificates.length > 0 ? 
                        `<span class="eco-badge" title="${item.ecoCertificates.join(', ')}">
                            <i class="fas fa-leaf"></i> Eco-Friendly
                        </span>` : ''}
                </div>
                <div class="wishlist-item-details">
                    <h3>${item.name}</h3>
                    <div class="wishlist-item-price">
                        $${item.price.toFixed(2)}
                        ${item.originalPrice ? 
                            `<span class="original-price">$${item.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    ${item.inStock ? 
                        `<div class="stock in-stock"><i class="fas fa-check-circle"></i> In Stock</div>` : 
                        `<div class="stock out-of-stock"><i class="fas fa-times-circle"></i> Out of Stock</div>`}
                    <div class="carbon-footprint">
                        <i class="fas fa-seedling"></i> Carbon Footprint: ${item.carbonFootprint} kg CO₂
                    </div>
                    <div class="wishlist-item-actions">
                        <button class="btn small primary add-to-cart" data-id="${item.id}" 
                            ${!item.inStock ? 'disabled' : ''}>
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

        // Add event listeners for wishlist actions
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
    }

    // Load addresses
    async function loadAddresses() {
        try {
            const response = await fetch('/api/users/addresses', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load addresses');
            }

            userAddresses = await response.json();
            renderAddresses();
        } catch (error) {
            console.error('Error loading addresses:', error);
            showNotification('Failed to load addresses', 'error');
        }
    }

    // Render addresses
    function renderAddresses() {
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

        document.getElementById('add-new-address-btn').addEventListener('click', () => openAddressForm());
    }

    // Update summary counts
    function updateSummaryCounts() {
        summaryValues[0].textContent = userOrders.length;
        summaryValues[1].textContent = userWishlist.length;
        summaryValues[2].textContent = userAddresses.length;
    }

    // View order details
    async function viewOrderDetails(orderId) {
        try {
            const response = await fetch(`/api/orders/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to load order details');
            }

            const order = await response.json();
            showOrderModal(order);
        } catch (error) {
            console.error('Error loading order details:', error);
            showNotification('Failed to load order details', 'error');
        }
    }

    // Cancel order
    async function cancelOrder(orderId) {
        if (!confirm('Are you sure you want to cancel this order?')) return;

        try {
            const response = await fetch(`/api/orders/${orderId}/cancel`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to cancel order');
            }

            showNotification('Order cancelled successfully', 'success');
            await loadOrders();
            updateSummaryCounts();
        } catch (error) {
            console.error('Error cancelling order:', error);
            showNotification('Failed to cancel order', 'error');
        }
    }

    // Add to cart from wishlist
    async function addToCartFromWishlist(productId) {
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ productId, quantity: 1 })
            });

            if (!response.ok) {
                throw new Error('Failed to add to cart');
            }

            const product = userWishlist.find(item => item.id === productId);
            showNotification(`${product.name} added to cart!`, 'success');
            
            // Update cart count in header
            updateCartCount();
        } catch (error) {
            console.error('Error adding to cart:', error);
            showNotification('Failed to add to cart', 'error');
        }
    }

    // Remove from wishlist
    async function removeFromWishlist(productId) {
        try {
            const response = await fetch(`/api/wishlist/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to remove from wishlist');
            }

            const product = userWishlist.find(item => item.id === productId);
            showNotification(`${product.name} removed from wishlist`, 'success');
            
            await loadWishlist();
            updateSummaryCounts();
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            showNotification('Failed to remove from wishlist', 'error');
        }
    }

    // Open address form modal
    function openAddressForm(addressId = null) {
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
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('.cancel-address').addEventListener('click', () => modal.remove());
        
        // Form submission
        modal.querySelector('#address-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            await saveAddress(this);
            modal.remove();
        });
    }

    // Save address
    async function saveAddress(form) {
        const addressId = form.querySelector('#address-id').value;
        const isDefault = form.querySelector('#set-default').checked;
        
        const addressData = {
            type: form.querySelector('#address-type').value,
            fullName: form.querySelector('#full-name').value,
            phone: form.querySelector('#phone').value,
            addressLine1: form.querySelector('#address-line1').value,
            addressLine2: form.querySelector('#address-line2').value,
            city: form.querySelector('#city').value,
            state: form.querySelector('#state').value,
            zipCode: form.querySelector('#zip-code').value,
            country: form.querySelector('#country').value,
            isDefault
        };
        
        try {
            const url = addressId ? `/api/addresses/${addressId}` : '/api/addresses';
            const method = addressId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addressData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to save address');
            }
            
            showNotification(`Address ${addressId ? 'updated' : 'added'} successfully!`, 'success');
            await loadAddresses();
            updateSummaryCounts();
        } catch (error) {
            console.error('Error saving address:', error);
            showNotification('Failed to save address', 'error');
        }
    }

    // Set default address
    async function setDefaultAddress(addressId) {
        try {
            const response = await fetch(`/api/addresses/${addressId}/default`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to set default address');
            }
            
            showNotification('Default address updated!', 'success');
            await loadAddresses();
        } catch (error) {
            console.error('Error setting default address:', error);
            showNotification('Failed to set default address', 'error');
        }
    }

    // Delete address
    async function deleteAddress(addressId) {
        if (!confirm('Are you sure you want to delete this address?')) return;
        
        try {
            const response = await fetch(`/api/addresses/${addressId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });
            
            if (!response.ok) {
                throw new Error('Failed to delete address');
            }
            
            showNotification('Address deleted successfully!', 'success');
            await loadAddresses();
            updateSummaryCounts();
        } catch (error) {
            console.error('Error deleting address:', error);
            showNotification('Failed to delete address', 'error');
        }
    }

    // Show order details modal
    function showOrderModal(order) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content wide">
                <span class="close-modal">&times;</span>
                <h2>Order #${order.orderNumber}</h2>
                <div class="order-details">
                    <div class="order-meta">
                        <div class="meta-item">
                            <span class="meta-label">Order Date:</span>
                            <span class="meta-value">${new Date(order.date).toLocaleString()}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Status:</span>
                            <span class="meta-value status ${order.status.toLowerCase()}">${order.status}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Total:</span>
                            <span class="meta-value">$${order.total.toFixed(2)}</span>
                        </div>
                        ${order.trackingNumber ? `
                        <div class="meta-item">
                            <span class="meta-label">Tracking:</span>
                            <span class="meta-value">
                                <a href="${order.trackingUrl}" target="_blank">${order.trackingNumber}</a>
                            </span>
                        </div>` : ''}
                    </div>
                    
                    <div class="order-items">
                        <h3>Items</h3>
                        <div class="items-list">
                            ${order.items.map(item => `
                                <div class="order-item">
                                    <div class="item-image">
                                        <img src="${item.image}" alt="${item.name}" loading="lazy">
                                    </div>
                                    <div class="item-details">
                                        <h4>${item.name}</h4>
                                        <div class="item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
                                        ${item.ecoCertificates.length > 0 ? `
                                        <div class="item-eco">
                                            <i class="fas fa-leaf"></i> ${item.ecoCertificates.join(', ')}
                                        </div>` : ''}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="order-summary">
                        <div class="summary-row">
                            <span class="summary-label">Subtotal:</span>
                            <span class="summary-value">$${order.subtotal.toFixed(2)}</span>
                        </div>
                        <div class="summary-row">
                            <span class="summary-label">Shipping:</span>
                            <span class="summary-value">$${order.shippingCost.toFixed(2)}</span>
                        </div>
                        ${order.discount > 0 ? `
                        <div class="summary-row">
                            <span class="summary-label">Discount:</span>
                            <span class="summary-value">-$${order.discount.toFixed(2)}</span>
                        </div>` : ''}
                        <div class="summary-row total">
                            <span class="summary-label">Total:</span>
                            <span class="summary-value">$${order.total.toFixed(2)}</span>
                        </div>
                        <div class="summary-row carbon">
                            <span class="summary-label">Carbon Offset:</span>
                            <span class="summary-value">${order.carbonOffset} kg CO₂</span>
                        </div>
                    </div>
                    
                    <div class="order-actions">
                        <button class="btn secondary" id="print-invoice">Print Invoice</button>
                        ${order.status === 'Processing' ? 
                            `<button class="btn secondary" id="cancel-order" data-order-id="${order.id}">Cancel Order</button>` : ''}
                        <button class="btn primary" id="close-modal">Close</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners for modal
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.querySelector('#close-modal').addEventListener('click', () => modal.remove());
        
        if (modal.querySelector('#print-invoice')) {
            modal.querySelector('#print-invoice').addEventListener('click', () => {
                window.print();
            });
        }
        
        if (modal.querySelector('#cancel-order')) {
            modal.querySelector('#cancel-order').addEventListener('click', async function() {
                const orderId = this.getAttribute('data-order-id');
                modal.remove();
                await cancelOrder(orderId);
            });
        }
    }

    // Update cart count in header
    async function updateCartCount() {
        try {
            const response = await fetch('/api/cart/count', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`
                }
            });
            
            if (response.ok) {
                const { count } = await response.json();
                document.querySelectorAll('.cart-count').forEach(el => {
                    el.textContent = count;
                });
            }
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    }

    // Show notification
    function showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
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

    // Setup event listeners
    function setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.account-menu a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                document.querySelector('.account-menu li.active').classList.remove('active');
                this.parentNode.classList.add('active');
                const tabId = this.getAttribute('href').substring(1);
                switchTab(tabId);
            });
        });

        // Account form submission
        if (accountForm) {
            accountForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                await saveAccountDetails(this);
            });
        }

        // Password form submission
        if (passwordForm) {
            passwordForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                await changePassword(this);
            });
        }

        // Logout button
        if (logoutContent) {
            const logoutBtn = logoutContent.querySelector('.btn.primary');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    localStorage.removeItem('bloomifyToken');
                    window.location.href = '/login.html';
                });
            }
        }
    }

    // Switch tabs
    function switchTab(tabId) {
        document.querySelectorAll('.account-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.getElementById(tabId);
        if (activeTab) {
            activeTab.classList.add('active');
        }
    }

    // Save account details
    async function saveAccountDetails(form) {
        const formData = {
            firstName: form.querySelector('#account-first-name').value,
            lastName: form.querySelector('#account-last-name').value,
            email: form.querySelector('#account-email').value,
            phone: form.querySelector('#account-phone').value
        };
        
        try {
            const response = await fetch('/api/users/me', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to update account');
            }
            
            const updatedUser = await response.json();
            userNameElement.textContent = `${updatedUser.firstName} ${updatedUser.lastName}`;
            showNotification('Account details updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating account:', error);
            showNotification('Failed to update account details', 'error');
        }
    }

    // Change password
    async function changePassword(form) {
        const formData = {
            currentPassword: form.querySelector('#current-password').value,
            newPassword: form.querySelector('#new-password').value,
            confirmPassword: form.querySelector('#confirm-password').value
        };
        
        if (formData.newPassword !== formData.confirmPassword) {
            showNotification('New passwords do not match', 'error');
            return;
        }
        
        if (formData.newPassword.length < 8) {
            showNotification('Password must be at least 8 characters', 'error');
            return;
        }
        
        try {
            const response = await fetch('/api/users/change-password', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('bloomifyToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to change password');
            }
            
            form.reset();
            showNotification('Password changed successfully!', 'success');
        } catch (error) {
            console.error('Error changing password:', error);
            showNotification('Failed to change password', 'error');
        }
    }

    // Initialize the page
    init();
});