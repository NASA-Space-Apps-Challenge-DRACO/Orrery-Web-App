// Import necessary modules
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader.js";

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const button = document.getElementById("transparentButton");

// Add click event listener to the button
button.addEventListener("click", function() {
    // Redirect to pho.html
    window.location.href = "pho.html"; // Change to the path of your HTML file if necessary
});

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load Earth texture
const earthTexture = textureLoader.load("./image/Material.002_diffuse.jpeg");

// Load Moon texture
const moonTexture = textureLoader.load("./image/Material.001_baseColor.jpeg");

// Create scene
const scene = new THREE.Scene();

// Set background to stars
const starTexture = textureLoader.load("./image/stars.jpg");
const starGeometry = new THREE.SphereGeometry(100, 64, 64);
const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
    side: THREE.BackSide,
});
const stars = new THREE.Mesh(starGeometry, starMaterial);
scene.add(stars);

// Create Earth
const earthGeometry = new THREE.SphereGeometry(5, 50, 50);
const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Create Moon with texture
const moonGeometry = new THREE.SphereGeometry(1.35, 32, 32); // Adjust the size of the Moon
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
const moonDistance = 10;
moon.position.set(moonDistance, 0, 0); // Initial position
scene.add(moon);

// Moon details
const moonDetails = `
    <strong>The Moon</strong><br>
    Diameter: 3,474.8 km<br>
    Distance from Earth: Approximately 384,400 km<br>
    Orbital Period: About 27.3 days<br>
    Surface Gravity: 1.62 m/s² (about 1/6th that of Earth)<br>
    Atmosphere: Very thin, almost negligible<br>
    Interesting Fact: The Moon has been a target for human exploration and is the only celestial body beyond Earth that humans have set foot on.
`;

