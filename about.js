document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D flower in hero section
    initHeroFlower();
    
    // Initialize founder 3D model
    initFounderModel();
    
    // Initialize mission icons
    initMissionIcons();
    
    // Initialize process visualization
    initProcessVisualization();
    
    // Initialize team members
    initTeamMembers();
    
    // Initialize testimonials
    initTestimonials();
    
    // Initialize CTA flower
    initCTAFlower();
    
    // Animate stats
    animateStats();
});

function initHeroFlower() {
    const container = document.getElementById('aboutFlower3d');
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
    const petalGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    petalGeometry.scale(1, 0.3, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xff6b6b,
        shininess: 50
    });
    
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.x = Math.cos(angle) * 1.2;
        petal.position.z = Math.sin(angle) * 1.2;
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

function initFounderModel() {
    const container = document.getElementById('founder3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 3);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create simple stylized character
    const founder = new THREE.Group();
    
    // Head
    const headGeometry = new THREE.SphereGeometry(0.5, 32, 32);
    const headMaterial = new THREE.MeshPhongMaterial({ color: 0xf5d0b3 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 1.5;
    founder.add(head);
    
    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1, 32);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5;
    founder.add(body);
    
    // Arms
    const armGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0xf5d0b3 });
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-0.5, 1, 0);
    leftArm.rotation.z = Math.PI / 4;
    founder.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0.5, 1, 0);
    rightArm.rotation.z = -Math.PI / 4;
    founder.add(rightArm);
    
    // Legs
    const legGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.8, 8);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(-0.2, -0.5, 0);
    founder.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0.2, -0.5, 0);
    founder.add(rightLeg);
    
    // Flower in hand
    const flower = createSimpleFlower();
    flower.position.set(-0.8, 1.2, 0);
    flower.scale.set(0.3, 0.3, 0.3);
    founder.add(flower);
    
    scene.add(founder);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Slight bobbing animation
        founder.position.y = Math.sin(Date.now() * 0.001) * 0.05;
        
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

function createSimpleFlower() {
    const flower = new THREE.Group();
    
    // Stem
    const stemGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
    const stemMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const stem = new THREE.Mesh(stemGeometry, stemMaterial);
    stem.position.y = -0.5;
    flower.add(stem);
    
    // Flower center
    const centerGeometry = new THREE.SphereGeometry(0.2, 32, 32);
    const centerMaterial = new THREE.MeshPhongMaterial({ color: 0xf8c537 });
    const center = new THREE.Mesh(centerGeometry, centerMaterial);
    center.position.y = 0.5;
    flower.add(center);
    
    // Petals
    const petalGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    petalGeometry.scale(1, 0.2, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeometry, petalMaterial);
        
        petal.position.x = Math.cos(angle) * 0.5;
        petal.position.z = Math.sin(angle) * 0.5;
        petal.position.y = 0.5;
        petal.rotation.y = angle;
        
        flower.add(petal);
    }
    
    return flower;
}

