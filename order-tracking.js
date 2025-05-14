document.addEventListener('DOMContentLoaded', function() {
    // Initialize 3D flower in hero section
    initHeroFlower();
    
    // Initialize form icons
    initFormIcons();
    
    // Initialize package 3D model
    initPackageModel();
    
    // Initialize delivery map
    initDeliveryMap();
    
    // Initialize impact icons
    initImpactIcons();
    
    // Initialize help icons
    initHelpIcons();
    
    // Form submission handling
    setupTrackingForm();
    
    // Load sample order data (in a real app, this would come from an API)
    loadSampleOrderData();
});

function initHeroFlower() {
    const container = document.getElementById('trackingFlower3d');
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

function initFormIcons() {
    const iconContainers = [
        document.getElementById('orderIdIcon'),
        document.getElementById('emailIcon'),
        document.getElementById('trackIcon')
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
        const icon = createFormIcon(index);
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

function createFormIcon(index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Order ID
            // Document with number
            const docGeometry = new THREE.BoxGeometry(1, 1.2, 0.1);
            const docMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
            const doc = new THREE.Mesh(docGeometry, docMaterial);
            
            const line1 = new THREE.Mesh(
                new THREE.PlaneGeometry(0.8, 0.1),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            line1.position.set(0, 0.3, 0.06);
            
            const line2 = new THREE.Mesh(
                new THREE.PlaneGeometry(0.6, 0.1),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            line2.position.set(0, 0.1, 0.06);
            
            const line3 = new THREE.Mesh(
                new THREE.PlaneGeometry(0.4, 0.1),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            line3.position.set(0, -0.1, 0.06);
            
            icon.add(doc);
            icon.add(line1);
            icon.add(line2);
            icon.add(line3);
            break;
            
        case 1: // Email
            // Envelope
            const envelope = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.7, 0.8),
                new THREE.MeshPhongMaterial({ color: 0xff6b6b })
            );
            
            const flap = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 0.8),
                new THREE.MeshPhongMaterial({ 
                    color: 0xff8c8c,
                    side: THREE.DoubleSide
                })
            );
            flap.position.set(0, 0.35, 0);
            flap.rotation.x = Math.PI / 4;
            
            icon.add(envelope);
            icon.add(flap);
            break;
            
        case 2: // Track button
            // Magnifying glass
            const handle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.05, 0.5, 16),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            handle.rotation.z = Math.PI / 4;
            handle.position.set(0.2, -0.2, 0);
            
            const glass = new THREE.Mesh(
                new THREE.TorusGeometry(0.4, 0.1, 16, 32),
                new THREE.MeshPhongMaterial({ color: 0xffffff })
            );
            glass.rotation.x = Math.PI / 2;
            
            icon.add(handle);
            icon.add(glass);
            break;
    }
    
    // Scale down for the container
    icon.scale.set(0.5, 0.5, 0.5);
    
    return icon;
}

