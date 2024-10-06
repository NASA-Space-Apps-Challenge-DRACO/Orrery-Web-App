// Import necessary modules
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/FBXLoader.js";

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load("./image/Material.002_diffuse.jpeg");

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

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 15);

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add light sources
const sunLight = new THREE.PointLight(0xffffff, 1, 100);
sunLight.position.set(10, 10, 10);
scene.add(sunLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
scene.add(ambientLight);

// Array to hold satellite information
const satellites = [];

// Function to create satellites from FBX models
function createSatellite(modelPath, lat, lon, name, details, color) {
  const radius = 6.5; // Radius for distance from Earth (5 + 1.5)

  const loader = new FBXLoader();
  loader.load(modelPath, (fbx) => {
    const position = latLonToVector3(lat, lon, radius);
    fbx.position.copy(position);
    fbx.scale.set(0.1, 0.1, 0.1); // Scale down the model if needed
    scene.add(fbx);

    // Create and position text label above the satellite
    const label = createTextLabel(name);
    label.position.set(fbx.position.x, fbx.position.y + 1.5, fbx.position.z); // Position slightly above
    scene.add(label);

    // Set userData for click events
    fbx.userData = { name: name, details: details };

    // Create a small sphere for the satellite
    const satelliteSphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const satelliteMaterial = new THREE.MeshBasicMaterial({ color: color });
    const satelliteSphere = new THREE.Mesh(satelliteSphereGeometry, satelliteMaterial);
    satelliteSphere.position.copy(fbx.position);
    scene.add(satelliteSphere);

    // Set slower random speed for the satellite
    const speed = Math.random() * 0.005 + 0.0025; // Adjusted speed between 0.0025 and 0.005
    const initialAngle = Math.random() * Math.PI * 2; // Random angle between 0 and 2PI

    // Store satellite, sphere, label, speed, and angle data
    satellites.push({
      mesh: fbx,
      sphere: satelliteSphere,
      label: label,
      radius: radius,
      orbitAngle: initialAngle, // Set the initial angle
      speed: speed, // Store the slower random speed
      color: color,
    });
  });
}

// Function to create text labels with better visibility
function createTextLabel(name) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas size and styling for the text
  canvas.width = 300;
  canvas.height = 150;

  // Background rectangle for text visibility
  context.fillStyle = "rgba(0, 0, 0, 0.7)"; // Black background with slight transparency
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Set text properties
  context.font = "Bold 30px Arial"; // Larger font size for visibility
  context.fillStyle = "red"; // Bright red text for visibility
  context.textAlign = "center";
  context.textBaseline = "middle";

  // Add outline/stroke for text
  context.strokeStyle = "white"; // White outline around the text
  context.lineWidth = 8;
  context.strokeText(name, canvas.width / 2, canvas.height / 2);
  context.fillText(name, canvas.width / 2, canvas.height / 2); // Draw filled text

  // Create texture from the canvas and use it in a sprite
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(spriteMaterial);

  // Scale the sprite size down (adjust as needed)
  sprite.scale.set(2, 1, 1);

  return sprite;
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

// Show satellite details in modal
function showSatelliteDetails(data) {
  const modal = document.getElementById("satelliteModal");
  const modalContent = document.getElementById("modalContent");
  modalContent.innerHTML = `<h2>${data.name}</h2><p>${data.details}</p><button id="closeModal">Close</button>`;
  modal.style.display = "flex"; // Use flex for centering

  // Close modal on click
  const closeModalButton = document.getElementById("closeModal");
  closeModalButton.onclick = hideModal; // Close the modal when clicked
}

// Hide modal
function hideModal() {
  const modal = document.getElementById("satelliteModal");
  modal.style.display = "none";
}

// Real-time synchronization for Earth rotation
function realTimeRotation() {
  const now = new Date();
  const seconds = now.getUTCSeconds();
  const rotationSpeed = 360 / 60; // Earth rotation speed
  earth.rotation.y += rotationSpeed * (seconds / 240) * 0.01; // Speed of Earth's rotation
}

// Animate function (satellites now move around the Earth)
function animate() {
  realTimeRotation(); // Earth rotates

  satellites.forEach((satellite) => {
    // Update the satellite's orbit angle for circular motion based on its speed
    satellite.orbitAngle += satellite.speed; // Use the satellite's speed for motion
    const radius = satellite.radius + 1.5; // Added distance from Earth
    const x = radius * Math.cos(satellite.orbitAngle);
    const z = radius * Math.sin(satellite.orbitAngle);

    // Update satellite position
    satellite.mesh.position.set(x, satellite.mesh.position.y, z); // Maintain y position
    satellite.sphere.position.set(x, satellite.mesh.position.y, z); // Move the sphere with the satellite
    satellite.label.position.set(x, satellite.mesh.position.y + 1.5, z); // Move label
  });

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
createSatellite("./image/satellite_fbx.fbx", 51.4779, -0.0014, "International Space Station", "The ISS is a habitable artificial satellite.", 0xff0000);
createSatellite("./image/satellite_fbx.fbx", 28.5, -80.5, "Hubble Space Telescope", "Observes astronomical objects and phenomena.", 0x00ff00);
createSatellite("./image/satellite_fbx.fbx", 10.0, 77.0, "GOES-16", "Provides real-time weather data.", 0x0000ff);
createSatellite("./image/satellite_fbx.fbx", 55.0, 12.0, "Navstar GPS", "Global positioning satellite.", 0xffff00);
createSatellite("./image/satellite_fbx.fbx", -33.0, 151.0, "Iridium NEXT", "Satellite communication service.", 0xff00ff);
