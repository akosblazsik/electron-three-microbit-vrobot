// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const serialport = require('serialport')

var THREE = require('three');
var Stats = require('./node_modules/three/examples/js/libs/stats.min.js');
var dat = require('./node_modules/three/examples/js/libs/dat.gui.min.js');
var GLTFLoader = require('./node_modules/three/examples/js/loaders/GLTFLoader.js');

let animationId;
let cube;

var container, stats, clock, gui, mixer, actions, activeAction, previousAction;
var camera, scene, renderer, model, face;

var api = {
    state: 'Walking'
};

init();
animate();


function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
    camera.position.set(-5, 3, 10);
    camera.lookAt(new THREE.Vector3(0, 2, 0));

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xe0e0e0);
    scene.fog = new THREE.Fog(0xe0e0e0, 20, 100);

    clock = new THREE.Clock();

    // lights

    var light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    scene.add(light);

    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 20, 10);
    scene.add(light);

    // ground

    var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshPhongMaterial({
        color: 0x999999,
        depthWrite: false
    }));
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    var grid = new THREE.GridHelper(200, 40, 0x000000, 0x000000);
    grid.material.opacity = 0.2;
    grid.material.transparent = true;
    scene.add(grid);

    // model

    var loader = new THREE.GLTFLoader();
    loader.load('./RobotExpressive.glb', function(gltf) {

        model = gltf.scene;
        scene.add(model);

        createGUI(model, gltf.animations);

    }, undefined, function(e) {

        console.error(e);

    });

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    window.addEventListener('resize', onWindowResize, false);

    // stats
    stats = new Stats();
    container.appendChild(stats.dom);
}


function createGUI(model, animations) {

    var states = ['Idle', 'Walking', 'Running', 'Dance', 'Death', 'Sitting', 'Standing'];
    var emotes = ['Jump', 'Yes', 'No', 'Wave', 'Punch', 'ThumbsUp'];

    gui = new dat.GUI();

    mixer = new THREE.AnimationMixer(model);

    actions = {};

    for (var i = 0; i < animations.length; i++) {

        var clip = animations[i];
        var action = mixer.clipAction(clip);
        actions[clip.name] = action;

        if (emotes.indexOf(clip.name) >= 0 || states.indexOf(clip.name) >= 4) {

            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;

        }

    }

    // states

    var statesFolder = gui.addFolder('States');

    var clipCtrl = statesFolder.add(api, 'state').options(states);

    clipCtrl.onChange(function() {

        fadeToAction(api.state, 0.5);

    });

    statesFolder.open();

    // emotes

    var emoteFolder = gui.addFolder('Emotes');

    function createEmoteCallback(name) {

        api[name] = function() {

            fadeToAction(name, 0.2);

            mixer.addEventListener('finished', restoreState);

        };

        emoteFolder.add(api, name);

    }

    function restoreState() {

        mixer.removeEventListener('finished', restoreState);

        fadeToAction(api.state, 0.2);

    }

    for (var i = 0; i < emotes.length; i++) {

        createEmoteCallback(emotes[i]);

    }

    emoteFolder.open();

    // expressions

    face = model.getObjectByName('Head_2');

    var expressions = Object.keys(face.morphTargetDictionary);
    var expressionFolder = gui.addFolder('Expressions');

    for (var i = 0; i < expressions.length; i++) {

        expressionFolder.add(face.morphTargetInfluences, i, 0, 1, 0.01).name(expressions[i]);

    }

    activeAction = actions['Death'];
    activeAction.play();

    expressionFolder.open();

}


function fadeToAction(name, duration) {

    previousAction = activeAction;
    activeAction = actions[name];

    if (previousAction !== activeAction) {

        previousAction.fadeOut(duration);

    }

    activeAction
        .reset()
        .setEffectiveTimeScale(1)
        .setEffectiveWeight(1)
        .fadeIn(duration)
        .play();

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}


function animate() {

    var dt = clock.getDelta();

    if (mixer) mixer.update(dt);

    requestAnimationFrame(animate);

    renderer.render(scene, camera);

    stats.update();

}


function stop() {
    console.log("stop animation with id: " + animationId);
    cancelAnimationFrame(animationId);
}


function onWindowResize() {

    let width = window.innerWidth;
    let height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    renderer.setSize(width, height);

}

//var SerialPort = require("serialport");
const Readline = serialport.parsers.Readline;

var port = new serialport("/dev/ttyACM0", {
    baudRate: 115200,
    autoOpen: true
})
const parser = new Readline();

parser.on('data', console.log)
//port.write('ROBOT PLEASE RESPOND\n')
port.pipe(parser);


console.log(port);
port.open(() => {
    console.log("Port open");
    parser.on('data', (data) => {
        console.log('Received Data: ' + data.toString());
        processData(data);
    });
})

function processData(data) {
    if (data.indexOf('PLAY') == 0) {
        // Handle PLAY received
        fadeToAction("Walking", 0.2);

    } else if (data.indexOf('PAUSE') == 0) {
        // Handle PAUSE received
        fadeToAction("Idle", 0.2);

    } else if (data.indexOf('DISASSEMBLE') == 0) {
        // Handle DISASSEMBLE received
        fadeToAction("Death", 0.2);
    }
}
