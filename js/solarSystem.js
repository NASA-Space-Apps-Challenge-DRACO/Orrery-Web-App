// Import
import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";

//////////////////////////////////////
// NOTE Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
// NOTE texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
// NOTE import all texture
const starTexture = textureLoader.load("./image/stars.jpg");
const sunTexture = textureLoader.load("./image/sun.jpg");
const mercuryTexture = textureLoader.load("./image/mercury.jpg");
const venusTexture = textureLoader.load("./image/venus.jpg");
const earthTexture = textureLoader.load("./image/earth.jpg");
const marsTexture = textureLoader.load("./image/mars.jpg");
const jupiterTexture = textureLoader.load("./image/jupiter.jpg");
const saturnTexture = textureLoader.load("./image/saturn.jpg");
const uranusTexture = textureLoader.load("./image/uranus.jpg");
const neptuneTexture = textureLoader.load("./image/neptune.jpg");
const plutoTexture = textureLoader.load("./image/pluto.jpg");
const saturnRingTexture = textureLoader.load("./image/saturn_ring.png");
const uranusRingTexture = textureLoader.load("./image/uranus_ring.png");
//////////////////////////////////////

//////////////////////////////////////
// NOTE Creating scene
const scene = new THREE.Scene();
//////////////////////////////////////

//////////////////////////////////////
// NOTE screen bg
const cubeTextureLoader = new THREE.CubeTextureLoader();
const cubeTexture = cubeTextureLoader.load([
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
  starTexture,
]);
scene.background = cubeTexture;
//////////////////////////////////////

//////////////////////////////////////
// NOTE Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);
//////////////////////////////////////

//////////////////////////////////////
// NOTE Percpective controls
const orbit = new OrbitControls(camera, renderer.domElement);
//////////////////////////////////////

//////////////////////////////////////
// NOTE - sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);
//////////////////////////////////////

//////////////////////////////////////
// NOTE - sun light (point light)
const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);
//////////////////////////////////////

//////////////////////////////////////
// NOTE - ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);
//////////////////////////////////////

//////////////////////////////////////
// NOTE - path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Number of segments to create the circular path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}
//////////////////////////////////////

//////////////////////////////////////
// NOTE: create planet
const genratePlanet = (size, planetTexture, x, ring) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
  };
};

const planets = [
  {
    ...genratePlanet(3.2, mercuryTexture, 28),
    rotaing_speed_around_sun: 0.004,
    self_rotation_speed: 0.004,
  },
  {
    ...genratePlanet(5.8, venusTexture, 44),
    rotaing_speed_around_sun: 0.015,
    self_rotation_speed: 0.002,
  },
  {
    ...genratePlanet(6, earthTexture, 62),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...genratePlanet(4, marsTexture, 78),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...genratePlanet(12, jupiterTexture, 100),
    rotaing_speed_around_sun: 0.002,
    self_rotation_speed: 0.04,
  },
  {
    ...genratePlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }),
    rotaing_speed_around_sun: 0.0009,
    self_rotation_speed: 0.038,
  },
  {
    ...genratePlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }),
    rotaing_speed_around_sun: 0.0004,
    self_rotation_speed: 0.03,
  },
  {
    ...genratePlanet(7, neptuneTexture, 200),
    rotaing_speed_around_sun: 0.0001,
    self_rotation_speed: 0.032,
  },
  {
    ...genratePlanet(2.8, plutoTexture, 216),
    rotaing_speed_around_sun: 0.0007,
    self_rotation_speed: 0.008,
  },
];

//////////////////////////////////////
// NOTE - GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms") * 1;
gui.add(options, "speed", 0, maxSpeed ? maxSpeed : 20);

//////////////////////////////////////
// NOTE - add stars to the background
function addStars() {
  const starGeometry = new THREE.SphereGeometry(0.5, 24, 24); // Small spheres for stars
  const starMaterial = new THREE.MeshBasicMaterial({
    map: starTexture,
  });

  for (let i = 0; i < 300; i++) {
    // Number of stars
    const star = new THREE.Mesh(starGeometry, starMaterial);

    // Randomly position the stars in space
    const [x, y, z] = Array(3)
      .fill()
      .map(() => THREE.MathUtils.randFloatSpread(1000)); // Spread stars across 1000 units in space

    star.position.set(x, y, z);
    scene.add(star);
  }
}

addStars(); // Call the function to add stars
//////////////////////////////////////

//////////////////////////////////////
// NOTE - animate function
import { GLTFLoader } from "https://unpkg.com/three@0.127.0/examples/jsm/loaders/GLTFLoader.js"; // Import the GLTFLoader

const asteroidBelt = [];
const asteroidCount = 50; // Number of asteroids in the belt
const asteroidDistance = (78 + 100) / 2; // Midway distance between Mars (78) and Jupiter (100)
const asteroidOrbitRadius = 25; // Radius for the asteroid belt to create space

const loader = new GLTFLoader();

