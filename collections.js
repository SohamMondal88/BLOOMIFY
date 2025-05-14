document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D flower in hero section
    initHeroFlower();
    
    // Initialize 3D product previews
    initProductPreviews();
    
    // Initialize 3D benefit icons
    initBenefitIcons();
    
    // Filter functionality
    setupFilters();
    
    // Add to cart animation
    setupAddToCartButtons();
});

function initHeroFlower() {
    const container = document.getElementById('flower3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create flower geometry
    createFlower(scene);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate flower
        if (scene.children.length > 2) { // Check if flower exists
            scene.children[2].rotation.y += 0.005;
        }
        
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

function createFlower(scene) {
    // Create flower center
    const centerGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf8c537,
        shininess: 100
    });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    
    // Create petals
    const petalGeometry = new THREE.ConeGeometry(0.5, 1, 4);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        shininess: 50,
        side: THREE.DoubleSide
    });
    
    const petals = new THREE.Group();
    
    for (let i = 0; i < 8; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (i / 8) * Math.PI * 2;
        petal.position.x = Math.cos(angle) * 1.2;
        petal.position.z = Math.sin(angle) * 1.2;
        petal.rotation.z = angle;
        petal.rotation.x = Math.PI / 2;
        petals.add(petal);
    }
    
    // Create stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -1.5;
    
    // Create leaf
    const leafGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    leafGeometry.scale(1, 0.2, 1);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
    leaf.position.set(0.8, -1, 0);
    leaf.rotation.z = -Math.PI / 4;
    
    // Group everything together
    const flower = new THREE.Group();
    flower.add(center);
    flower.add(petals);
    flower.add(stem);
    flower.add(leaf);
    
    scene.add(flower);
}

function initProductPreviews() {
    const productContainers = document.querySelectorAll('.product-3d');
    
    productContainers.forEach((container, index) => {
        // Set up Three.js scene for each product
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create different product models based on index
        createProductModel(scene, index);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate product slightly
            if (scene.children.length > 2) {
                scene.children[2].rotation.y += 0.003;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Make product interactive
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        container.addEventListener('mousedown', function() {
            isDragging = true;
        });
        
        container.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            
            const deltaMove = {
                x: e.offsetX - previousMousePosition.x,
                y: e.offsetY - previousMousePosition.y
            };
            
            if (scene.children.length > 2) {
                scene.children[2].rotation.y += deltaMove.x * 0.01;
                scene.children[2].rotation.x += deltaMove.y * 0.01;
            }
            
            previousMousePosition = {
                x: e.offsetX,
                y: e.offsetY
            };
        });
        
        container.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        container.addEventListener('mouseleave', function() {
            isDragging = false;
        });
    });
}

function createProductModel(scene, index) {
    const product = new THREE.Group();
    
    // Different models based on product index
    switch(index) {
        case 0: // Pink Roses
            createRoseBouquet(product, 0xff6b8b);
            break;
        case 1: // Succulent Trio
            createSucculents(product);
            break;
        case 2: // Eucalyptus Wreath
            createWreath(product);
            break;
        case 3: // Lavender
            createLavenderBouquet(product);
            break;
        case 4: // Autumn Leaves
            createAutumnLeaves(product);
            break;
        case 5: // Sunflowers
            createSunflowers(product);
            break;
    }
    
    scene.add(product);
}

function createRoseBouquet(group, color) {
    // Vase
    const vaseGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 32);
    const vaseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.y = -1;
    group.add(vase);
    
    // Create multiple roses
    for (let i = 0; i < 12; i++) {
        const rose = createRose(color);
        rose.position.x = (Math.random() - 0.5) * 1.5;
        rose.position.z = (Math.random() - 0.5) * 1.5;
        rose.position.y = Math.random() * 0.5;
        rose.rotation.y = Math.random() * Math.PI * 2;
        group.add(rose);
    }
}

function createRose(color) {
    const rose = new THREE.Group();
    
    // Rose center
    const centerGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xf8c537 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.5;
    rose.add(center);
    
    // Petals
    const petalGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    petalGeometry.scale(1, 0.5, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ color: color });
    
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 8; j++) {
            const petal = new THREE.Mesh(petalGeometry, petalMaterial);
            const angle = (j / 8) * Math.PI * 2;
            const radius = 0.2 + i * 0.15;
            const yPos = 0.5 - i * 0.05;
            
            petal.position.x = Math.cos(angle) * radius;
            petal.position.z = Math.sin(angle) * radius;
            petal.position.y = yPos;
            
            petal.rotation.y = angle;
            petal.rotation.z = Math.PI / 2;
            
            rose.add(petal);
        }
    }
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -0.5;
    rose.add(stem);
    
    return rose;
}