function initPackageModel() {
    const container = document.getElementById('package3d');
    if (!container) return;
    
    // Set up Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9f9);
    
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(2, 2, 3);
    camera.lookAt(0, 0, 0);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Create package
    const packageGroup = createPackage();
    scene.add(packageGroup);
    
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        packageGroup.rotation.y += 0.005;
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

function createPackage() {
    const packageGroup = new THREE.Group();
    
    // Box
    const boxGeometry = new THREE.BoxGeometry(2, 1.5, 2);
    const boxMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x4a8f29,
        emissive: 0x4a8f29,
        emissiveIntensity: 0.1
    });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    packageGroup.add(box);
    
    // Lid
    const lidGeometry = new THREE.BoxGeometry(2.1, 0.2, 2.1);
    const lidMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x3d8b3d,
        emissive: 0x3d8b3d,
        emissiveIntensity: 0.1
    });
    const lid = new THREE.Mesh(lidGeometry, lidMaterial);
    lid.position.y = 0.85;
    packageGroup.add(lid);
    
    // Ribbon
    const ribbonGeometry = new THREE.BoxGeometry(2.2, 0.1, 0.5);
    const ribbonMaterial = new THREE.MeshPhongMaterial({ color: 0xf8c537 });
    const ribbon1 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon1.position.y = 0.75;
    
    const ribbon2 = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
    ribbon2.position.y = 0.75;
    ribbon2.rotation.y = Math.PI / 2;
    
    packageGroup.add(ribbon1);
    packageGroup.add(ribbon2);
    
    // Bow
    const bowCenter = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.3, 0.4),
        new THREE.MeshPhongMaterial({ color: 0xff6b6b })
    );
    bowCenter.position.set(0, 0.9, 0);
    
    const bowLoopGeometry = new THREE.TorusGeometry(0.3, 0.1, 16, 32, Math.PI);
    const bowLoopMaterial = new THREE.MeshPhongMaterial({ color: 0xff6b6b });
    
    const bowLoop1 = new THREE.Mesh(bowLoopGeometry, bowLoopMaterial);
    bowLoop1.rotation.z = Math.PI / 2;
    bowLoop1.position.set(0, 0.9, 0);
    
    const bowLoop2 = new THREE.Mesh(bowLoopGeometry, bowLoopMaterial);
    bowLoop2.rotation.x = Math.PI / 2;
    bowLoop2.position.set(0, 0.9, 0);
    
    packageGroup.add(bowCenter);
    packageGroup.add(bowLoop1);
    packageGroup.add(bowLoop2);
    
    // Bloomify logo
    const logoGeometry = new THREE.PlaneGeometry(1, 0.5);
    const logoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(0, 0, 1.01);
    logo.rotation.y = Math.PI;
    packageGroup.add(logo);
    
    // Floating animation
    gsap.to(packageGroup.position, {
        y: 0.2,
        duration: 2,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut"
    });
    
    return packageGroup;
}

function initDeliveryMap() {
    const container = document.getElementById('deliveryMap3d');
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
    
    // Create map with route
    const map = createDeliveryRouteMap();
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
        map.rotation.y += 0.001;
        
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

function createDeliveryRouteMap() {
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
    
    for (let i = 0; i < 15; i++) {
        const width = 1 + Math.random() * 3;
        const depth = 1 + Math.random() * 3;
        const height = 2 + Math.random() * 8;
        const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshPhongMaterial({ color: color });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        building.position.x = -8 + Math.random() * 16;
        building.position.z = -8 + Math.random() * 16;
        building.position.y = height / 2;
        
        // Don't place buildings on the route
        if ((Math.abs(building.position.x) < 5 && Math.abs(building.position.z) < 1) || 
            (Math.abs(building.position.z) < 5 && Math.abs(building.position.x) < 1)) {
            building.position.x += 6 * (Math.random() > 0.5 ? 1 : -1);
            building.position.z += 6 * (Math.random() > 0.5 ? 1 : -1);
        }
        
        map.add(building);
    }
    
    // Delivery route
    const routePoints = [
        new THREE.Vector3(-8, 0.1, 0),
        new THREE.Vector3(-3, 0.1, 0),
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(0, 0.1, 5),
        new THREE.Vector3(0, 0.1, 8)
    ];
    
    const routeGeometry = new THREE.BufferGeometry().setFromPoints(routePoints);
    const routeMaterial = new THREE.LineBasicMaterial({ 
        color: 0xf8c537,
        linewidth: 3
    });
    const routeLine = new THREE.Line(routeGeometry, routeMaterial);
    map.add(routeLine);
    
    // Delivery truck
    const truck = createDeliveryTruck();
    truck.position.copy(routePoints[2]); // Current position (in transit)
    truck.lookAt(routePoints[3]);
    map.add(truck);
    
    // Animate truck along route
    let progress = 0;
    const totalDistance = 8 + 5 + 3; // Sum of segment lengths
    
    function animateTruck() {
        progress += 0.002;
        if (progress > 1) progress = 0;
        
        const distance = progress * totalDistance;
        let segment, segmentStart, segmentEnd, segmentProgress;
        
        if (distance < 5) { // First segment (-8,0 to -3,0)
            segment = 0;
            segmentStart = routePoints[0];
            segmentEnd = routePoints[1];
            segmentProgress = distance / 5;
        } else if (distance < 8) { // Second segment (-3,0 to 0,0)
            segment = 1;
            segmentStart = routePoints[1];
            segmentEnd = routePoints[2];
            segmentProgress = (distance - 5) / 3;
        } else { // Third segment (0,0 to 0,5)
            segment = 2;
            segmentStart = routePoints[2];
            segmentEnd = routePoints[3];
            segmentProgress = (distance - 8) / 5;
        }
        
        const position = new THREE.Vector3().lerpVectors(
            segmentStart,
            segmentEnd,
            segmentProgress
        );
        
        truck.position.copy(position);
        
        // Make truck face the direction of travel
        if (segment < 2) {
            truck.lookAt(segmentEnd);
        } else {
            truck.lookAt(routePoints[3]);
        }
        
        requestAnimationFrame(animateTruck);
    }
    
    animateTruck();
    
    // Origin marker
    const originMarker = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1, 4),
        new THREE.MeshPhongMaterial({ color: 0xff6b6b })
    );
    originMarker.position.copy(routePoints[0]);
    originMarker.rotation.x = Math.PI;
    map.add(originMarker);
    
    // Destination marker
    const destMarker = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1, 4),
        new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
    );
    destMarker.position.copy(routePoints[4]);
    destMarker.rotation.x = Math.PI;
    map.add(destMarker);
    
    // Bloomify location marker
    const bloomifyMarker = new THREE.Mesh(
        new THREE.ConeGeometry(0.5, 1, 4),
        new THREE.MeshPhongMaterial({ 
            color: 0xf8c537,
            emissive: 0xf8c537,
            emissiveIntensity: 0.3
        })
    );
    bloomifyMarker.position.copy(routePoints[2]);
    bloomifyMarker.rotation.x = Math.PI;
    map.add(bloomifyMarker);
    
    // Add labels
    addMapLabel(map, "Bloomify HQ", routePoints[2], 0xf8c537);
    addMapLabel(map, "Origin", routePoints[0], 0xff6b6b);
    addMapLabel(map, "Your Home", routePoints[4], 0x4a8f29);
    
    return map;
}

