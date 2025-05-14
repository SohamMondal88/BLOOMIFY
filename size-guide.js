document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D flower in hero section
    initHeroFlower();
    
    // Initialize size category tabs
    initSizeTabs();
    
    // Initialize 3D visuals for each category
    initBouquetVisual();
    initPlantVisual();
    initWreathVisual();
    initCenterpieceVisual();
    
    // Initialize comparison visual
    initComparisonVisual();
    
    // Initialize tips icons
    initTipsIcons();
    
    // Initialize CTA flower
    initCTAFlower();
});

function initHeroFlower() {
    const container = document.getElementById('sizeGuideFlower3d');
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
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
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

function initSizeTabs() {
    const tabs = document.querySelectorAll('.size-tab');
    const contents = document.querySelectorAll('.size-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all content
            contents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding content
            const category = this.getAttribute('data-category');
            document.getElementById(category).classList.add('active');
        });
    });
}

function initBouquetVisual() {
    const container = document.getElementById('bouquetVisual3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create bouquet visualization
    const bouquet = createBouquet();
    scene.add(bouquet);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Add size indicators
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const sizeColors = [0x4a8f29, 0xf8c537, 0xff6b6b, 0x9370db];
    
    sizes.forEach((size, index) => {
        const sizeIndicator = createSizeIndicator(size, sizeColors[index]);
        sizeIndicator.position.y = index * 2 - 3;
        scene.add(sizeIndicator);
    });
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        bouquet.rotation.y += 0.005;
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

function createBouquet() {
    const bouquet = new THREE.Group();
    
    // Vase
    const vaseGeometry = new THREE.CylinderGeometry(1, 0.8, 1.5, 32);
    const vaseMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x6a5acd,
        shininess: 100,
        transparent: true,
        opacity: 0.8
    });
    const vase = new THREE.Mesh(vaseGeometry, vaseMaterial);
    vase.position.y = -1.5;
    bouquet.add(vase);
    
    // Create multiple flowers
    for (let i = 0; i < 15; i++) {
        const flower = createFlower();
        flower.position.x = (Math.random() - 0.5) * 2;
        flower.position.z = (Math.random() - 0.5) * 2;
        flower.position.y = Math.random() * 0.5;
        flower.rotation.y = Math.random() * Math.PI * 2;
        bouquet.add(flower);
    }
    
    return bouquet;
}

function createFlower() {
    const flower = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 1;
    flower.add(stem);
    
    // Flower head
    const centerGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xf8c537 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 2;
    flower.add(center);
    
    // Petals
    const petalGeometry = new THREE.SphereGeometry(0.3, 16, 16);
    petalGeometry.scale(1, 0.2, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        side: THREE.DoubleSide
    });
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.x = Math.cos(angle) * 0.5;
        petal.position.z = Math.sin(angle) * 0.5;
        petal.position.y = 2;
        petal.rotation.y = angle;
        
        flower.add(petal);
    }
    
    return flower;
}

function createSizeIndicator(size, color) {
    const indicator = new THREE.Group();
    
    // Text label
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#000000';
    context.textAlign = 'center';
    context.fillText(size.toUpperCase(), canvas.width/2, canvas.height/2 + 8);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true,
        side: THREE.DoubleSide
    });
    const labelGeometry = new THREE.PlaneGeometry(2, 1);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(0, 0, -3);
    label.rotation.y = Math.PI;
    indicator.add(label);
    
    // Size representation
    let height;
    switch(size) {
        case 'small': height = 1; break;
        case 'medium': height = 1.5; break;
        case 'large': height = 2.5; break;
        case 'xlarge': height = 3.5; break;
    }
    
    const sizeGeometry = new THREE.BoxGeometry(1.5, height, 1.5);
    const sizeMaterial = new THREE.MeshPhongMaterial({ 
        color: color,
        transparent: true,
        opacity: 0.7
    });
    const sizeBox = new THREE.Mesh(sizeGeometry, sizeMaterial);
    sizeBox.position.y = height / 2;
    indicator.add(sizeBox);
    
    return indicator;
}