function createSucculents(group) {
    // Pot
    const potGeometry = new THREE.CylinderGeometry(0.7, 0.9, 0.8, 32);
    const potMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -1;
    group.add(pot);
    
    // Create three different succulents
    createSucculent(group, 0.5, 0.5, 0x4a8f29);
    createSucculent(group, -0.5, 0, 0x5cad5c);
    createSucculent(group, 0, -0.5, 0x3d8b3d);
}

function createSucculent(group, x, z, color) {
    const succulent = new THREE.Group();
    succulent.position.set(x, 0, z);
    
    // Base
    const baseGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    baseGeometry.scale(1, 0.5, 1);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: color });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    succulent.add(base);
    
    // Leaves
    const leafGeometry = new THREE.ConeGeometry(0.2, 0.5, 4);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: color });
    
    for (let i = 0; i < 8; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        const angle = (i / 8) * Math.PI * 2;
        leaf.position.x = Math.cos(angle) * 0.3;
        leaf.position.z = Math.sin(angle) * 0.3;
        leaf.position.y = 0.1;
        leaf.rotation.z = angle;
        leaf.rotation.x = Math.PI / 2;
        succulent.add(leaf);
    }
    
    // Top leaves
    for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.y = 0.3;
        leaf.rotation.y = (i / 4) * Math.PI * 2;
        leaf.rotation.x = Math.PI / 4;
        succulent.add(leaf);
    }
    
    group.add(succulent);
}

function createWreath(group) {
    // Create circular base
    const torusGeometry = new THREE.TorusGeometry(2, 0.3, 16, 100);
    const torusMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.rotation.x = Math.PI / 2;
    group.add(torus);
    
    // Add leaves around the wreath
    const leafGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    leafGeometry.scale(1, 0.3, 1);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        leaf.position.x = Math.cos(angle) * 2;
        leaf.position.y = Math.sin(angle) * 0.1;
        leaf.position.z = Math.sin(angle) * 2;
        
        leaf.rotation.z = angle;
        leaf.rotation.y = angle;
        
        group.add(leaf);
    }
    
    // Scale down the whole wreath to fit in the container
    group.scale.set(0.4, 0.4, 0.4);
}

function createLavenderBouquet(group) {
    // Vase
    const vaseGeometry = new THREE.CylinderGeometry(0.6, 0.5, 1, 32);
    const vaseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x6a5acd,
        shininess: 100
    });
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.y = -1;
    group.add(vase);
    
    // Create multiple lavender stems
    for (let i = 0; i < 9; i++) {
        const lavender = createLavender();
        lavender.position.x = (Math.random() - 0.5) * 1.2;
        lavender.position.z = (Math.random() - 0.5) * 1.2;
        lavender.position.y = Math.random() * 0.3;
        group.add(lavender);
    }
}

function createLavender() {
    const lavender = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 0;
    lavender.add(stem);
    
    // Flowers
    const flowerGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const flowerMaterial = new THREE.MeshPhongMaterial({ color: 0x9370db });
    
    for (let y = 0.5; y < 2; y += 0.1) {
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 0.1 + (2 - y) * 0.05;
            
            const flower = new THREE.Mesh(flowerGeometry, flowerMaterial);
            flower.position.x = Math.cos(angle) * radius;
            flower.position.z = Math.sin(angle) * radius;
            flower.position.y = y;
            
            lavender.add(flower);
        }
    }
    
    return lavender;
}