// Load the asteroid model
loader.load("./image/Asteroid_1a.glb", (gltf) => {
  const asteroidModel = gltf.scene;

  for (let i = 0; i < asteroidCount; i++) {
    const asteroid = asteroidModel.clone();
    const angle = (i / asteroidCount) * Math.PI * 2; // Calculate angle for circular positioning
    const x = asteroidDistance * Math.cos(angle);
    const z = asteroidDistance * Math.sin(angle);

    asteroid.position.set(x, 0, z);
    asteroid.rotation.set(0, Math.random() * Math.PI, 0); // Random rotation for each asteroid

    // Add a small orbiting motion
    asteroid.rotationSpeed = Math.random() * 0.02 + 0.01; // Random speed for slight rotation
    scene.add(asteroid);
    asteroidBelt.push(asteroid);
  }
});

// Animate function to include asteroid movement
// Animation loop
function animate(time) {
  requestAnimationFrame(animate);
  
  // Rotate the sun
  sun.rotateY(options.speed * 0.004);

  // Rotate the planets and asteroids
  planets.forEach(({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
  });

  asteroidBelt.forEach((asteroid) => {
      asteroid.rotateY(asteroid.rotationSpeed);
  });

  renderer.render(scene, camera);
}

// Start the animation
animate();

//////////////////////////////////////

//////////////////////////////////////
// NOTE - resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
//////////////////////////////////////
const planetInfo = {
  mercury: {
    name: "Mercury",
    description: "Mercury is the closest planet to the Sun and is known for its swift orbit.",
  },
  venus: {
    name: "Venus",
    description: "Venus is the second planet from the Sun and is Earth's sister planet.",
  },
  earth: {
    name: "Earth",
    description: `Earth is the third planet from the Sun and the only astronomical object known to support life.
                  <br><br><br><center><a href="earth2.html" id="earthLink" style="color:lightblue; text-decoration:underline;">View Near Earth Objects</a></center>`,
  },
  mars: {
    name: "Mars",
    description: "Mars is the fourth planet from the Sun and is known as the Red Planet.",
  },
  jupiter: {
    name: "Jupiter",
    description: "Jupiter is the largest planet in the Solar System, known for its Great Red Spot.",
  },
  saturn: {
    name: "Saturn",
    description: "Saturn is the sixth planet from the Sun, famous for its stunning rings.",
  },
  uranus: {
    name: "Uranus",
    description: "Uranus is the seventh planet from the Sun and has a unique blue color.",
  },
  neptune: {
    name: "Neptune",
    description: "Neptune is the eighth planet from the Sun, known for its deep blue color.",
  },
  pluto: {
    name: "Pluto",
    description: "Pluto is a dwarf planet known for its eccentric orbit and small size.",
  },
  sun:{
    name: "Sun",
    description: "The Sun is the star at the center of the Solar System and the largest planet by mass.",
  }
};
// Handle mouse clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const infoPanel = document.createElement("div");
infoPanel.id = "infoPanel"; // This ID should match the CSS selector
infoPanel.style.position = "absolute";
infoPanel.style.top = "10px";
infoPanel.style.left = "10px";
infoPanel.style.color = "#ffffff";
infoPanel.style.backgroundColor = "rgba(0, 0, 0, 0.1)";
infoPanel.style.padding = "10px";
infoPanel.style.display = "none";
infoPanel.style.borderRadius = "10px"; // Optional: round corners
infoPanel.style.backdropFilter = "blur(10px)"; // Add blur effect
document.body.appendChild(infoPanel);

window.addEventListener("click", (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    const planetIndex = planets.findIndex(p => p.planet === planet);

    if (planetIndex !== -1) {
      const planetData = planets[planetIndex];
      const planetName = planetInfo[Object.keys(planetInfo)[planetIndex]].name;
      const planetDescription = planetInfo[Object.keys(planetInfo)[planetIndex]].description;

      // Update info panel
      infoPanel.innerHTML = `<strong>${planetName}</strong><br>${planetDescription}`;
      infoPanel.style.display = "block";

      // If Earth is clicked, add event listener for link
      if (planetName === "Earth") {
        const earthLink = document.getElementById("earthLink");
        earthLink.addEventListener("click", (e) => {
          e.preventDefault(); // Prevent default anchor behavior
          window.location.href = "./earth2.html"; // Navigate to earth.html
        });
      }

      // Get the world position of the clicked planet
      const planetWorldPos = new THREE.Vector3();
      planetData.planet.getWorldPosition(planetWorldPos);

      // Zoom into the planet smoothly using GSAP
      gsap.to(camera.position, {
        duration: 2, // Time to move camera
        x: planetWorldPos.x + 20, // Adjust these offsets to your liking
        y: planetWorldPos.y + 20,
        z: planetWorldPos.z + 20,
        onUpdate: () => {
          camera.lookAt(planetWorldPos); // Keep the camera looking at the planet
        },
        ease: "power2.inOut", // Easing for smooth transition
      });
    }
  }
});


