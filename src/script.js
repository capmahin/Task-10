import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'https://cdn.jsdelivr.net/npm/gsap@3.12.2/+esm';

// Main application for Batman story
class BatmanStoryApp {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.batman = null;
        this.city = null;
        this.directionalLight = null;
        this.ambientLight = null;
        this.criminals = [];
        this.isFighting = false;
        this.fightStartTime = 0;
        this.animationClock = new THREE.Clock();
        
        // Batman Cube properties
        this.batmanCubeScene = null;
        this.batmanCubeCamera = null;
        this.batmanCubeRenderer = null;
        this.batmanCubeControls = null;
        this.batmanCube = null;
        this.batmanLogo = null;
        this.isCubeGlowing = false;
        
        // Animation states for different sections with improved positioning
        this.sectionStates = [
            { // Section 1 - Who We Are (Wide view of Batman in Gotham with animation)
                batmanPosition: { x: 0, y: 0, z: 0 },
                batmanRotation: { x: 0, y: 0, z: 0 },
                cameraPosition: { x: 0, y: 3, z: 8 },
                cameraLookAt: { x: 0, y: 1, z: 0 },
                lightColor: 0xffcc00,
                lightIntensity: 1.3,
                ambientIntensity: 0.7,
                autoRotate: true,
                autoRotateSpeed: 0.8,
                showCriminals: false,
                fighting: false
            },
            { // Section 2 - What We Do (Batman in action, closer view)
                batmanPosition: { x: -1, y: 0.5, z: -1 },
                batmanRotation: { x: 0, y: Math.PI / 6, z: 0 },
                cameraPosition: { x: 2, y: 1.5, z: 3 },
                cameraLookAt: { x: -1, y: 0.5, z: -1 },
                lightColor: 0x0066ff,
                lightIntensity: 1.0,
                ambientIntensity: 0.5,
                autoRotate: false,
                autoRotateSpeed: 0,
                showCriminals: true,
                fighting: false
            },
            { // Section 3 - Our Services (Batman from below, looking up)
                batmanPosition: { x: 1, y: -0.5, z: 1 },
                batmanRotation: { x: -Math.PI / 8, y: -Math.PI / 4, z: 0 },
                cameraPosition: { x: -2, y: -1, z: 4 },
                cameraLookAt: { x: 1, y: -0.5, z: 1 },
                lightColor: 0x9900ff,
                lightIntensity: 1.4,
                ambientIntensity: 0.7,
                autoRotate: true,
                autoRotateSpeed: 0.3,
                showCriminals: true,
                fighting: false
            },
            { // Section 4 - Join The Mission (Front view, face to face with fight)
                batmanPosition: { x: 0, y: 0, z: 0 },
                batmanRotation: { x: 0, y: Math.PI, z: 0 },
                cameraPosition: { x: 0, y: 1, z: 5 },
                cameraLookAt: { x: 0, y: 0, z: 0 },
                lightColor: 0xffcc00,
                lightIntensity: 1.5,
                ambientIntensity: 0.8,
                autoRotate: false,
                autoRotateSpeed: 0,
                showCriminals: true,
                fighting: true
            }
        ];
        
        this.currentSection = 0;
        this.sections = [];
        
