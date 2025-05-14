// Checkout Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.querySelector('.order-items');
    const orderSummary = document.querySelector('.order-summary-sidebar .summary-details');
    
    // Display order items
    function displayOrderItems() {
        orderItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            window.location.href = 'cart.html';
            return;
        }
        
        cart.forEach(item => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="order-item-details">
                    <h4>${item.name}</h4>
                    ${item.color ? `<div class="variant">Color: ${item.color}</div>` : ''}
                    ${item.size ? `<div class="variant">Size: ${item.size}</div>` : ''}
                    <div class="order-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            
            orderItemsContainer.appendChild(orderItem);
        });
        
        // Update order summary
        updateOrderSummary();
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
    
    // Checkout steps functionality
    const steps = document.querySelectorAll('.checkout-steps .step');
    const checkoutSteps = document.querySelectorAll('.checkout-step');
    
    function goToStep(stepNumber) {
        // Update steps UI
        steps.forEach((step, index) => {
            if (index < stepNumber - 1) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === stepNumber - 1) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        
        // Show corresponding step content
        checkoutSteps.forEach(step => {
            step.classList.remove('active');
        });
        document.getElementById(`step-${stepNumber}`).classList.add('active');
        
        // Scroll to top of step
        window.scrollTo({
            top: document.querySelector('.checkout-content').offsetTop - 20,
            behavior: 'smooth'
        });
    }
    
    // Next step buttons
    document.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', function() {
            const nextStep = parseInt(this.getAttribute('data-next'));
            
            // Validate current step before proceeding
            const currentStep = nextStep - 1;
            let isValid = true;
            
            if (currentStep === 1) {
                // Validate shipping form
                const shippingForm = document.getElementById('shipping-form');
                const requiredFields = shippingForm.querySelectorAll('[required]');
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#ff0000';
                        isValid = false;
                    } else {
                        field.style.borderColor = '';
                    }
                });
            } else if (currentStep === 2) {
                // Validate payment form
                const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
                
                if (paymentMethod === 'credit') {
                    const cardNumber = document.getElementById('card-number').value.trim();
                    const cardName = document.getElementById('card-name').value.trim();
                    const cardExpiry = document.getElementById('card-expiry').value.trim();
                    const cardCvv = document.getElementById('card-cvv').value.trim();
                    
                    if (!cardNumber || !cardName || !cardExpiry || !cardCvv) {
                        alert('Please fill in all credit card details');
                        isValid = false;
                    }
                }
            }
            
            if (isValid) {
                goToStep(nextStep);
                
                // If completing order (step 3)
                if (nextStep === 3) {
                    completeOrder();
                }
            }
        });
    });
    
    // Previous step buttons
    document.querySelectorAll('.prev-step').forEach(button => {
        button.addEventListener('click', function() {
            const prevStep = parseInt(this.getAttribute('data-prev'));
            goToStep(prevStep);
        });
    });
    
    // Complete order function
    function completeOrder() {
        // In a real app, this would process the payment and create an order
        // For demo purposes, we'll just clear the cart and show confirmation
        
        // Generate random order number
        const orderNumber = 'BL' + Math.floor(100000 + Math.random() * 900000);
        document.querySelector('.order-number').textContent = `Order #${orderNumber}`;
        
        // Update confirmation details with form values
        const email = document.getElementById('email').value;
        document.querySelector('.confirmation-message strong').textContent = email;
        
        const firstName = document.getElementById('first-name').value;
        const lastName = document.getElementById('last-name').value;
        const address = document.getElementById('address').value;
        const address2 = document.getElementById('address2').value;
        const city = document.getElementById('city').value;
        const state = document.getElementById('state').value;
        const zip = document.getElementById('zip').value;
        const country = document.getElementById('country').value;
        
        document.querySelector('.shipping-address').innerHTML = `
            <h4>Shipping Address</h4>
            <p>${firstName} ${lastName}<br>
            ${address}${address2 ? '<br>' + address2 : ''}<br>
            ${city}, ${state} ${zip}<br>
            ${getCountryName(country)}</p>
        `;
        
        const billingSame = document.getElementById('billing-same').checked;
        document.querySelector('.billing-address').innerHTML = `
            <h4>Billing Address</h4>
            <p>${billingSame ? 'Same as shipping address' : 'Different from shipping address'}</p>
        `;
        
        const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
        let paymentText = '';
        
        switch (paymentMethod) {
            case 'credit':
                paymentText = 'Credit Card ending in ' + document.getElementById('card-number').value.slice(-4);
                break;
            case 'paypal':
                paymentText = 'PayPal';
                break;
            case 'apple':
                paymentText = 'Apple Pay';
                break;
        }
        
        document.querySelector('.order-summary .summary-row:nth-child(2) .value').textContent = paymentText;
        
        const shippingMethod = document.querySelector('input[name="shipping"]:checked').value;
        let shippingText = '';
        
        switch (shippingMethod) {
            case 'standard':
                shippingText = 'Standard Shipping (3-5 business days)';
                break;
            case 'express':
                shippingText = 'Express Shipping (2-3 business days)';
                break;
            case 'free':
                shippingText = 'Free Shipping (5-7 business days)';
                break;
        }
        
        document.querySelector('.order-summary .summary-row:nth-child(3) .value').textContent = shippingText;
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Update cart count in header
        document.querySelector('.cart-count').textContent = '0';
    }
    
    // Helper function to get country name from code
    function getCountryName(code) {
        const countries = {
            'US': 'United States',
            'CA': 'Canada',
            'UK': 'United Kingdom',
            'AU': 'Australia'
        };
        return countries[code] || code;
    }
    
    // Initialize the page
    displayOrderItems();
    goToStep(1);
    
    // Apply coupon button
    const applyCouponBtn = document.querySelector('.coupon-code button');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', function() {
            const couponInput = document.querySelector('.coupon-code input');
            const couponCode = couponInput.value.trim();
            
            if (couponCode === 'BLOOM10') {
                // Apply 10% discount
                alert('10% discount applied!');
                couponInput.value = '';
            } else if (couponCode) {
                alert('Invalid coupon code');
            }
        });
    }
});