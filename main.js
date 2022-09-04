import './style.css'

import * as THREE from 'three'

// Allows move around using mouse
import { OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

// In three js always need 3 objects - Scene, Camera & rendered

// Scene holds objects, cameras and lights
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Renders graphics to scene
const renderer = new THREE.WebGL1Renderer({
  // renderer needs to know which element to render on, thus canvas with id of bg
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene,camera);

// the geometry is the vector that defines the object itself
const geometry = new THREE.TorusGeometry(6,2,8,100);
// material gives color/texture - "wrapping paper" - cant write custom shaders in WebGL to do this too
// Most materials need light source, but because basic material, it does not need a light source
// const material = new THREE.MeshBasicMaterial({color: 0xFF6347, wireframe:true});

// Standard material reacts to light bouncing off it
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
// torus is the actual wrapped geometry, the object we want to actually add to the scene
const torus = new THREE.Mesh(geometry,material);

scene.add(torus)

// pointlight emits light in all directions like a light bulb, good for featuring a specific point
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5,5,5);

// ambientlight more like floodlight, illuminating entire room
const ambientlight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight, ambientlight)

// will show wireframe of pointlight position and direction for help
const lightHelper = new THREE.PointLightHelper(pointLight);
// draws 2d grid along the scene
const gridHelper = new THREE.GridHelper(200,50);

scene.add(lightHelper, gridHelper)


const controls = new OrbitControls(camera, renderer.domElement);

function addStar() {
  // radius 0.05
  const geometry = new THREE.SphereGeometry(0.05, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;


// Avatar

const fredTexture = new THREE.TextureLoader().load('fred.jpg');

const fred = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), new THREE.MeshBasicMaterial({ map: fredTexture }));

scene.add(fred);


// Moon

const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);

fred.position.z = -5;
fred.position.x = 2;



// Scroll Animation

function moveCamera() {
  // getBoundingClientRect gives idea of viewport and how far from top of page
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  fred.rotation.y += 0.01;
  fred.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();


// Instead of a single render, function animate acts more like a game loop to rerender as the scene changes continually
function animate() {
  requestAnimationFrame( animate);

  torus.rotation.x += 0.006;
  torus.rotation.y += 0.002;
  torus.rotation.z += 0.006;

  controls.update();


  renderer.render(scene, camera);
}

animate();