        this.init();
    }

    init() {
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 10, 20);
        
        // Setup camera
        this.setupCamera();
        
        // Setup renderer
        this.setupRenderer();
        
        // Setup orbit controls
        this.setupOrbitControls();
        
        // Setup lighting
        this.setupLighting();
        
        // Create Batman symbol
        this.createBatmanSymbol();
        
        // Create city skyline
        this.createCitySkyline();
        
        // Create criminals
        this.createCriminals();
        
        // Create Batman cube
        this.createBatmanCube();
        
        // Get sections
        this.sections = document.querySelectorAll('.section');
        
        // Event listeners
        this.setupEventListeners();
        
        // Initial state
        this.updateSceneForSection(0);
        
        // Start animation loop
        this.animate();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 3, 8);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.getElementById('batman-scene').appendChild(this.renderer.domElement);
    }

    setupOrbitControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 20;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.8;
        this.controls.enablePan = true;
        this.controls.enableZoom = true;
    }

    setupLighting() {
        // Ambient light
        this.ambientLight = new THREE.AmbientLight(0x404040, 0.7);
        this.scene.add(this.ambientLight);
        
        // Directional light
        this.directionalLight = new THREE.DirectionalLight(0xffcc00, 1.3);
        this.directionalLight.position.set(5, 10, 7);
        this.directionalLight.castShadow = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        this.directionalLight.shadow.camera.near = 0.5;
        this.directionalLight.shadow.camera.far = 50;
        this.directionalLight.shadow.camera.left = -10;
        this.directionalLight.shadow.camera.right = 10;
        this.directionalLight.shadow.camera.top = 10;
        this.directionalLight.shadow.camera.bottom = -10;
        this.scene.add(this.directionalLight);
        
        // Additional fill light
        const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
        fillLight.position.set(-5, 3, -5);
        this.scene.add(fillLight);
        
        // Gotham city ambient light
        const gothamLight = new THREE.HemisphereLight(0xffcc00, 0x000000, 0.2);
        this.scene.add(gothamLight);
    }

    createBatmanSymbol() {
        const batGroup = new THREE.Group();
        
        // Main body (ellipse)
        const bodyGeometry = new THREE.SphereGeometry(1, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
        const bodyMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: 0x111111
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.scale.set(1, 0.5, 0.2);
        body.castShadow = true;
        body.receiveShadow = true;
        batGroup.add(body);
        
        // Wings
        const wingGeometry = new THREE.ConeGeometry(0.5, 2, 4);
        const wingMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: 0x111111
        });
        
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-1.2, 0.5, 0);
        leftWing.rotation.z = Math.PI / 4;
        leftWing.castShadow = true;
        leftWing.receiveShadow = true;
        batGroup.add(leftWing);
        
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(1.2, 0.5, 0);
        rightWing.rotation.z = -Math.PI / 4;
        rightWing.castShadow = true;
        rightWing.receiveShadow = true;
        batGroup.add(rightWing);
        
        // Ears
        const earGeometry = new THREE.CylinderGeometry(0.05, 0.1, 0.8, 8);
        const earMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: 0x111111
        });
        
        const leftEar = new THREE.Mesh(earGeometry, earMaterial);
        leftEar.position.set(-0.3, 1.2, 0);
        leftEar.rotation.z = Math.PI / 8;
        leftEar.castShadow = true;
        leftEar.receiveShadow = true;
        batGroup.add(leftEar);
        
        const rightEar = new THREE.Mesh(earGeometry, earMaterial);
        rightEar.position.set(0.3, 1.2, 0);
        rightEar.rotation.z = -Math.PI / 8;
        rightEar.castShadow = true;
        rightEar.receiveShadow = true;
        batGroup.add(rightEar);
        
        // Batman symbol on chest
        const symbolGeometry = new THREE.Shape();
        symbolGeometry.moveTo(0, 0);
        symbolGeometry.lineTo(0.3, 0.5);
        symbolGeometry.lineTo(0.1, 0.4);
        symbolGeometry.lineTo(0, 0.6);
        symbolGeometry.lineTo(-0.1, 0.4);
        symbolGeometry.lineTo(-0.3, 0.5);
        symbolGeometry.lineTo(0, 0);
        
        const symbolExtrudeSettings = {
            depth: 0.1,
            bevelEnabled: false
        };
        
        const symbolGeometry3D = new THREE.ExtrudeGeometry(symbolGeometry, symbolExtrudeSettings);
        const symbolMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffcc00, 
            metalness: 0.8, 
            roughness: 0.2 
        });
        
        const symbol = new THREE.Mesh(symbolGeometry3D, symbolMaterial);
        symbol.position.set(-0.2, 0.1, 0.11);
        symbol.scale.set(1.5, 1.5, 1.5);
        batGroup.add(symbol);
        
        // Cape
        const capeShape = new THREE.Shape();
        capeShape.moveTo(0, 0);
        capeShape.lineTo(-1.5, -2);
        capeShape.lineTo(0, -1.5);
        capeShape.lineTo(1.5, -2);
        capeShape.lineTo(0, 0);
        
        const capeExtrudeSettings = {
            depth: 0.1,
            bevelEnabled: false
        };
        
        const capeGeometry = new THREE.ExtrudeGeometry(capeShape, capeExtrudeSettings);
        const capeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000, 
            metalness: 0.7, 
            roughness: 0.3,
            side: THREE.DoubleSide
        });
        
        const cape = new THREE.Mesh(capeGeometry, capeMaterial);
        cape.position.set(0, -0.5, -0.1);
        cape.rotation.x = Math.PI / 2;
        batGroup.add(cape);
        
        this.batman = batGroup;
        this.scene.add(this.batman);
    }

    createCitySkyline() {
        this.city = new THREE.Group();
        
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x111111,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -2;
        ground.receiveShadow = true;
        this.city.add(ground);
        
        // Create multiple buildings of varying heights
        for (let i = 0; i < 30; i++) {
            const height = Math.random() * 5 + 1;
            const width = Math.random() * 1 + 0.5;
            const depth = Math.random() * 1 + 0.5;
            
            // Create building with multiple sections for more interesting shapes
            const building = new THREE.Group();
            
            // Main building section
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x222222, 
                metalness: 0.1, 
                roughness: 0.8 
            });
            
            const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingMesh.position.y = height / 2 - 2;
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            building.add(buildingMesh);
            
            // Add windows
            const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x336699 });
            for (let j = 0; j < Math.floor(height); j++) {
                for (let k = 0; k < 4; k++) {
                    if (Math.random() > 0.3) {
                        const windowGeometry = new THREE.PlaneGeometry(0.1, 0.15);
                        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                        
                        const side = Math.floor(k / 2);
                        const dir = (k % 2 === 0) ? 1 : -1;
                        
                        if (side === 0) {
                            windowMesh.position.set(dir * width/2 * 0.9, j - 1, 0);
                            windowMesh.rotation.y = Math.PI/2 * (dir > 0 ? 0 : 2);
                        } else {
                            windowMesh.position.set(0, j - 1, dir * depth/2 * 0.9);
                            windowMesh.rotation.y = Math.PI/2 * (dir > 0 ? 1 : 3);
                        }
                        
                        building.add(windowMesh);
                    }
                }
            }
            
            building.position.set(
                (Math.random() - 0.5) * 8,
                0,
                (Math.random() - 0.5) * 8 - 3
            );
            
            this.city.add(building);
        }
        
        // Add some taller landmark buildings
        for (let i = 0; i < 3; i++) {
            const height = Math.random() * 10 + 5;
            const width = Math.random() * 2 + 1;
            const depth = Math.random() * 2 + 1;
            
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333, 
                metalness: 0.2, 
                roughness: 0.7 
            });
            
            const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
            building.position.set(
                (Math.random() - 0.5) * 40,
                height / 2 - 2,
                (Math.random() - 0.5) * 40 - 15
            );
            building.castShadow = true;
            building.receiveShadow = true;
            
            this.city.add(building);
        }
        
        this.scene.add(this.city);
    }

    createCriminals() {
        // Create several criminals for Batman to fight
        for (let i = 0; i < 5; i++) {
            const criminal = new THREE.Group();
            
            // Criminal body
            const bodyGeometry = new THREE.CapsuleGeometry(0.3, 0.8, 4, 8);
            const bodyMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x553333,
                roughness: 0.7,
                metalness: 0.1
            });
            const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
            body.castShadow = true;
            body.receiveShadow = true;
            criminal.add(body);
            
            // Criminal head
            const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
            const headMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x886666,
                roughness: 0.7,
                metalness: 0.1
            });
            const head = new THREE.Mesh(headGeometry, headMaterial);
            head.position.y = 0.8;
            head.castShadow = true;
            head.receiveShadow = true;
            criminal.add(head);
            
            // Criminal hat/hood
            const hatGeometry = new THREE.ConeGeometry(0.35, 0.4, 8);
            const hatMaterial = new THREE.MeshStandardMaterial({ 
                color: 0x333333,
                roughness: 0.8,
                metalness: 0.1
            });
            const hat = new THREE.Mesh(hatGeometry, hatMaterial);
            hat.position.y = 1.0;
            hat.rotation.x = Math.PI;
            hat.castShadow = true;
            hat.receiveShadow = true;
            criminal.add(hat);
            
            // Position criminals around the scene
            criminal.position.set(
                (Math.random() - 0.5) * 8,
                -1.5,
                (Math.random() - 0.5) * 8 - 3
            );
            
            // Store reference for animation
            criminal.userData = {
                originalPosition: criminal.position.clone(),
                speed: Math.random() * 0.02 + 0.01,
                phase: Math.random() * Math.PI * 2
            };
            
            this.criminals.push(criminal);
            this.scene.add(criminal);
        }
    }

    createBatmanCube() {
        // Create a separate scene for the Batman cube
        this.batmanCubeScene = new THREE.Scene();
        this.batmanCubeScene.background = new THREE.Color(0x000000);
        
        // Create camera for the cube
        this.batmanCubeCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        this.batmanCubeCamera.position.set(0, 0, 5);
        
        // Create renderer for the cube
        const canvasContainer = document.getElementById('batman-cube-canvas');
        this.batmanCubeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.batmanCubeRenderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
        this.batmanCubeRenderer.setClearColor(0x000000, 0);
        canvasContainer.appendChild(this.batmanCubeRenderer.domElement);
        
        // Create orbit controls for the cube
        this.batmanCubeControls = new OrbitControls(this.batmanCubeCamera, this.batmanCubeRenderer.domElement);
        this.batmanCubeControls.enableDamping = true;
        this.batmanCubeControls.dampingFactor = 0.05;
        this.batmanCubeControls.enableZoom = true;
        this.batmanCubeControls.enablePan = false;
        
        // Create lighting for the cube scene
        const cubeAmbientLight = new THREE.AmbientLight(0x404040, 1);
        this.batmanCubeScene.add(cubeAmbientLight);
        
        const cubeDirectionalLight = new THREE.DirectionalLight(0xffcc00, 1);
        cubeDirectionalLight.position.set(5, 5, 5);
        this.batmanCubeScene.add(cubeDirectionalLight);
        
        // Create the cube with Batman theme
        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x000000,
            metalness: 0.7,
            roughness: 0.3,
            emissive: new THREE.Color(0x000000)
        });
        
        this.batmanCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        this.batmanCubeScene.add(this.batmanCube);
        
        // Create Batman logo on the front face of the cube
        const logoShape = new THREE.Shape();
        // Draw the Batman logo
        logoShape.moveTo(0, 0);
        logoShape.lineTo(0.3, 0.5);
        logoShape.lineTo(0.1, 0.4);
        logoShape.lineTo(0, 0.6);
        logoShape.lineTo(-0.1, 0.4);
        logoShape.lineTo(-0.3, 0.5);
        logoShape.lineTo(0, 0);
        
        const logoGeometry = new THREE.ShapeGeometry(logoShape);
        const logoMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffcc00,
            side: THREE.DoubleSide
        });
        
        this.batmanLogo = new THREE.Mesh(logoGeometry, logoMaterial);
        this.batmanLogo.position.set(0, 0, 1.01); // Slightly in front of the cube
        this.batmanLogo.scale.set(2, 2, 2);
        this.batmanCube.add(this.batmanLogo);
        
        // Render the cube scene
        this.batmanCubeRenderer.render(this.batmanCubeScene, this.batmanCubeCamera);
    }

    setupEventListeners() {
        // Window resize event
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Scroll event listener
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            
            scrollTimeout = setTimeout(() => {
                const scrollPosition = window.scrollY;
                const windowHeight = window.innerHeight;
                
                // Calculate current section based on scroll position
                const newSection = Math.min(
                    Math.floor(scrollPosition / windowHeight),
                    this.sections.length - 1
                );
                
                if (newSection !== this.currentSection) {
                    this.currentSection = newSection;
                    this.updateSceneForSection(this.currentSection);
                }
            }, 100);
        });
        
        // Signal for help button event
        const signalButton = document.getElementById('signal-button');
        if (signalButton) {
            signalButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.activateBatSignal();
            });
        }
        
        // Transform button event for Batman cube
        const transformButton = document.getElementById('transform-button');
        if (transformButton) {
            transformButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleCubeGlow();
            });
        }
    }

    updateSceneForSection(sectionIndex) {
        const state = this.sectionStates[sectionIndex];
        
        // Update batman position and rotation
        this.batman.position.set(
            state.batmanPosition.x,
            state.batmanPosition.y,
            state.batmanPosition.z
        );
        
        this.batman.rotation.set(
            state.batmanRotation.x,
            state.batmanRotation.y,
            state.batmanRotation.z
        );
        
        // Update camera position
        this.camera.position.set(
            state.cameraPosition.x,
            state.cameraPosition.y,
            state.cameraPosition.z
        );
        
        // Update camera lookAt
        this.controls.target.set(
            state.cameraLookAt.x,
            state.cameraLookAt.y,
            state.cameraLookAt.z
        );
        
        // Update lighting
        this.directionalLight.color.set(state.lightColor);
        this.directionalLight.intensity = state.lightIntensity;
        this.ambientLight.intensity = state.ambientIntensity;
        
        // Update controls
        this.controls.autoRotate = state.autoRotate;
        this.controls.autoRotateSpeed = state.autoRotateSpeed;
        
        // Show/hide criminals based on section
        this.criminals.forEach(criminal => {
            criminal.visible = state.showCriminals;
        });
        
        // Set fighting state
        this.isFighting = state.fighting;
        if (this.isFighting) {
            this.fightStartTime = Date.now();
        }
        
        // Update section visibility
        this.sections.forEach((section, index) => {
            if (index === sectionIndex) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }

    toggleCubeGlow() {
        const transformButton = document.getElementById('transform-button');
        
        if (!this.isCubeGlowing) {
            // Add glow effect to the cube
            gsap.to(this.batmanCube.material.emissive, {
                duration: 0.5,
                r: 1.0,
                g: 0.8,
                b: 0.0,
                ease: "power2.out"
            });
            
            // Add glow to the logo
            gsap.to(this.batmanLogo.material.color, {
                duration: 0.5,
                r: 1.0,
                g: 1.0,
                b: 0.0,
                ease: "power2.out"
            });
            
            // Add pulsing effect
            gsap.to(this.batmanCube.scale, {
                duration: 0.5,
                x: 1.1,
                y: 1.1,
                z: 1.1,
                yoyo: true,
                repeat: -1,
                ease: "sine.inOut"
            });
            
            // Change button text
            transformButton.textContent = 'Hide Glow';
            
            this.isCubeGlowing = true;
        } else {
            // Remove glow effect from the cube
            gsap.to(this.batmanCube.material.emissive, {
                duration: 0.5,
                r: 0.0,
                g: 0.0,
                b: 0.0,
                ease: "power2.out"
            });
            
            // Remove glow from the logo
            gsap.to(this.batmanLogo.material.color, {
                duration: 0.5,
                r: 1.0,
                g: 0.8,
                b: 0.0,
                ease: "power2.out"
            });
            
            // Stop pulsing effect
            gsap.killTweensOf(this.batmanCube.scale);
            gsap.to(this.batmanCube.scale, {
                duration: 0.5,
                x: 1,
                y: 1,
                z: 1,
                ease: "power2.out"
            });
            
            // Change button text
            transformButton.textContent = 'Glow Cube';
            
            this.isCubeGlowing = false;
        }
    }

    activateBatSignal() {
        // Get the bat signal element
        const batSignal = document.getElementById('bat-signal');
        
        if (batSignal) {
            // Add glow class to activate the effect
            batSignal.classList.add('glow');
            
            // Remove glow after 5 seconds
            setTimeout(() => {
                batSignal.classList.remove('glow');
            }, 5000);
        }
        
        // Make Batman jump into action
        this.jumpToAction();
    }

    jumpToAction() {
        // Animate Batman to a more dynamic position
        const targetPosition = new THREE.Vector3(0, 0, 0);
        const targetRotation = new THREE.Euler(0, Math.PI, 0);
        
        // Animate over 1 second
        const startTime = Date.now();
        const duration = 1000;
        
        const startPosition = this.batman.position.clone();
        const startRotation = this.batman.rotation.clone();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease in-out function
            const ease = progress < 0.5 
                ? 4 * progress * progress * progress 
                : (progress - 1) * (2 * progress - 2) * (2 * progress - 2) + 1;
            
            // Interpolate position
            this.batman.position.lerpVectors(startPosition, targetPosition, ease);
            
            // Interpolate rotation
            this.batman.rotation.x = startRotation.x + (targetRotation.x - startRotation.x) * ease;
            this.batman.rotation.y = startRotation.y + (targetRotation.y - startRotation.y) * ease;
            this.batman.rotation.z = startRotation.z + (targetRotation.z - startRotation.z) * ease;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        animate();
        
        // Switch to fight scene
        this.updateSceneForSection(3);
    }

    onWindowResize() {
        this.camera.aspect = (window.innerWidth / 2) / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth / 2, window.innerHeight);
        
        // Resize cube renderer
        const canvasContainer = document.getElementById('batman-cube-canvas');
        if (canvasContainer) {
            this.batmanCubeRenderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
            this.batmanCubeCamera.aspect = canvasContainer.clientWidth / canvasContainer.clientHeight;
            this.batmanCubeCamera.updateProjectionMatrix();
        }
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const delta = this.animationClock.getDelta();
        const time = this.animationClock.getElapsedTime();
        
        // Update main scene controls
        if (this.controls) {
            this.controls.update();
        }
        
        // Update cube scene controls
        if (this.batmanCubeControls) {
            this.batmanCubeControls.update();
        }
        
        // Animate Batman with more dynamic movements
        if (this.batman) {
            // Floating animation
            this.batman.position.y += Math.sin(time * 2) * 0.01;
            
            // Slight rotation for dynamic effect
            this.batman.rotation.y = Math.sin(time * 0.5) * 0.1;
            
            // Animate cape
            const cape = this.batman.children.find(child => child.geometry && child.geometry.type === 'ExtrudeGeometry');
            if (cape) {
                cape.rotation.z = Math.sin(time * 3) * 0.1;
            }
        }
        
        // Animate criminals
        this.criminals.forEach((criminal, index) => {
            if (criminal.visible) {
                // Move criminals in circles
                const userData = criminal.userData;
                criminal.position.x = userData.originalPosition.x + Math.sin(time * userData.speed + userData.phase) * 2;
                criminal.position.z = userData.originalPosition.z + Math.cos(time * userData.speed + userData.phase) * 2;
                
                // Rotate criminals
                criminal.rotation.y = time * userData.speed * 2;
                
                // If in fighting scene, make criminals more animated
                if (this.isFighting) {
                    criminal.position.y = userData.originalPosition.y + Math.sin(time * 3 + userData.phase) * 0.2;
                    
                    // Make criminals try to avoid Batman
                    const direction = new THREE.Vector3();
                    direction.subVectors(this.batman.position, criminal.position).normalize();
                    criminal.position.x -= direction.x * 0.01;
                    criminal.position.z -= direction.z * 0.01;
                }
            }
        });
        
        // Fighting animation
        if (this.isFighting) {
            const fightTime = (Date.now() - this.fightStartTime) * 0.001;
            
            // Make Batman punch
            this.batman.rotation.z = Math.sin(fightTime * 10) * 0.3;
            
            // Make camera shake slightly
            this.camera.position.x += Math.sin(fightTime * 15) * 0.02;
            this.camera.position.y += Math.cos(fightTime * 12) * 0.02;
            
            // Make directional light pulse
            this.directionalLight.intensity = 1.5 + Math.sin(fightTime * 5) * 0.3;
        }
        
        // Render main scene
        this.renderer.render(this.scene, this.camera);
        
        // Render cube scene
        if (this.batmanCubeRenderer && this.batmanCubeScene && this.batmanCubeCamera) {
            this.batmanCubeRenderer.render(this.batmanCubeScene, this.batmanCubeCamera);
        }
    }
}

// Initialize the application when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new BatmanStoryApp();
});