function initPlantVisual() {
    const container = document.getElementById('plantVisual3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create plant visualization
    const plant = createPottedPlant();
    scene.add(plant);
    
    // Add size indicators
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const sizeColors = [0x4a8f29, 0xf8c537, 0xff6b6b, 0x9370db];
    
    sizes.forEach((size, index) => {
        const sizeIndicator = createSizeIndicator(size, sizeColors[index]);
        sizeIndicator.position.x = index * 3 - 4.5;
        sizeIndicator.position.y = 0;
        scene.add(sizeIndicator);
    });
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
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

function createPottedPlant() {
    const plant = new THREE.Group();
    
    // Pot
    const potGeometry = new THREE.CylinderGeometry(1, 0.8, 1, 32);
    const potMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const pot = new THREE.Mesh(potGeometry, potMaterial);
    pot.position.y = -0.5;
    plant.add(pot);
    
    // Plant
    const stemGeometry = new THREE.CylinderGeometry(0.1, 0.3, 3, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = 1;
    plant.add(stem);
    
    // Leaves
    const leafGeometry = new THREE.SphereGeometry(0.8, 32, 32);
    leafGeometry.scale(1, 0.2, 1);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x3d8b3d });
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        const height = 1 + Math.random() * 2;
        const radius = 0.5 + Math.random() * 1;
        
        leaf.position.x = Math.cos(angle) * radius;
        leaf.position.z = Math.sin(angle) * radius;
        leaf.position.y = height;
        leaf.rotation.z = angle;
        leaf.rotation.x = Math.PI / 4;
        
        plant.add(leaf);
    }
    
    return plant;
}

function initWreathVisual() {
    const container = document.getElementById('wreathVisual3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create wreath visualization
    const wreath = createWreath();
    scene.add(wreath);
    
    // Add size indicators
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const sizeColors = [0x4a8f29, 0xf8c537, 0xff6b6b, 0x9370db];
    
    sizes.forEach((size, index) => {
        const sizeIndicator = createSizeIndicator(size, sizeColors[index]);
        sizeIndicator.position.x = index * 3 - 4.5;
        sizeIndicator.position.y = 0;
        scene.add(sizeIndicator);
    });
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        wreath.rotation.y += 0.005;
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

function createWreath() {
    const wreath = new THREE.Group();
    
    // Base ring
    const ringGeometry = new THREE.TorusGeometry(3, 0.5, 16, 100);
    const ringMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    wreath.add(ring);
    
    // Decorations
    const leafGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    leafGeometry.scale(1, 0.3, 1);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x3d8b3d });
    
    for (let i = 0; i < 24; i++) {
        const angle = (i / 24) * Math.PI * 2;
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        
        leaf.position.x = Math.cos(angle) * 3;
        leaf.position.z = Math.sin(angle) * 3;
        leaf.rotation.z = angle;
        
        wreath.add(leaf);
    }
    
    // Scale down to fit in container
    wreath.scale.set(0.6, 0.6, 0.6);
    
    return wreath;
}