function initMissionIcons() {
    const missionContainers = [
        document.getElementById('mission3d-1'),
        document.getElementById('mission3d-2'),
        document.getElementById('mission3d-3'),
        document.getElementById('mission3d-4')
    ];
    
    missionContainers.forEach((container, index) => {
        if (!container) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.querySelector('.mission-icon').appendChild(renderer.domElement);
        
        // Create different icons based on index
        const icon = createMissionIcon(index);
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

function createMissionIcon(index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Sustainability
            // Leaf icon
            const leafGeometry = new THREE.SphereGeometry(0.8, 32, 32);
            leafGeometry.scale(1, 0.2, 1);
            const leafMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            icon.add(leaf);
            
            // Recycle symbol
            const recycleGeometry = new THREE.TorusGeometry(0.6, 0.08, 16, 32);
            const recycleMaterial = new THREE.MeshPhongMaterial({ color: 0x3d8b3d });
            const recycle = new THREE.Mesh(recycleGeometry, recycleMaterial);
            icon.add(recycle);
            break;
            
        case 1: // Timeless Beauty
            // Flower icon
            const flowerCenter = new THREE.Mesh(
                new THREE.SphereGeometry(0.3, 32, 32),
                new THREE.MeshPhongMaterial({ color: 0xf8c537 })
            );
            icon.add(flowerCenter);
            
            // Clock hands
            const hourHand = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.4, 0.02),
                new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
            );
            hourHand.position.y = 0.2;
            
            const minuteHand = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.6, 0.02),
                new THREE.MeshPhongMaterial({ color: 0x2c3e50 })
            );
            minuteHand.rotation.z = Math.PI / 3;
            
            const clockHands = new THREE.Group();
            clockHands.add(hourHand);
            clockHands.add(minuteHand);
            clockHands.position.y = -0.5;
            icon.add(clockHands);
            break;
            
        case 2: // Ethical Production
            // Handshake icon
            const leftHand = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 32, 32),
                new THREE.MeshPhongMaterial({ color: 0xf5d0b3 })
            );
            leftHand.position.set(-0.3, 0, 0);
            leftHand.rotation.z = Math.PI / 4;
            
            const rightHand = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 32, 32),
                new THREE.MeshPhongMaterial({ color: 0xf5d0b3 })
            );
            rightHand.position.set(0.3, 0, 0);
            rightHand.rotation.z = -Math.PI / 4;
            
            icon.add(leftHand);
            icon.add(rightHand);
            break;
            
        case 3: // Innovative Design
            // Lightbulb with flower
            const bulbGeometry = new THREE.SphereGeometry(0.6, 32, 32);
            const bulbMaterial = new THREE.MeshPhongMaterial({ 
                color: 0xf8c537,
                emissive: 0xf8c537,
                emissiveIntensity: 0.3
            });
            const bulb = new THREE.Mesh(bulbGeometry, bulbMaterial);
            
            const baseGeometry = new THREE.CylinderGeometry(0.2, 0.3, 0.3, 32);
            const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
            const base = new THREE.Mesh(baseGeometry, baseMaterial);
            base.position.y = -0.5;
            
            const smallFlower = createSimpleFlower();
            smallFlower.scale.set(0.2, 0.2, 0.2);
            smallFlower.position.y = 0.3;
            
            icon.add(bulb);
            icon.add(base);
            icon.add(smallFlower);
            break;
    }
    
    return icon;
}

function initProcessVisualization() {
    const container = document.getElementById('processVisual3d');
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
    
    // Create process visualization
    const process = new THREE.Group();
    
    // Factory building
    const factory = createFactory();
    factory.position.y = -1;
    process.add(factory);
    
    // Conveyor belt
    const conveyor = createConveyorBelt();
    conveyor.position.y = -0.5;
    process.add(conveyor);
    
    // Flower products on conveyor
    const flowers = [];
    for (let i = 0; i < 5; i++) {
        const flower = createSimpleFlower();
        flower.scale.set(0.5, 0.5, 0.5);
        flower.position.x = -4 + i;
        flower.position.y = 0.2;
        flower.position.z = 0.5;
        flowers.push(flower);
        process.add(flower);
    }
    
    // Truck
    const truck = createDeliveryTruck();
    truck.position.set(4, -0.5, 0);
    process.add(truck);
    
    scene.add(process);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Move flowers on conveyor
        flowers.forEach(flower => {
            flower.position.x += 0.01;
            if (flower.position.x > 4) {
                flower.position.x = -4;
            }
            
            // Slight bobbing
            flower.position.y = 0.2 + Math.sin(Date.now() * 0.005 + flower.position.x) * 0.05;
        });
        
        // Rotate truck wheels
        if (truck.children[3]) truck.children[3].rotation.x += 0.05; // front wheel
        if (truck.children[4]) truck.children[4].rotation.x += 0.05; // back wheel
        
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

function createFactory() {
    const factory = new THREE.Group();
    
    // Main building
    const buildingGeometry = new THREE.BoxGeometry(3, 2, 3);
    const buildingMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.y = 1;
    factory.add(building);
    
    // Roof
    const roofGeometry = new THREE.ConeGeometry(2.5, 1, 4);
    const roofMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 2.5;
    roof.rotation.y = Math.PI / 4;
    factory.add(roof);
    
    // Chimney
    const chimneyGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const chimneyMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
    const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
    chimney.position.set(0.5, 2.5, 0.5);
    factory.add(chimney);
    
    // Smoke
    const smokeGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const smokeMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xeeeeee,
        transparent: true,
        opacity: 0.5
    });
    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.set(0.5, 3, 0.5);
    factory.add(smoke);
    
    return factory;
}

function createConveyorBelt() {
    const conveyor = new THREE.Group();
    
    // Base
    const baseGeometry = new THREE.BoxGeometry(8, 0.1, 1);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x777777 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    conveyor.add(base);
    
    // Belt
    const beltGeometry = new THREE.BoxGeometry(8, 0.05, 0.8);
    const beltMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const belt = new THREE.Mesh(beltGeometry, beltMaterial);
    belt.position.y = 0.1;
    conveyor.add(belt);
    
    // Rollers
    const rollerGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.8, 8);
    const rollerMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc });
    
    for (let i = 0; i < 5; i++) {
        const roller = new THREE.Mesh(rollerGeometry, rollerMaterial);
        roller.position.x = -3 + i * 1.5;
        roller.rotation.z = Math.PI / 2;
        conveyor.add(roller);
    }
    
    return conveyor;
}

