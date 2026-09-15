import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';



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

//to make blender metal texture load properly
const pmremGenerator = new THREE.PMREMGenerator(renderer);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.4).texture;
import './projectstyle.css';

const loader = new GLTFLoader(); //to load blender model

camera.position.z = 10;

//set up each disc
async function makeInstance(x, discFile) { //can change this to have different files loaded for each disc just add url to replace diskTest.glb

    const gltf = await loader.loadAsync(discFile); //async basically waiting for geo+mat from blender file to be fetched
    const disc = gltf.scene; //meshes it together basically
    scene.add(disc);
    disc.position.x = x*3; //moves position of each disc so they dont stack on eachother
    disc.position.z = -x;
    disc.rotation.y = 0.2;
    
    return disc; //returns promises (bc of async) so we translate this into objects we can use in init() 
}

var imginfo = document.getElementById("info")

let discs = [];

async function init() {
    discs = await Promise.all([
        makeInstance(0, '/discMusichat.glb'),
        makeInstance(8, '/discBlinky.glb'),
        makeInstance(16, '/discPersonalWebsite.glb'),
        makeInstance(24, '/discKeyboard.glb')
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
        window.open(discData[discPos][3], '_blank'); //change the window to the page corresponding to the disc position
    }
}

canvas.addEventListener('click', onDiscClick);

function onDiscHover(event) { //does the exact same as click but 2 differences
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer,camera);
    const intersectsHover = raycaster.intersectObject(discs[discPos], true);
    canvas.style.cursor = intersectsHover.length > 0 ? 'pointer' : 'default'; //if intersectsHover detects multiple textures beneath it, pointer will be used
}

canvas.addEventListener('mousemove', onDiscHover) //add event listener everytime mouse is over a disc


// for later
function update(data) {//pass through the discs info
    var img = data[0]
    const imgLoader = new THREE.TextureLoader();
    imgLoader.load(img , function(texture)
            {
                scene.background = texture;
            });
    
    imginfo.src= data[1]
    imginfo.alt = data[2]
    discs[discPos]
    
}

//we need to store data about disks
const discData = [
    ["/imgs/musichat.png", "/imgs/musichatInfo.png", "Musichat, a chat website where you match with other people based on your top 5 songs. Skills: django, HTML/CSS, JavaScript, Websockets. Hours spent: 104", "https://musicchatapp-production.up.railway.app/goSignIn/?next=/"],
    ["/imgs/blinkyBoard.png", "/imgs/blinkyInfo.png", "Blinky Board, A printed circuit board that i designed with HackClub's blueprint tutorial. Skills: hardware. Hours spent: 5", "https://github.com/Starianne/Blinkyboard"],
    ["/imgs/personalSite.png", "/imgs/personalSiteInfo.png", "This Site! A website based off of the FF13 trilogy that acts as my personal website. Skills: JavaScript, HTML/CSS, Three.js, Blender. Hours spent: 63", "https://github.com/Starianne/Personal-Website"],
    ["/imgs/keyboard.png", "/imgs/keyboardInfo.png", "I will be making my own keyboard! Skills: hardware, idk yet.", "https://github.com/Starianne/keyboard"],
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

update(discData[0])

//Movement w keyboard
document.addEventListener('keydown', function(event) {
    var value = event.code;
    console.log(value)
    if (value == "KeyA" || value == "ArrowLeft") {
        if (discPos > 0) {
        camera.position.x -= 24;
        camera.position.z += 8;
        discPos -= 1;
        update(discData[discPos]);
        updateBtns();
        console.log(`${discPos} position`);
        }

    } else if (value == "KeyD" || value == "ArrowRight") {
        if (discPos < 3) { //update if you add a new project
        camera.position.x += 24;
        camera.position.z -= 8;
        discPos += 1;
        update(discData[discPos]);
        updateBtns();
        console.log(`${discPos} position`);
        }
    } else if (value == "Space") {
        window.open(discData[discPos][3], '_blank'); //change the window to the page corresponding to the disc position
    } else if (value == "Backspace") {
        window.open('./index.html') 
    }
});

//go home button stuff then add css for hover animations
const goHome = document.getElementById('goHome');
const goHomePointer = document.getElementById('pointer');

goHome.addEventListener('mouseenter', () => goHomePointer.classList.add('hovered'));
goHome.addEventListener('mouseleave', () => goHomePointer.classList.remove('hovered'));
goHome.addEventListener('click', () => window.location.href='./index.html');