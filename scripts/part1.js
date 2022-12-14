let camera, scene, renderer;
let mesh;

const COUNT = 9;
const dummy = new THREE.Object3D();

init();
animate();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(
        window.innerWidth / - 2,
        window.innerWidth / 2,
        window.innerHeight / 2,
        window.innerHeight / - 2,
        -1,
        1
    );
    scene.add( camera );

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.PlaneGeometry( 100, 100 );

    const loader = new THREE.TextureLoader()
    const material = new THREE.MeshBasicMaterial( { map: loader.load('./textures/crate.jpg') } );
    mesh = new THREE.InstancedMesh( geometry, material, COUNT );

    for( let i = 0; i < COUNT; i++ ) {
        setRandomPosition( i );
        setRandomColor( i );
    }
    mesh.instanceColor.needsUpdate = true;
    mesh.instanceMatrix.needsUpdate = true;

    scene.add( mesh );
}

function setRandomPosition( index ) {
    const maxX = (window.innerWidth / 2) - 50;
    const minX = (window.innerWidth / - 2) + 50;
    const maxY = (window.innerHeight / 2) - 50;
    const minY = (window.innerHeight / - 2) + 50;

    dummy.position.set(
        Math.random() * (maxX - minX) + minX,
        Math.random() * (maxY - minY) + minY,
        0
    );
    dummy.updateMatrix();
    mesh.setMatrixAt( index, dummy.matrix );
}

function setRandomColor( index ) {
    const color = new THREE.Color( 0xFFFFFF );
    color.setHex( Math.random() * 0xffffff );
    mesh.setColorAt( index, color );
}

function animate() {
    requestAnimationFrame( animate );
	renderer.render( scene, camera );
}

window.addEventListener( 'resize', onWindowResize, false );
function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}