function createAutumnLeaves(group) {
    // Create a branch with autumn leaves
    const branch = new THREE.Group();
    
    // Branch
    const branchGeometry = new THREE.CylinderGeometry(0.05, 0.1, 3, 8);
    branchGeometry.rotateZ(Math.PI / 6);
    const branchMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const branchMesh = new THREE.Mesh(branchGeometry, branchMaterial);
    branchMesh.position.y = -0.5;
    branch.add(branchMesh);
    
    // Leaves
    const leafGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    leafGeometry.scale(1, 0.1, 1);
    const colors = [0xff4500, 0xff8c00, 0xffd700, 0xdaa520];
    
    for (let i = 0; i < 15; i++) {
        const t = i / 15;
        const angle = t * Math.PI;
        const radius = t * 2;
        
        const leaf = new THREE.Mesh(leafGeometry, new THREE.MeshPhongMaterial({ 
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        
        leaf.position.x = Math.cos(angle) * radius;
        leaf.position.y = Math.sin(angle) * radius - 0.5;
        leaf.rotation.z = angle;
        
        branch.add(leaf);
    }
    
    group.add(branch);
}

function createSunflowers(group) {
    // Vase
    const vaseGeometry = new THREE.CylinderGeometry(0.8, 0.6, 1.2, 32);
    const vaseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xdeb887,
        shininess: 100
    });
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.y = -1;
    group.add(vase);
    
    // Create 3 sunflowers
    for (let i = 0; i < 3; i++) {
        const sunflower = createSunflower();
        sunflower.position.x = (i - 1) * 0.6;
        sunflower.position.y = 0;
        sunflower.position.z = (Math.random() - 0.5) * 0.5;
        group.add(sunflower);
    }
}

function createSunflower() {
    const sunflower = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -0.5;
    sunflower.add(stem);
    
    // Center
    const centerGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 1;
    sunflower.add(center);
    
    // Petals
    const petalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    petalGeometry.scale(1, 0.2, 0.5);
    const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xffd700 });
    
    for (let i = 0; i < 16; i++) {
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        const angle = (i / 16) * Math.PI * 2;
        
        petal.position.x = Math.cos(angle) * 0.8;
        petal.position.z = Math.sin(angle) * 0.8;
        petal.position.y = 1;
        
        petal.rotation.y = angle;
        
        sunflower.add(petal);
    }
    
    // Leaves
    const leafGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    leafGeometry.scale(1, 0.1, 1);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    
    for (let i = 0; i < 4; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(
            (Math.random() - 0.5) * 0.5,
            Math.random() * 1.5 - 0.5,
            (Math.random() - 0.5) * 0.5
        );
        leaf.rotation.z = Math.random() * Math.PI * 2;
        sunflower.add(leaf);
    }
    
    return sunflower;
}

function initBenefitIcons() {
    const benefitIcons = document.querySelectorAll('.benefit-icon');
    
    benefitIcons.forEach((container, index) => {
        // Set up Three.js scene for each benefit icon
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);
        
        // Create different icons based on index
        createBenefitIcon(scene, index);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate icon slightly
            if (scene.children.length > 0) {
                scene.children[0].rotation.y += 0.01;
            }
            
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createBenefitIcon(scene, index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Sustainable Materials
            // Recycle symbol
            const recycleGeometry = new THREE.TorusGeometry(0.8, 0.1, 16, 32);
            const recycleMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
            const recycle = new THREE.Mesh(recycleGeometry, recycleMaterial);
            icon.add(recycle);
            
            // Arrow parts
            const arrowGeometry = new THREE.BoxGeometry(0.4, 0.1, 0.1);
            const arrowMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
            
            for (let i = 0; i < 3; i++) {
                const angle = (i / 3) * Math.PI * 2;
                const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
                
                arrow.position.x = Math.cos(angle) * 0.6;
                arrow.position.y = Math.sin(angle) * 0.6;
                arrow.rotation.z = angle + Math.PI / 2;
                
                // Add arrowhead
                const headGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
                const head = new THREE.Mesh(headGeometry, arrowMaterial);
                head.position.x = Math.cos(angle) * 0.8;
                head.position.y = Math.sin(angle) * 0.8;
                head.rotation.z = angle;
                
                icon.add(arrow);
                icon.add(head);
            }
            break;
            
        case 1: // Long-Lasting Beauty
            // Flower icon
            const flowerCenter = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.MeshPhongMaterial({ color: 0xf8c537 })
            );
            icon.add(flowerCenter);
            
            // Petals
            const petalGeometry = new THREE.SphereGeometry(0.4, 32, 32);
            petalGeometry.scale(1, 0.3, 1);
            const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
            
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const petal = new THREE.Mesh(petalGeometry, petalMaterial);
                
                petal.position.x = Math.cos(angle) * 0.8;
                petal.position.y = Math.sin(angle) * 0.8;
                petal.rotation.z = angle;
                
                icon.add(petal);
            }
            break;
            
        case 2: // Carbon Neutral Shipping
            // Leaf icon
            const leafGeometry = new THREE.SphereGeometry(0.8, 32, 32);
            leafGeometry.scale(1, 0.2, 1);
            const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            
            // Veins
            const veinGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1, 8);
            const veinMaterial = new THREE.MeshPhongMaterial({ color: 0x3d8b3d });
            
            // Main vein
            const mainVein = new THREE.Mesh(veinGeometry, veinMaterial);
            mainVein.rotation.z = Math.PI / 2;
            mainVein.position.y = 0.1;
            
            // Side veins
            for (let i = 0; i < 5; i++) {
                const t = (i + 1) / 6;
                const vein = new THREE.Mesh(veinGeometry, veinMaterial);
                vein.scale.set(1, 0.6 - t * 0.2, 1);
                vein.position.x = t * 0.6;
                vein.position.y = 0.1;
                vein.rotation.z = Math.PI / 2 - (0.3 + t * 0.2);
                
                const vein2 = new THREE.Mesh(veinGeometry, veinMaterial);
                vein2.scale.set(1, 0.6 - t * 0.2, 1);
                vein2.position.x = -t * 0.6;
                vein2.position.y = 0.1;
                vein2.rotation.z = Math.PI / 2 + (0.3 + t * 0.2);
                
                icon.add(vein);
                icon.add(vein2);
            }
            
            icon.add(leaf);
            icon.add(mainVein);
            break;
    }
    
    scene.add(icon);
}

