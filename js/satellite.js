// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the Earth texture
const textureLoader = new THREE.TextureLoader();
const earthTexture = textureLoader.load('../image/2k_earth_daymap.jpg');

// Create the Earth with the texture
const earthGeometry = new THREE.SphereGeometry(1, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ map: earthTexture }); // Use texture
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);

// Create the satellite
const satelliteGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial);
scene.add(satellite);

// Position the camera
camera.position.z = 5;

// Animation variables
const satelliteOrbitRadius = 2; // Radius of the satellite's orbit
let satelliteAngle = 0;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update satellite position
    satelliteAngle += 0.01; // Adjust the speed of the satellite
    satellite.position.x = satelliteOrbitRadius * Math.cos(satelliteAngle);
    satellite.position.z = satelliteOrbitRadius * Math.sin(satelliteAngle);

    renderer.render(scene, camera);
}

// Resize the canvas when the window is resized
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

// Start the animation
animate();
