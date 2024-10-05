// Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

// Create renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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
const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture }); // Moon texture applied
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

// Moon's position (distance from Earth)
const moonDistance = 10;
moon.position.set(moonDistance, 0, 0); // Initial position
scene.add(moon);

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 20); // Increased distance to see Earth + Moon

// Add orbit controls
const controls = new OrbitControls(camera, renderer.domElement);

// Add light sources
const sunLight = new THREE.PointLight(0xffffff, 1.5, 100); // Increased intensity for better illumination
sunLight.position.set(10, 10, 10);
scene.add(sunLight);

// Add ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0x404040, 1); // Increased intensity
scene.add(ambientLight);

// Optional: Add a directional light for more focused lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, 10, 10); // Adjust position as needed
scene.add(directionalLight);

// Moon revolution parameters
const moonOrbitSpeed = 0.001; // Speed of moon's revolution (slowed down)
let moonAngle = 0; // Initial moon angle for revolution

// Moon rotation parameters
const moonRotationSpeed = 0.0005; // Speed of moon's rotation around its axis (slowed down)

// Real-time synchronization for Earth's rotation (slowed down)
function realTimeRotation() {
  const earthRotationSpeed = 0.0002; // Slowed down Earth's rotation speed
  earth.rotation.y += earthRotationSpeed;

  // Moon revolution around Earth
  moonAngle += moonOrbitSpeed;
  moon.position.x = Math.cos(moonAngle) * moonDistance; // X-axis revolution
  moon.position.z = Math.sin(moonAngle) * moonDistance; // Z-axis revolution

  // Moon's rotation around its own axis
  moon.rotation.y += moonRotationSpeed;
}

// Animate function
function animate() {
  realTimeRotation(); // Sync with real-time
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
