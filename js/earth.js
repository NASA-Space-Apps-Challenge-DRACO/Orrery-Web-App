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
const earthTexture = textureLoader.load(
  "./image/earth/textures/Material.002_diffuse.jpeg"
);

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

// Add ambient light for general illumination
const ambientLight = new THREE.AmbientLight(0x404040, 0.5); // Soft white light
scene.add(ambientLight);

// Optional: Add a directional light for more focused lighting
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(-10, 10, 10); // Adjust position as needed
scene.add(directionalLight);

// Real-time synchronization for Earth rotation
function realTimeRotation() {
  const now = new Date();
  const seconds = now.getUTCSeconds();
  const rotationSpeed = 360 / 60; // Degrees per second
  earth.rotation.y += rotationSpeed * (seconds / 240) * 0.01; // Rotate based on seconds
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
