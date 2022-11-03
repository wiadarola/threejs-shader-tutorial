let camera, scene, renderer
let mesh, offset;

const COUNT = 9;
let visible = COUNT;
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
    offset = new Float32Array( [
        0,1,2,3,4,5,6,7,8
    ] )
    // x = (i % 5) / 5 =>  [0/5, 1/5, 2/5, 3/5, 4/5, 0/5, 1/5, 2/5, 3/5, 4/5]
    // y = (i // 5) / 2 => [0/2, 0/2, 0/2, 0/2, ]
    geometry.setAttribute( 'offset', new THREE.InstancedBufferAttribute( offset, 1 ) );
    
    const loader = new THREE.TextureLoader()
    const texture = loader.load('./textures/atlasBox.PNG')
    const material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, } );
    
    material.onBeforeCompile = function ( shader ) {
    shader.vertexShader=shader.vertexShader.replace(
        "void main() {",
    
        "attribute vec2 offset;\n"+
        "void main() {"
    );
    
    let col = 5.0
    let row = 2.0

    shader.vertexShader=shader.vertexShader.replace(
        "#include <uv_vertex>",
    
        "#include <uv_vertex>\n"+
        `vUv[0] = vUv[0]*(1.0/${col.toFixed(1)})+(mod(offset[0], ${col.toFixed(1)}) / ${col.toFixed(1)}) ;\n`+
        `vUv[1] = vUv[1]*(1.0/${row.toFixed(1)}) + (floor(offset[0] / ${col.toFixed(1)}) / ${row.toFixed(1)}) ;`
    );
    }

    
    mesh = new THREE.InstancedMesh( geometry, material, COUNT );

    for( let i = 0; i < COUNT; i++ ) {
        setRandomPosition( i );
    }
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


// RAYCASTING START
const moveMouse = new THREE.Vector2();
const clickMouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();

window.addEventListener('click', event => {
    clickMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    clickMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(clickMouse, camera);

    const intersection = raycaster.intersectObject( mesh );

    if ( intersection.length > 0 ) {
        const index = intersection[0].instanceId;

        if(event.shiftKey == false) {
            mesh.geometry.attributes.offset.array[ index ] = Math.floor(Math.random() * (COUNT - 0) + 0);
            mesh.geometry.attributes.offset.needsUpdate = true;
        }
        else {
            const tbh_matrix = new THREE.Matrix4();
            mesh.getMatrixAt(index, tbh_matrix);
            let tbh_UV = mesh.geometry.attributes.offset.array[ index ];
 
            const swp_matrix = new THREE.Matrix4();
            mesh.getMatrixAt(visible - 1, swp_matrix);
            let swp_UV = mesh.geometry.attributes.offset.array[ visible - 1 ]

            mesh.setMatrixAt(index, swp_matrix);
            mesh.setMatrixAt(visible - 1, tbh_matrix);

            mesh.geometry.attributes.offset.array[ index ] = swp_UV;
            mesh.geometry.attributes.offset.array[ visible - 1 ] = tbh_UV;

            visible -= 1;
            mesh.count = visible;

            mesh.geometry.attributes.offset.needsUpdate = true;
            mesh.instanceMatrix.needsUpdate = true;
        }
        
    }
})
// RAYCASTING END