function createDeliveryTruck() {
    const truck = new THREE.Group();
    
    // Cab
    const cabGeometry = new THREE.BoxGeometry(1, 0.8, 1.2);
    const cabMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const cab = new THREE.Mesh(cabGeometry, cabMaterial);
    cab.position.set(-0.5, 0.4, 0);
    truck.add(cab);
    
    // Trailer
    const trailerGeometry = new THREE.BoxGeometry(1.5, 0.8, 1.2);
    const trailerMaterial = new THREE.MeshPhongMaterial({ color: 0x3d8b3d });
    const trailer = new THREE.Mesh(trailerGeometry, trailerMaterial);
    trailer.position.set(0.8, 0.4, 0);
    truck.add(trailer);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.1, 16);
    wheelGeometry.rotateZ(Math.PI / 2);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const frontWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontWheel.position.set(-0.8, 0, 0);
    truck.add(frontWheel);
    
    const backWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backWheel.position.set(1.2, 0, 0);
    truck.add(backWheel);
    
    return truck;
}

function initTeamMembers() {
    const teamContainers = [
        document.getElementById('team3d-1'),
        document.getElementById('team3d-2'),
        document.getElementById('team3d-3')
    ];
    
    teamContainers.forEach((container, index) => {
        if (!container) return;
        
        const imageContainer = container.querySelector('.member-image');
        if (!imageContainer) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, imageContainer.clientWidth / imageContainer.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(imageContainer.clientWidth, imageContainer.clientHeight);
        imageContainer.appendChild(renderer.domElement);
        
        // Create team member head
        const head = createTeamMemberHead(index);
        scene.add(head);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            head.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createTeamMemberHead(index) {
    const head = new THREE.Group();
    
    // Head shape
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    let skinColor;
    
    switch(index) {
        case 0: // Emma
            skinColor = 0xf5d0b3;
            break;
        case 1: // James
            skinColor = 0xd2b48c;
            break;
        case 2: // Sophia
            skinColor = 0xe6c19c;
            break;
    }
    
    const headMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    head.add(headMesh);
    
    // Hair
    const hairGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    hairGeometry.scale(1, 1.2, 1);
    let hairColor;
    
    switch(index) {
        case 0: // Emma - blonde
            hairColor = 0xf8c537;
            break;
        case 1: // James - black
            hairColor = 0x333333;
            break;
        case 2: // Sophia - brown
            hairColor = 0x5c4033;
            break;
    }
    
    const hairMaterial = new THREE.MeshPhongMaterial({ color: hairColor });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 0.1;
    head.add(hair);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.2, 0.9);
    head.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.2, 0.9);
    head.add(rightEye);
    
    // Mouth
    const mouthGeometry = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    mouthGeometry.rotateX(Math.PI / 2);
    const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.2, 0.8);
    head.add(mouth);
    
    // Accessories based on index
    if (index === 0) { // Emma - glasses
        const glassGeometry = new THREE.TorusGeometry(0.3, 0.03, 8, 16);
        const glassMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
        
        const leftGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        leftGlass.position.set(-0.3, 0.2, 0.95);
        leftGlass.rotateZ(Math.PI / 8);
        head.add(leftGlass);
        
        const rightGlass = new THREE.Mesh(glassGeometry, glassMaterial);
        rightGlass.position.set(0.3, 0.2, 0.95);
        rightGlass.rotateZ(-Math.PI / 8);
        head.add(rightGlass);
        
        const bridge = new THREE.Mesh(
            new THREE.BoxGeometry(0.4, 0.02, 0.02),
            glassMaterial
        );
        bridge.position.set(0, 0.15, 0.95);
        head.add(bridge);
    } else if (index === 1) { // James - beard
        const beardGeometry = new THREE.CylinderGeometry(0.6, 0.8, 0.3, 32);
        beardGeometry.rotateX(Math.PI / 2);
        const beardMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
        const beard = new THREE.Mesh(beardGeometry, beardMaterial);
        beard.position.set(0, -0.5, 0.6);
        head.add(beard);
    } else if (index === 2) { // Sophia - earrings
        const earringGeometry = new THREE.SphereGeometry(0.08, 16, 16);
        const earringMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xf8c537,
            emissive: 0xf8c537,
            emissiveIntensity: 0.3
        });
        
        const leftEarring = new THREE.Mesh(earringGeometry, earringMaterial);
        leftEarring.position.set(-0.9, 0, 0);
        head.add(leftEarring);
        
        const rightEarring = new THREE.Mesh(earringGeometry, earringMaterial);
        rightEarring.position.set(0.9, 0, 0);
        head.add(rightEarring);
    }
    
    // Scale down for the container
    head.scale.set(0.5, 0.5, 0.5);
    
    return head;
}

