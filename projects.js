import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import './projectstyle.css';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const canvas = document.querySelector('#bg')
//setting up renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );


const loader = new GLTFLoader();


//setting up light 
const light = new THREE.DirectionalLight(0xFFFFFF, 3)
light.position.set(-1, 2, 4);
scene.add(light)

camera.position.z = 10;

//set up each disc
async function makeInstance(x) { //can change this to have different files loaded for each disc just add url to replace diskTest.glb

    const gltf = await loader.loadAsync('discTest.glb'); //async basically waiting for geo+mat from blender file to be fetched
    const disc = gltf.scene; //meshes it together basically
    scene.add(disc);
    disc.position.x = x*2.25; //moves position of each disc so they dont stack on eachother
    
    return disc; //returns promises (bc of async) so we translate this into objects we can use in init() 
}

var title = document.getElementById("title")
var info = document.getElementById("info")
var skills = document.getElementById("skills")
var hours = document.getElementById("hours")




let discs = [];

async function init() {
    discs = await Promise.all([
        makeInstance(0),
        makeInstance(8),
        makeInstance(16),
        makeInstance(24)
    ]);
    console.log(discs)
    //only start rendering once every disc has actually loaded
    requestAnimationFrame( render ); //apparently we need two
}

init(); //now discs = the full array of objects

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onDiscClick(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1; //makes -1 left edge, 1 right edge
    pointer.y = -(event.clientY / window.innerHeight)* 2 + 1; // samething but with bottom and top, basically, normally the pointer would act like a pygame coord, but raycaster works like a normal x, y axis from center of screen, so we translate pygame coords into what raycaster wants (NDC space)
    console.log("yes a click was acknoledged")
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(discs[discPos], true) //true = check children too

    if (intersects.length > 0) { //if you find more layers (like that of an object like the disc)
        window.location.href = discData[discPos][5]; //change the window to the page corresponding to the disc position
    }
}

canvas.addEventListener('click', onDiscClick);

// for later
function update(data) {//pass through the discs info
    var img = data[0]
    const imgLoader = new THREE.TextureLoader();
    imgLoader.load(img , function(texture)
            {
                scene.background = texture;
            });
    title.innerHTML = data[1];
    info.innerHTML = data[2];
    skills.innerHTML = data[3];
    hours.innerHTML = data[4];
    discs[discPos]
    
}

//we need to store data about disks
const discData = [
    ["./imgs/musichat.png", "Musichat", "a chat website where you match with other people based on your top 5 songs.", ["django", "HTML/CSS", "JavaScript", "Websockets"], "20", "./musichat.html"],
    ["./imgs/blinkyBoard.jpeg", "Blinky Board", "a chat website where you match with other people based on your top 5 songs.", ["django", "HTML/CSS", "JavaScript", "Websockets"], "20", "./blinkyBoard.html"],
    ["./imgs/personalSite.png", "Personal Site", "a chat website where you match with other people based on your top 5 songs.", ["django", "HTML/CSS", "JavaScript", "Websockets"], "20", "./personalSite.html"],
    ["./imgs/keyboard.png", "Keyboard", "a chat website where you match with other people based on your top 5 songs.", ["django", "HTML/CSS", "JavaScript", "Websockets"], "20", "./keyboard.html"],
]

var discPos = 0; //we will use this to track where the disc position is

//actually loading the discs
function render(time) {
    time *= 0.001; //to convert time into seconds
    discs.forEach((disc) => { //goes through each item in the array
        disc.rotation.z = time / 2;
    });

    renderer.render( scene, camera );
    requestAnimationFrame( render ); //apparently we need two

}

//left and right buttons
const leftBtn = document.getElementById("left")
leftBtn.style.display = "none" //to make sure that page loads in with left button unavailable
const rightBtn = document.getElementById("right")
update(discData[0])

function updateBtns() { //make sure buttons get update on disc pos
    if (discPos == 0) {
        leftBtn.style.display = "none";
    } else if (discPos == 3) {
        rightBtn.style.display = "none";
    } else {
        leftBtn.style.display = "block";
        rightBtn.style.display = "block";
    }
}

function left() {
    if (discPos > 0) {
        camera.position.x -= 18;
        discPos -= 1;
        update(discData[discPos]);
        updateBtns();
        console.log(`${discPos} position`);
    }
    
}

function right() {
    if (discPos < 3) { //update if you add a new project
        camera.position.x += 18;
        discPos += 1;
        update(discData[discPos]);
        updateBtns();
        console.log(`${discPos} position`);
    }
    
}

leftBtn.addEventListener("click", left);
rightBtn.addEventListener("click", right);

//plan is have multiple discs that we move to, and then we move the camera with each button press to the next disc,
//on each disc, it should have an image be updated in the background and the text too1