document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D flower in hero section
    initHeroFlower();
    
    // Initialize form flower decorations
    initFormFlowers();
    
    // Initialize contact info icons
    initContactIcons();
    
    // Initialize 3D map
    init3DMap();
    
    // Initialize FAQ functionality
    initFAQ();
    
    // Initialize newsletter flower
    initNewsletterFlower();
    
    // Form submission handling
    setupContactForm();
});

function initHeroFlower() {
    const container = document.getElementById('contactFlower3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create flower group
    const flower = new THREE.Group();
    
    // Create flower center
    const centerGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf8c537,
        shininess: 100
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    
    // Create petals
    const petalGeometry = new THREE.SphereGeometry(0.6, 32, 32);
    petalGeometry.scale(1, 0.3, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a8f29,
        shininess: 50
    });
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.x = Math.cos(angle) * 1.5;
        petal.position.z = Math.sin(angle) * 1.5;
        petal.rotation.y = angle;
        
        flower.add(petal);
    }
    
    flower.add(center);
    scene.add(flower);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        flower.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function initFormFlowers() {
    const formFlowers = [
        document.getElementById('nameFlower'),
        document.getElementById('emailFlower'),
        document.getElementById('subjectFlower'),
        document.getElementById('messageFlower'),
        document.getElementById('submitFlower')
    ];
    
    formFlowers.forEach((container, index) => {
        if (!container) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create different small flowers based on position
        const flower = createSmallFlower(index);
        scene.add(flower);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            flower.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createSmallFlower(index) {
    const flower = new THREE.Group();
    const colors = [0xff6b6b, 0x4a8f29, 0xf8c537, 0x9370db, 0x6a5acd];
    
    // Center
    const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf8c537
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    flower.add(center);
    
    // Petals
    const petalGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    petalGeometry.scale(1, 0.3, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: colors[index % colors.length]
    });
    
    const petalCount = 6 + index % 3;
    
    for (let i = 0; i < petalCount; i++) {
        const angle = (i / petalCount) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.x = Math.cos(angle) * 0.7;
        petal.position.z = Math.sin(angle) * 0.7;
        petal.rotation.y = angle;
        
        flower.add(petal);
    }
    
    // Scale down for the container
    flower.scale.set(0.5, 0.5, 0.5);
    
    return flower;
}

function initContactIcons() {
    const iconContainers = [
        document.getElementById('addressIcon'),
        document.getElementById('emailIcon'),
        document.getElementById('phoneIcon'),
        document.getElementById('facebookIcon'),
        document.getElementById('instagramIcon'),
        document.getElementById('pinterestIcon'),
        document.getElementById('twitterIcon')
    ];
    
    iconContainers.forEach((container, index) => {
        if (!container) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create different icons based on index
        const icon = createContactIcon(index);
        scene.add(icon);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (index >= 3) { // Social icons
                icon.rotation.y += 0.02;
            }
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createContactIcon(index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Address
            // Map pin
            const pinBase = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.5, 0.2, 32),
                new THREE.MeshPhongMaterial({ color: 0xff6b6b })
            );
            pinBase.rotation.x = Math.PI / 2;
            
            const pinStem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 0.8, 16),
                new THREE.MeshPhongMaterial({ color: 0xff6b6b })
            );
            pinStem.position.y = 0.5;
            
            const pinHead = new THREE.Mesh(
                new THREE.SphereGeometry(0.2, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0xf8c537 })
            );
            pinHead.position.y = 0.9;
            
            icon.add(pinBase);
            icon.add(pinStem);
            icon.add(pinHead);
            break;
            
        case 1: // Email
            // Envelope
            const envelope = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.6, 0.8),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            
            const flap = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 0.8),
                new THREE.MeshPhongMaterial({ 
                    color: 0x3d8b3d,
                    side: THREE.DoubleSide
                })
            );
            flap.position.set(0, 0.3, 0);
            flap.rotation.x = Math.PI / 4;
            
            icon.add(envelope);
            icon.add(flap);
            break;
            
        case 2: // Phone
            // Phone handset
            const handset = new THREE.Mesh(
                new THREE.TorusGeometry(0.5, 0.2, 16, 32, Math.PI),
                new THREE.MeshPhongMaterial({ color: 0x9370db })
            );
            handset.rotation.z = Math.PI / 2;
            
            const receiver = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.4, 0.4),
                new THREE.MeshPhongMaterial({ color: 0x6a5acd })
            );
            receiver.position.set(0, 0.7, 0);
            
            icon.add(handset);
            icon.add(receiver);
            break;
            
        case 3: // Facebook
            // Facebook "f"
            const fBase = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 1.2, 0.2),
                new THREE.MeshPhongMaterial({ color: 0x3b5998 })
            );
            
            const fBar = new THREE.Mesh(
                new THREE.BoxGeometry(0.6, 0.2, 0.2),
                new THREE.MeshPhongMaterial({ color: 0xffffff })
            );
            fBar.position.set(0, 0.2, 0.1);
            
            icon.add(fBase);
            icon.add(fBar);
            break;
            
        case 4: // Instagram
            // Instagram camera
            const cameraBody = new THREE.Mesh(
                new THREE.BoxGeometry(0.8, 0.8, 0.2),
                new THREE.MeshPhongMaterial({ color: 0xe4405f })
            );
            
            const lens = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0xffffff })
            );
            lens.position.set(0, 0, 0.15);
            
            icon.add(cameraBody);
            icon.add(lens);
            break;
            
        case 5: // Pinterest
            // Pinterest "p"
            const pCircle = new THREE.Mesh(
                new THREE.CircleGeometry(0.5, 32),
                new THREE.MeshPhongMaterial({ 
                    color: 0xbd081c,
                    side: THREE.DoubleSide
                })
            );
            pCircle.rotation.x = Math.PI / 2;
            
            const pStem = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.6, 0.2),
                new THREE.MeshPhongMaterial({ color: 0xbd081c })
            );
            pStem.position.set(-0.3, -0.3, 0);
            
            icon.add(pCircle);
            icon.add(pStem);
            break;
            
        case 6: // Twitter
            // Twitter bird
            const body = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0x1da1f2 })
            );
            
            const wing = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0x1da1f2 })
            );
            wing.scale.set(1, 0.3, 0.5);
            wing.position.set(0.3, 0.1, 0);
            wing.rotation.z = Math.PI / 4;
            
            icon.add(body);
            icon.add(wing);
            break;
    }
    
    // Scale down for the container
    icon.scale.set(0.5, 0.5, 0.5);
    
    return icon;
}