// Create camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 0, 20);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add light sources
const sunLight = new THREE.PointLight(0xffffff, 1.5, 100);
sunLight.position.set(10, 10, 10);
scene.add(sunLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

// Moon revolution parameters
const moonOrbitSpeed = 0.001;
let moonAngle = 0;

// Moon rotation parameters
const moonRotationSpeed = 0.0005;

// Array to hold satellite information
const satellites = [];

// Satellite details
const satelliteDetails = {
    "International Space Station": `
        <strong>International Space Station</strong><br>
        Diameter: 108.5 m<br>
        Altitude: 408 km<br>
        Orbital Period: 90 minutes<br>
        Speed: 28,000 km/h<br>
        Interesting Fact: It is a joint project of NASA, Roscosmos, JAXA, ESA, and CSA.
    `,
    "Hubble Space Telescope": `
        <strong>Hubble Space Telescope</strong><br>
        Diameter: 4.2 m<br>
        Altitude: 547 km<br>
        Orbital Period: 95 minutes<br>
        Speed: 27,300 km/h<br>
        Interesting Fact: Hubble has provided some of the most detailed images of distant galaxies.
    `,
    "GOES-16": `
        <strong>GOES-16</strong><br>
        Diameter: 3.0 m<br>
        Altitude: 35,786 km<br>
        Orbital Period: Synchronous with Earth<br>
        Interesting Fact: Provides real-time data for weather forecasting and monitoring.
    `,
    "Navstar GPS": `
        <strong>Navstar GPS</strong><br>
        Diameter: 1.6 m<br>
        Altitude: 20,200 km<br>
        Orbital Period: 12 hours<br>
        Interesting Fact: It is part of the Global Positioning System used for navigation.
    `,
    "Iridium NEXT": `
        <strong>Iridium NEXT</strong><br>
        Diameter: 1.4 m<br>
        Altitude: 780 km<br>
        Orbital Period: 100 minutes<br>
        Interesting Fact: Provides satellite phone services across the globe.
    `
};

// Function to create satellites from FBX models
function createSatellite(modelPath, lat, lon, name, color) {
    const radius = 6.5; // Radius for distance from Earth (5 + 1.5)

    const loader = new FBXLoader();
    loader.load(modelPath, (fbx) => {
        const position = latLonToVector3(lat, lon, radius);
        fbx.position.copy(position);
        fbx.scale.set(0.1, 0.1, 0.1); // Scale down the model
        scene.add(fbx);

        // Create a small sphere for the satellite
        const satelliteSphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
        const satelliteMaterial = new THREE.MeshBasicMaterial({ color: color });
        const satelliteSphere = new THREE.Mesh(satelliteSphereGeometry, satelliteMaterial);
        satelliteSphere.position.copy(fbx.position);
        scene.add(satelliteSphere);

        // Set random speed for the satellite
        const speed = Math.random() * 0.0005 + 0.00025;
        const initialAngle = Math.random() * Math.PI * 2;

        satellites.push({
            mesh: fbx,
            sphere: satelliteSphere,
            radius: radius,
            orbitAngle: initialAngle,
            speed: speed,
            name: name, // Store satellite name for detail retrieval
            color: color,
        });
    });
}

// Function to convert latitude/longitude to Vector3
function latLonToVector3(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return new THREE.Vector3(x, y, z);
}

// Real-time synchronization for Earth's rotation
function realTimeRotation() {
    const earthRotationSpeed = 0.0002; // Earth rotation speed
    earth.rotation.y += earthRotationSpeed;

    // Moon revolution around Earth
    moonAngle += moonOrbitSpeed;
    moon.position.x = Math.cos(moonAngle) * moonDistance;
    moon.position.z = Math.sin(moonAngle) * moonDistance;

    // Moon's rotation around its own axis
    moon.rotation.y += moonRotationSpeed;

    // Satellite movement around Earth
    satellites.forEach((satellite) => {
        satellite.orbitAngle += satellite.speed;

        const x = satellite.radius * Math.cos(satellite.orbitAngle);
        const z = satellite.radius * Math.sin(satellite.orbitAngle);

        satellite.mesh.position.set(x, satellite.mesh.position.y, z);
        satellite.sphere.position.set(x, satellite.mesh.position.y, z);
    });
}

// Animate function
function animate() {
    realTimeRotation();
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

// Resize camera view
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start animation
animate();

// Initialize satellites with FBX models and colors for trajectories
createSatellite("./image/satellite_fbx.fbx", 51.4779, -0.0014, "International Space Station", 0xff0000);
createSatellite("./image/satellite_fbx.fbx", 28.5, -80.5, "Hubble Space Telescope", 0x00ff00);
createSatellite("./image/satellite_fbx.fbx", 10.0, 77.0, "GOES-16", 0x0000ff);
createSatellite("./image/satellite_fbx.fbx", 55.0, 12.0, "Navstar GPS", 0xffff00);
createSatellite("./image/satellite_fbx.fbx", -33.0, 151.0, "Iridium NEXT", 0xff00ff);

// Raycaster for mouse hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const tooltip = document.createElement("div");
tooltip.style.position = "absolute";
tooltip.style.color = "white";
tooltip.style.background = "rgba(0, 0, 0, 0.7)";
tooltip.style.padding = "10px";
tooltip.style.borderRadius = "5px";
tooltip.style.pointerEvents = "none"; // Prevent tooltip from interfering with mouse events
document.body.appendChild(tooltip);

// Update mouse movement handling to show satellite and moon details
window.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Check for intersection with satellites and moon
    const intersects = raycaster.intersectObjects(
        satellites.map(s => s.mesh).concat(moon), // Include moon in the check
        true
    );

    if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;

        // Check if the intersected object is the moon
        if (intersectedObject === moon) {
            tooltip.style.display = "block";
            tooltip.innerHTML = moonDetails; // Show detailed moon information
        } else {
            // Find the satellite in the satellites array
            const intersectedSatellite = satellites.find(s => s.mesh === intersectedObject);
            if (intersectedSatellite) {
                tooltip.style.display = "block";
                tooltip.innerHTML = satelliteDetails[intersectedSatellite.name] || `Details not available for ${intersectedSatellite.name}`; // Show satellite details
            }
        }

        tooltip.style.left = event.clientX + "px";
        tooltip.style.top = event.clientY + "px";
    } else {
        tooltip.style.display = "none"; // Hide tooltip if not hovering over any object
    }
});
