let camera, scene, renderer;
let mesh;

const COUNT = 7;
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
    const material = new THREE.MeshBasicMaterial( { map: loader.load('./textures/white2.png'), transparent: true, } );
    mesh = new THREE.InstancedMesh( geometry, material, COUNT );

    for( let i = 0; i < COUNT; i++ ) {
        setRandomPosition( i );
        setColor( i );
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

function setColor( index ) {
    const color = new THREE.Color();
    
    switch(index) {
        case 0:
            color.setHex( 0xFF0000 );
            break
        case 1:
            color.setHex( 0xFFA500 );
            break
        case 2:
            color.setHex( 0xFFFF00 );
            break
        case 3:
            color.setHex( 0x00FF00 );
            break
        case 4:
            color.setHex( 0x0000FF );
            break
        case 5:
            color.setHex( 0x4B0082 );
            break
        case 6:
            color.setHex( 0x8F00FF );
            break
    }

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