function createDeliveryTruck() {
    const truck = new THREE.Group();
    
    // Cab
    const cabGeometry = new THREE.BoxGeometry(1.5, 1, 1);
    const cabMaterial = new THREE.MeshPhongMaterial({ color: 0x4a8f29 });
    const cab = new THREE.Mesh(cabGeometry, cabMaterial);
    cab.position.set(-0.5, 0.5, 0);
    truck.add(cab);
    
    // Trailer
    const trailerGeometry = new THREE.BoxGeometry(2, 1, 1);
    const trailerMaterial = new THREE.MeshPhongMaterial({ color: 0x3d8b3d });
    const trailer = new THREE.Mesh(trailerGeometry, trailerMaterial);
    trailer.position.set(1, 0.5, 0);
    truck.add(trailer);
    
    // Wheels
    const wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16);
    wheelGeometry.rotateZ(Math.PI / 2);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const wheel1 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel1.position.set(-0.8, 0, 0);
    
    const wheel2 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel2.position.set(0.2, 0, 0);
    
    const wheel3 = new THREE.Mesh(wheelGeometry, wheelMaterial);
    wheel3.position.set(1.2, 0, 0);
    
    truck.add(wheel1);
    truck.add(wheel2);
    truck.add(wheel3);
    
    // Bloomify logo on trailer
    const logoGeometry = new THREE.PlaneGeometry(1, 0.5);
    const logoMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });
    const logo = new THREE.Mesh(logoGeometry, logoMaterial);
    logo.position.set(1, 0.5, 0.51);
    logo.rotation.y = Math.PI;
    truck.add(logo);
    
    // Package in trailer
    const packageGeometry = new THREE.BoxGeometry(1, 0.8, 0.8);
    const packageMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xf8c537,
        emissive: 0xf8c537,
        emissiveIntensity: 0.1
    });
    const packageMesh = new THREE.Mesh(packageGeometry, packageMaterial);
    packageMesh.position.set(1, 0.9, 0);
    truck.add(packageMesh);
    
    // Animate wheels
    function animateWheels() {
        wheel1.rotation.x += 0.1;
        wheel2.rotation.x += 0.1;
        wheel3.rotation.x += 0.1;
        requestAnimationFrame(animateWheels);
    }
    
    animateWheels();
    
    return truck;
}