function init3DMap() {
    const container = document.getElementById('contactMap3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 10, 15);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create map
    const map = createMap();
    scene.add(map);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate map slightly
        map.rotation.y += 0.002;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function createMap() {
    const map = new THREE.Group();
    
    // Base (ground)
    const baseGeometry = new THREE.PlaneGeometry(20, 20, 1, 1);
    const baseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a8f29,
        side: THREE.DoubleSide
    });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.rotation.x = -Math.PI / 2;
    map.add(base);
    
    // Roads
    const roadGeometry = new THREE.PlaneGeometry(20, 2, 1, 1);
    const roadMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x777777,
        side: THREE.DoubleSide
    });
    
    const road1 = new THREE.Mesh(roadGeometry, roadMaterial);
    road1.rotation.x = -Math.PI / 2;
    road1.position.z = 0;
    
    const road2 = new THREE.Mesh(roadGeometry, roadMaterial);
    road2.rotation.x = -Math.PI / 2;
    road2.rotation.z = Math.PI / 2;
    road2.position.x = 0;
    
    map.add(road1);
    map.add(road2);
    
    // Buildings
    const buildingColors = [0x2c3e50, 0x34495e, 0x7f8c8d, 0x95a5a6];
    
    for (let i = 0; i < 10; i++) {
        const width = 1 + Math.random() * 2;
        const depth = 1 + Math.random() * 2;
        const height = 2 + Math.random() * 5;
        const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshPhongMaterial({ color: color });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        building.position.x = -8 + Math.random() * 16;
        building.position.z = -8 + Math.random() * 16;
        building.position.y = height / 2;
        
        // Don't place buildings in the center
        if (Math.abs(building.position.x) < 3 && Math.abs(building.position.z) < 3) {
            building.position.x += 5 * (Math.random() > 0.5 ? 1 : -1);
            building.position.z += 5 * (Math.random() > 0.5 ? 1 : -1);
        }
        
        map.add(building);
    }
    
    // Our location marker
    const markerGeometry = new THREE.ConeGeometry(0.5, 1, 4);
    const markerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.3
    });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.set(0, 1, 0);
    marker.rotation.x = Math.PI;
    map.add(marker);
    
    // Pulsing effect
    function animateMarker() {
        gsap.to(marker.scale, {
            x: 1.2,
            y: 1.2,
            z: 1.2,
            duration: 1,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });
    }
    
    animateMarker();
    
    return map;
}

