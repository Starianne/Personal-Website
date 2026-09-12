import * as THREE from 'three';
import './projectstyle.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

//setting up renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('#bg')
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//setting up light 
const light = new THREE.DirectionalLight(0x717A73, 3)
light.position.set(-1, 2, 4);
scene.add(light)

camera.position.z = 10;

//set up each disc
function makeInstance(color, x) {
    const geometry = new THREE.CylinderGeometry(2, 3, 0.5)
    const material = new THREE.MeshPhongMaterial({color}); //meshphong makes a meterial that is affected by light
    const disc = new THREE.Mesh(geometry, material);
    scene.add(disc);

    disc.position.x = x*1.5;

    return disc;
}


const discs = [
    makeInstance(0xE0E0E0, 0),
    makeInstance(0xE0E0E0, 8),
    makeInstance(0xE0E0E0, 16),
    makeInstance(0xE0E0E0, 24),
    makeInstance(0xE0E0E0, 32)
];

var discPos = 0 //we will use this to track where the disc position is

//actually loading the discs
function render(time) {
    time *= 0.001; //to convert time into seconds
    discs.forEach((disc) => { //goes through each item in the array
        disc.rotation.y = time / 2;
        disc.rotation.x = 1.5; 
    });

    renderer.render( scene, camera );
    requestAnimationFrame( render ); //apparently we need two

}

//left and right buttons
const leftBtn = document.getElementById("left")
const rightBtn = document.getElementById("right")

function left() {
    if (discPos > 0) {
        camera.position.x -= 12
        console.log("hello")
        discPos -= 1
        console.log(`${discPos} position`)
    }
    
}

function right() {
    if (discPos < 4) {
        console.log("go right")
        camera.position.x += 12
        discPos += 1
        console.log(`${discPos} position`)
    }
    
}

leftBtn.addEventListener("click", left)
rightBtn.addEventListener("click", right)



requestAnimationFrame( render ); //apparently we need two




//plan is have multiple discs that we move to, and then we move the camera with each button press to the next disc,
//on each disc, it should have an image be updated in the background and the text too1