function addMapLabel(group, text, position, color) {
    // In a real app, you'd use a proper text geometry or HTML overlay
    // This is a simplified version using a sprite
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    
    context.fillStyle = `rgba(${parseInt(color.slice(1,3), 16)}, ${parseInt(color.slice(3,5), 16)}, ${parseInt(color.slice(5,7), 16)}, 0.8)`;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#ffffff';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width/2, canvas.height/2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.position.copy(position);
    sprite.position.y += 2;
    sprite.scale.set(2, 1, 1);
    group.add(sprite);
}

function initImpactIcons() {
    const iconContainers = [
        document.getElementById('impact1'),
        document.getElementById('impact2'),
        document.getElementById('impact3')
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
        const icon = createImpactIcon(index);
        scene.add(icon);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (index === 0) { // Only animate the first icon (carbon)
                icon.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createImpactIcon(index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Carbon neutral
            // Earth with leaf
            const earth = new THREE.Mesh(
                new THREE.SphereGeometry(0.8, 32, 32),
                new THREE.MeshPhongMaterial({ 
                    color: 0x4a8f29,
                    emissive: 0x4a8f29,
                    emissiveIntensity: 0.1
                })
            );
            
            const leaf = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 32, 32),
                new THREE.MeshPhongMaterial({ color: 0x3d8b3d })
            );
            leaf.scale.set(1, 0.2, 1);
            leaf.position.set(0.6, 0.6, 0.6);
            
            icon.add(earth);
            icon.add(leaf);
            break;
            
        case 1: // Plastic saved
            // Plastic bottle with cross
            const bottle = new THREE.Mesh(
                new THREE.CylinderGeometry(0.3, 0.2, 0.8, 32),
                new THREE.MeshPhongMaterial({ 
                    color: 0x1e90ff,
                    transparent: true,
                    opacity: 0.7
                })
            );
            
            const cross1 = new THREE.Mesh(
                new THREE.BoxGeometry(0.01, 0.8, 0.2),
                new THREE.MeshPhongMaterial({ color: 0xff6b6b })
            );
            
            const cross2 = new THREE.Mesh(
                new THREE.BoxGeometry(0.2, 0.8, 0.01),
                new THREE.MeshPhongMaterial({ color: 0xff6b6b })
            );
            cross2.rotation.z = Math.PI / 4;
            
            icon.add(bottle);
            icon.add(cross1);
            icon.add(cross2);
            break;
            
        case 2: // Water conserved
            // Water drop
            const dropGeometry = new THREE.SphereGeometry(0.6, 32, 32);
            dropGeometry.scale(1, 1.5, 1);
            const dropMaterial = new THREE.MeshPhongMaterial({ 
                color: 0x1e90ff,
                transparent: true,
                opacity: 0.8
            });
            const drop = new THREE.Mesh(dropGeometry, dropMaterial);
            drop.position.y = -0.2;
            
            const waves = new THREE.Mesh(
                new THREE.TorusGeometry(0.5, 0.1, 16, 32),
                new THREE.MeshPhongMaterial({ 
                    color: 0x1e90ff,
                    transparent: true,
                    opacity: 0.6
                })
            );
            waves.position.y = -0.6;
            
            icon.add(drop);
            icon.add(waves);
            break;
    }
    
    // Scale down for the container
    icon.scale.set(0.7, 0.7, 0.7);
    
    return icon;
}