function initCenterpieceVisual() {
    const container = document.getElementById('centerpieceVisual3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 8;
    camera.position.y = 2;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create centerpiece visualization
    const centerpiece = createCenterpiece();
    scene.add(centerpiece);
    
    // Add size indicators
    const sizes = ['small', 'medium', 'large', 'xlarge'];
    const sizeColors = [0x4a8f29, 0xf8c537, 0xff6b6b, 0x9370db];
    
    sizes.forEach((size, index) => {
        const sizeIndicator = createSizeIndicator(size, sizeColors[index]);
        sizeIndicator.position.x = index * 3 - 4.5;
        sizeIndicator.position.y = 0;
        scene.add(sizeIndicator);
    });
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
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

function createCenterpiece() {
    const centerpiece = new THREE.Group();
    
    // Base
    const baseGeometry = new THREE.BoxGeometry(4, 0.5, 2);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -0.25;
    centerpiece.add(base);
    
    // Flowers
    for (let i = 0; i < 5; i++) {
        const flower = createFlower();
        flower.position.x = -2 + i;
        flower.position.y = 1;
        flower.scale.set(0.7, 0.7, 0.7);
        centerpiece.add(flower);
    }
    
    // Greenery
    const leafGeometry = new THREE.SphereGeometry(0.8, 16, 16);
    leafGeometry.scale(1, 0.2, 1);
    const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    
    for (let i = 0; i < 10; i++) {
        const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
        leaf.position.set(
            -2 + Math.random() * 4,
            0.5 + Math.random() * 0.5,
            -0.8 + Math.random() * 1.6
        );
        leaf.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        centerpiece.add(leaf);
    }
    
    return centerpiece;
}

function initComparisonVisual() {
    const container = document.getElementById('comparisonVisual3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 10;
    camera.position.y = 3;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create comparison objects
    const comparison = new THREE.Group();
    
    // Common household objects for comparison
    const objects = [
        { name: 'Coffee Mug', height: 0.1, color: 0x8b4513 },
        { name: 'Wine Bottle', height: 0.3, color: 0x2c3e50 },
        { name: 'Table Lamp', height: 0.5, color: 0xf8c537 },
        { name: 'Chair', height: 0.9, color: 0xff6b6b }
    ];
    
    objects.forEach((obj, index) => {
        // Object
        const geometry = new THREE.BoxGeometry(0.5, obj.height, 0.5);
        const material = new THREE.MeshPhongMaterial({ color: obj.color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(index * 2 - 3, obj.height / 2, 0);
        comparison.add(mesh);
        
        // Label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 20px Arial';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.fillText(obj.name, canvas.width/2, canvas.height/2 + 10);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const labelGeometry = new THREE.PlaneGeometry(1.5, 0.75);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(index * 2 - 3, obj.height + 0.5, 0);
        label.rotation.y = Math.PI;
        comparison.add(label);
    });
    
    // Flower sizes for comparison
    const sizes = [
        { name: 'Small', height: 0.2, color: 0x4a8f29 },
        { name: 'Medium', height: 0.4, color: 0xf8c537 },
        { name: 'Large', height: 0.6, color: 0xff6b6b },
        { name: 'X-Large', height: 0.9, color: 0x9370db }
    ];
    
    sizes.forEach((size, index) => {
        // Flower
        const flower = createFlower();
        flower.scale.set(size.height, size.height, size.height);
        flower.position.set(index * 2 - 3, size.height * 2, 2);
        comparison.add(flower);
        
        // Label
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = 'Bold 20px Arial';
        context.fillStyle = '#000000';
        context.textAlign = 'center';
        context.fillText(size.name, canvas.width/2, canvas.height/2 + 10);
        
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });
        const labelGeometry = new THREE.PlaneGeometry(1.5, 0.75);
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(index * 2 - 3, size.height * 2 + 0.5, 2);
        label.rotation.y = Math.PI;
        comparison.add(label);
    });
    
    scene.add(comparison);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        comparison.rotation.y += 0.002;
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

function initTipsIcons() {
    const tipContainers = [
        document.getElementById('tip3d-1'),
        document.getElementById('tip3d-2'),
        document.getElementById('tip3d-3'),
        document.getElementById('tip3d-4')
    ];
    
    tipContainers.forEach((container, index) => {
        if (!container) return;
        
        const iconContainer = container.querySelector('.tip-icon');
        if (!iconContainer) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, iconContainer.clientWidth / iconContainer.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(iconContainer.clientWidth, iconContainer.clientHeight);
        iconContainer.appendChild(renderer.domElement);
        
        // Create different icons based on index
        const icon = createTipIcon(index);
        scene.add(icon);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            icon.rotation.y += 0.01;
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createTipIcon(index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Measuring
            // Tape measure
            const tapeGeometry = new THREE.BoxGeometry(1, 0.1, 0.3);
            const tapeMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
            const tape = new THREE.Mesh(tapeGeometry, tapeMaterial);
            
            const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32);
            const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(-0.5, 0, 0);
            wheel.rotation.x = Math.PI / 2;
            
            icon.add(tape);
            icon.add(wheel);
            break;
            
        case 1: // Table centerpieces
            // Table
            const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
            const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x8b4513 });
            const table = new THREE.Mesh(tableGeometry, tableMaterial);
            table.position.y = -0.5;
            
            // Centerpiece
            const centerpiece = createFlower();
            centerpiece.scale.set(0.5, 0.5, 0.5);
            centerpiece.position.y = 0.2;
            
            icon.add(table);
            icon.add(centerpiece);
            break;
            
        case 2: // Entryway displays
            // Door frame
            const doorGeometry = new THREE.BoxGeometry(1.5, 2, 0.1);
            const doorMaterial = new THREE.MeshPhongMaterial({ color: 0xdeb887 });
            const door = new THREE.Mesh(doorGeometry, doorMaterial);
            door.position.set(0, 0, -0.5);
            
            // Plant
            const plant = createPottedPlant();
            plant.scale.set(0.3, 0.3, 0.3);
            plant.position.set(0, 0, 0.5);
            
            icon.add(door);
            icon.add(plant);
            break;
            
        case 3: // Wall decor
            // Wall
            const wallGeometry = new THREE.BoxGeometry(2, 1.5, 0.1);
            const wallMaterial = new THREE.MeshPhongMaterial({ color: 0xf5f5f5 });
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            
            // Wreath
            const wreath = createWreath();
            wreath.scale.set(0.2, 0.2, 0.2);
            wreath.position.set(0, 0, 0.1);
            
            icon.add(wall);
            icon.add(wreath);
            break;
    }
    
    // Scale down for the container
    icon.scale.set(0.5, 0.5, 0.5);
    
    return icon;
}

function initCTAFlower() {
    const container = document.getElementById('ctaFlower3d');
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
        color: 0x4a8f29,
        emissive: 0x4a8f29,
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
        
        // Gentle pulsing effect
        const scale = 1 + Math.sin(Date.now() * 0.001) * 0.1;
        flower.scale.set(scale, scale, scale);
        
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