function setupFilters() {
    const categoryFilter = document.getElementById('category');
    const colorFilter = document.getElementById('color');
    const priceFilter = document.getElementById('price');
    const productCards = document.querySelectorAll('.product-card');
    
    function filterProducts() {
        const categoryValue = categoryFilter.value;
        const colorValue = colorFilter.value;
        const priceValue = priceFilter.value;
        
        productCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardColor = card.getAttribute('data-color');
            const cardPrice = card.getAttribute('data-price');
            
            const categoryMatch = categoryValue === 'all' || cardCategory === categoryValue;
            const colorMatch = colorValue === 'all' || cardColor === colorValue;
            const priceMatch = priceValue === 'all' || cardPrice === priceValue;
            
            if (categoryMatch && colorMatch && priceMatch) {
                card.style.display = 'block';
                gsap.fromTo(card, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.5 }
                );
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    categoryFilter.addEventListener('change', filterProducts);
    colorFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
}

function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            
            // Animation
            gsap.to(this, {
                backgroundColor: '#3a7720',
                duration: 0.3,
                onComplete: function() {
                    gsap.to(this.target, {
                        backgroundColor: '#4a8f29',
                        duration: 0.3
                    });
                }
            });
            
            // Create flying flower effect
            const flyingFlower = document.createElement('div');
            flyingFlower.className = 'flying-flower';
            flyingFlower.innerHTML = '🌸';
            productCard.appendChild(flyingFlower);
            
            gsap.to(flyingFlower, {
                x: 200,
                y: -100,
                opacity: 0,
                scale: 1.5,
                duration: 1,
                onComplete: function() {
                    flyingFlower.remove();
                    
                    // Show notification
                    const notification = document.createElement('div');
                    notification.className = 'cart-notification';
                    notification.textContent = `${productName} added to cart (${productPrice})`;
                    document.body.appendChild(notification);
                    
                    gsap.fromTo(notification, 
                        { y: 20, opacity: 0 }, 
                        { y: 0, opacity: 1, duration: 0.3 }
                    );
                    
                    setTimeout(() => {
                        gsap.to(notification, {
                            y: -20,
                            opacity: 0,
                            duration: 0.3,
                            onComplete: function() {
                                notification.remove();
                            }
                        });
                    }, 2000);
                }
            });
        });
    });
    
    // Add styles for flying flower and notification
    const style = document.createElement('style');
    style.textContent = `
        .flying-flower {
            position: absolute;
            font-size: 24px;
            z-index: 100;
            pointer-events: none;
        }
        
        .cart-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4a8f29;
            color: white;
            padding: 15px 25px;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
        }
    `;
    document.head.appendChild(style);
}