function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Toggle active class
            item.classList.toggle('active');
            
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

function initNewsletterFlower() {
    const container = document.getElementById('newsletterFlower3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create flower group
    const flower = new THREE.Group();
    
    // Create flower center
    const centerGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf8c537,
        emissive: 0xf8c537,
        emissiveIntensity: 0.3
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    
    // Create petals
    const petalGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    petalGeometry.scale(1, 0.3, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        emissive: 0xff6b6b,
        emissiveIntensity: 0.2
    });
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.x = Math.cos(angle) * 1.8;
        petal.position.z = Math.sin(angle) * 1.8;
        petal.rotation.y = angle;
        
        flower.add(petal);
    }
    
    flower.add(center);
    scene.add(flower);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        flower.rotation.y += 0.01;
        
        // Gentle floating animation
        flower.position.y = Math.sin(Date.now() * 0.001) * 0.3;
        
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', function() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send the form data to a server
        // For this example, we'll just show a success message
        
        // Show success animation
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = true;
        
        gsap.to(submitBtn, {
            backgroundColor: '#3a7720',
            duration: 0.3
        });
        
        // Create flying flowers animation
        for (let i = 0; i < 5; i++) {
            createFlyingFlower(submitBtn);
        }
        
        // Show success message
        setTimeout(() => {
            const notification = document.createElement('div');
            notification.className = 'form-notification';
            notification.innerHTML = `
                <div class="notification-icon">✓</div>
                <div>
                    <h4>Message Sent!</h4>
                    <p>Thank you, ${name}. We'll get back to you soon.</p>
                </div>
            `;
            
            contactForm.appendChild(notification);
            
            gsap.fromTo(notification, 
                { y: 20, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 0.3 }
            );
            
            // Reset form after delay
            setTimeout(() => {
                gsap.to(notification, {
                    y: -20,
                    opacity: 0,
                    duration: 0.3,
                    onComplete: function() {
                        notification.remove();
                        contactForm.reset();
                        submitBtn.disabled = false;
                        gsap.to(submitBtn, {
                            backgroundColor: '#4a8f29',
                            duration: 0.3
                        });
                    }
                });
            }, 3000);
        }, 1000);
    });
}

function createFlyingFlower(originElement) {
    const flower = document.createElement('div');
    flower.className = 'flying-flower';
    flower.innerHTML = '🌸';
    
    // Position at the submit button
    const rect = originElement.getBoundingClientRect();
    flower.style.left = `${rect.left + rect.width/2}px`;
    flower.style.top = `${rect.top + rect.height/2}px`;
    
    document.body.appendChild(flower);
    
    // Random flight path
    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 100;
    const targetX = Math.cos(angle) * distance;
    const targetY = Math.sin(angle) * distance - 100;
    
    gsap.to(flower, {
        x: targetX,
        y: targetY,
        opacity: 0,
        scale: 1.5,
        duration: 1.5,
        ease: "power1.out",
        onComplete: function() {
            flower.remove();
        }
    });
}

// Add styles for flying flower and notification
const style = document.createElement('style');
style.textContent = `
    .flying-flower {
        position: fixed;
        font-size: 24px;
        z-index: 1000;
        pointer-events: none;
        transform: translate(-50%, -50%);
    }
    
    .form-notification {
        position: absolute;
        bottom: -100px;
        left: 0;
        width: 100%;
        background-color: #4a8f29;
        color: white;
        padding: 15px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10;
    }
    
    .notification-icon {
        width: 40px;
        height: 40px;
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
    }
    
    .form-notification h4 {
        margin-bottom: 5px;
        font-size: 16px;
    }
    
    .form-notification p {
        font-size: 14px;
        opacity: 0.9;
    }
`;
document.head.appendChild(style);