function initHelpIcons() {
    const iconContainers = [
        document.getElementById('help1'),
        document.getElementById('help2'),
        document.getElementById('help3')
    ];
    
    iconContainers.forEach((container, index) => {
        if (!container) return;
        
        const iconContainer = container.querySelector('.help-icon');
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
        const icon = createHelpIcon(index);
        scene.add(icon);
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        scene.add(ambientLight);
        
        // Animation loop
        function animate() {
            requestAnimationFrame(animate);
            
            if (index === 1) { // Only animate the returns icon
                icon.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
        }
        
        animate();
    });
}

function createHelpIcon(index) {
    const icon = new THREE.Group();
    
    switch(index) {
        case 0: // Order support
            // Headset
            const headband = new THREE.Mesh(
                new THREE.TorusGeometry(0.6, 0.1, 16, 32),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            headband.rotation.x = Math.PI / 2;
            
            const earpiece1 = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0x3d8b3d })
            );
            earpiece1.position.set(-0.6, 0, 0);
            
            const earpiece2 = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0x3d8b3d })
            );
            earpiece2.position.set(0.6, 0, 0);
            
            const mic = new THREE.Mesh(
                new THREE.CylinderGeometry(0.05, 0.1, 0.5, 16),
                new THREE.MeshPhongMaterial({ color: 0x777777 })
            );
            mic.position.set(0, -0.5, 0);
            mic.rotation.x = Math.PI / 2;
            
            icon.add(headband);
            icon.add(earpiece1);
            icon.add(earpiece2);
            icon.add(mic);
            break;
            
        case 1: // Returns
            // Box with arrow
            const box = new THREE.Mesh(
                new THREE.BoxGeometry(1, 0.8, 1),
                new THREE.MeshPhongMaterial({ color: 0xf8c537 })
            );
            
            const arrow = new THREE.Mesh(
                new THREE.ConeGeometry(0.3, 0.6, 4),
                new THREE.MeshPhongMaterial({ color: 0xff6b6b })
            );
            arrow.position.set(0, 0.7, 0);
            arrow.rotation.x = Math.PI;
            
            icon.add(box);
            icon.add(arrow);
            break;
            
        case 2: // FAQs
            // Question mark
            const circle = new THREE.Mesh(
                new THREE.TorusGeometry(0.3, 0.1, 16, 32),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            circle.position.set(0, 0.2, 0);
            
            const stem = new THREE.Mesh(
                new THREE.CylinderGeometry(0.1, 0.1, 0.5, 16),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            stem.position.set(0, -0.3, 0);
            
            const dot = new THREE.Mesh(
                new THREE.SphereGeometry(0.1, 16, 16),
                new THREE.MeshPhongMaterial({ color: 0x4a8f29 })
            );
            dot.position.set(0, -0.6, 0);
            
            icon.add(circle);
            icon.add(stem);
            icon.add(dot);
            break;
    }
    
    // Scale down for the container
    icon.scale.set(0.6, 0.6, 0.6);
    
    return icon;
}

function setupTrackingForm() {
    const trackingForm = document.getElementById('trackingForm');
    if (!trackingForm) return;
    
    trackingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderId = document.getElementById('orderId').value;
        const email = document.getElementById('email').value;
        
        // Validate inputs
        if (!orderId || !email) {
            showFormError('Please fill in all fields');
            return;
        }
        
        // In a real app, you would validate the order ID format and email
        // For this example, we'll just show the tracking results
        
        // Show loading state
        const trackBtn = trackingForm.querySelector('.track-btn');
        trackBtn.disabled = true;
        trackBtn.innerHTML = '<span>Tracking...</span>';
        
        // Simulate API call delay
        setTimeout(() => {
            // Show results section
            document.getElementById('trackingResults').style.display = 'block';
            
            // Scroll to results
            document.getElementById('trackingResults').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // Reset button
            trackBtn.disabled = false;
            trackBtn.innerHTML = '<span>Track Order</span><div class="track-icon" id="trackIcon"></div>';
            
            // Reinitialize the track icon
            initFormIcons();
        }, 1500);
    });
}

function showFormError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error';
    errorElement.textContent = message;
    
    const form = document.getElementById('trackingForm');
    form.insertBefore(errorElement, form.querySelector('button'));
    
    // Remove error after some time
    setTimeout(() => {
        errorElement.remove();
    }, 3000);
}

function loadSampleOrderData() {
    // In a real app, this would come from an API based on the order ID
    // For this example, we'll use sample data
    
    // Order items
    const orderItems = [
        {
            name: 'Eternal Pink Roses Bouquet',
            image: '',
            price: '$45.00',
            quantity: 1
        },
        {
            name: 'Classic Eucalyptus Wreath',
            image: '',
            price: '$28.00',
            quantity: 1
        },
        {
            name: 'Mini Succulent Set',
            image: '',
            price: '$14.00',
            quantity: 1
        }
    ];
    
    const itemsContainer = document.getElementById('orderItems');
    itemsContainer.innerHTML = '';
    
    orderItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        itemElement.innerHTML = `
            <div class="item-image"></div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-meta">Qty: ${item.quantity} | ${item.price}</div>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });
    
    // Set order number
    document.getElementById('orderNumberDisplay').textContent = 'BLM-2023-12345';
    
    // Set order date
    document.getElementById('orderDate').textContent = 'June 15, 2023';
    
    // Set progress (60% in this example)
    document.getElementById('progressFill').style.width = '60%';
}