function initTestimonials() {
    const testimonialContainers = [
        document.getElementById('testimonial3d-1'),
        document.getElementById('testimonial3d-2'),
        document.getElementById('testimonial3d-3')
    ];
    
    testimonialContainers.forEach((container, index) => {
        if (!container) return;
        
        const imageContainer = container.querySelector('.customer-image');
        if (!imageContainer) return;
        
        // Set up Three.js scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf9f9f9);
        
        const camera = new THREE.PerspectiveCamera(75, imageContainer.clientWidth / imageContainer.clientHeight, 0.1, 1000);
        camera.position.z = 3;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(imageContainer.clientWidth, imageContainer.clientHeight);
        imageContainer.appendChild(renderer.domElement);
        
        // Create customer head
        const head = createCustomerHead(index);
        scene.add(head);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            head.rotation.y += 0.005;
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createCustomerHead(index) {
    const head = new THREE.Group();
    
    // Head shape
    const headGeometry = new THREE.SphereGeometry(1, 32, 32);
    let skinColor;
    
    switch(index) {
        case 0: // Sarah
            skinColor = 0xf5d0b3;
            break;
        case 1: // Michael
            skinColor = 0xd2b48c;
            break;
        case 2: // Emily
            skinColor = 0xe6c19c;
            break;
    }
    
    const headMaterial = new THREE.MeshPhongMaterial({ color: skinColor });
    const headMesh = new THREE.Mesh(headGeometry, headMaterial);
    head.add(headMesh);
    
    // Hair
    const hairGeometry = new THREE.SphereGeometry(1.1, 32, 32);
    hairGeometry.scale(1, 1.2, 1);
    let hairColor;
    
    switch(index) {
        case 0: // Sarah - blonde
            hairColor = 0xf8c537;
            break;
        case 1: // Michael - black
            hairColor = 0x333333;
            break;
        case 2: // Emily - red
            hairColor = 0xa52a2a;
            break;
    }
    
    const hairMaterial = new THREE.MeshPhongMaterial({ color: hairColor });
    const hair = new THREE.Mesh(hairGeometry, hairMaterial);
    hair.position.y = 0.1;
    head.add(hair);
    
    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.15, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0x2c3e50 });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.3, 0.2, 0.9);
    head.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.3, 0.2, 0.9);
    head.add(rightEye);
    
    // Mouth - smiling
    const mouthGeometry = new THREE.TorusGeometry(0.2, 0.05, 8, 16);
    mouthGeometry.rotateX(Math.PI / 2);
    const mouthMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0, -0.2, 0.8);
    mouth.scale.set(1, 1.5, 1);
    head.add(mouth);
    
    // Scale down for the container
    head.scale.set(0.3, 0.3, 0.3);
    
    return head;
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
    const petalGeometry = new THREE.SphereGeometry(0.7, 32, 32);
    petalGeometry.scale(1, 0.3, 1);
    const petalMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a8f29,
        emissive: 0x4a8f29,
        emissiveIntensity: 0.2
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
        
        flower.rotation.y += 0.02;
        
        // Pulsing effect
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
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

function animateStats() {
    const statCards = [
        document.getElementById('stat1'),
        document.getElementById('stat2'),
        document.getElementById('stat3')
    ];
    
    const targetValues = [5, 250, 10000];
    const durations = [2, 2.5, 3];
    
    statCards.forEach((card, index) => {
        const numberElement = card.querySelector('h3');
        
        gsap.fromTo(numberElement, 
            { textContent: 0 },
            {
                textContent: targetValues[index],
                duration: durations[index],
                ease: "power1.out",
                snap: { textContent: 1 },
                onUpdate: function() {
                    if (index === 2) { // Format the 10K+ number
                        const value = Math.floor(this.targets()[0].textContent);
                        if (value >= 1000) {
                            numberElement.textContent = `${Math.floor(value/1000)}K+`;
                        } else {
                            numberElement.textContent = `${value}+`;
                        }
                    } else {
                        const value = Math.floor(this.targets()[0].textContent);
                        numberElement.textContent = `${value}+`;
                    }
                }
            }
        );
    });
}