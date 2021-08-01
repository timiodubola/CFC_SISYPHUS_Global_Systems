import * as THREE from '../libs/three/three.module.js';
import { GLTFLoader } from '../libs/three/jsm/GLTFLoader.js';
import { RGBELoader } from '../libs/three/jsm/RGBELoader.js';
import { ARButton } from '../libs/ARButton.js';
import { LoadingBar } from '../libs/LoadingBar.js';
import { Player } from '../libs/Player.js';

class App{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.clock = new THREE.Clock();
        
        //this.loadingBar = new LoadingBar();

		this.assetsPath = '../../assets/';
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		this.camera.position.set( 0, 1.6, 3 );
        
		this.scene = new THREE.Scene();

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 2);
        ambient.position.set( 0.5, 1, 0.25 );
		this.scene.add(ambient);
        
        const light = new THREE.DirectionalLight();
        light.position.set( 0.2, 1, 1);
        this.scene.add(light);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        //this.setEnvironment();
        
        this.workingVec3 = new THREE.Vector3();
        
        this.initScene();
        this.setupXR();
		
		window.addEventListener('resize', this.resize.bind(this));
        
	}
	
    resize(){ 
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight );  
    }
	
	
	addOurUIButtons(){
	  
	 // Fixing the Geomtery for the buttons
	 // const geometry = new THREE.CircleGeometry( 0.15, 32 );  

	  const geometry = new THREE.PlaneGeometry( 2.0 * (3.04/13.31), 2.0, 32 );  
 
	  const gisT = new THREE.TextureLoader().load( '../static/img/allButtons.png' );

	  const gisM = new THREE.MeshBasicMaterial( { map: gisT, transparent: true, opacity: 0.4 } );

	  const buttonPanel = new THREE.Mesh( geometry, gisM );

	  buttonPanel.position.set(0.75, 1.15, -2.5);
	  
	  //this.gis_circle.position.set(0, 0, -0.3);

	  return buttonPanel ;

	}

    initScene(){
		// Add our logo
		const logT = new THREE.TextureLoader().load( '../static/img/sisyphus.jpg' );
		this.ourLogo = new THREE.Mesh(
            new THREE.PlaneGeometry( 0.4 , 0.4 ),
            new THREE.MeshBasicMaterial( { map: logT } )
        );
        this.ourLogo.position.set(-0.75, 2.0, -2.5);
		
		// Add our button panel
        this.buttonPanel = this.addOurUIButtons();

		// Add our Instructions
		const logI = new THREE.TextureLoader().load( '../static/img/instruct.png' );
		this.instruct = new THREE.Mesh(
            new THREE.PlaneGeometry( 1.5 , 0.75 ),
            new THREE.MeshBasicMaterial( { map: logI, transparent: true, opacity: 0.4 } )
        );
        this.instruct.position.set(-0.2, 1.3, -2.5);
		
		// Add the reticle 
		const retT = new THREE.TextureLoader().load( '../static/img/myReticle.png' );
		this.reticle = new THREE.Mesh(
            new THREE.PlaneGeometry( 0.4 , 0.4 ).rotateX( - Math.PI / 2 ),
            new THREE.MeshBasicMaterial( { map: retT } )
        );
        
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;
        
		// Add the firm map 
		const firmT = new THREE.TextureLoader().load( '../static/img/FIRMmap.jpg' );
        this.firmMap = new THREE.Mesh(
            new THREE.PlaneGeometry( 1.89 , 1.33 , ).rotateX( - Math.PI /2 ),
            new THREE.MeshBasicMaterial( { map: firmT } )
        );
		
		this.firmMap.visible = false;
		
		// Add everything to scene
		this.scene.add(this.ourLogo, this.buttonPanel, this.instruct, this.reticle, this.firmMap );

    }
	

    setupXR(){
        this.renderer.xr.enabled = true;
        
        const self = this;

		const btn = new ARButton( this.renderer , {sessionInit: { requiredFeatures: [ 'hit-test' ], optionalFeatures: [ 'dom-overlay' ], domOverlay: { root: document.body } } } );


        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
		
        function onSelect() {
            if (self.firmMap===undefined) return;
			
			//self.buttonPanel.visible = false;

            if (self.reticle.visible){
				if(self.firmMap.visible){

					self.firmMap.position.setFromMatrixPosition( self.reticle.matrix );

				} else {
					self.firmMap.position.setFromMatrixPosition( self.reticle.matrix );
                    self.firmMap.visible = true;
				}   
            }
		}
		
		
        this.controller = this.renderer.xr.getController( 0 );
        this.controller.addEventListener( 'select', onSelect );

        this.scene.add( this.controller );  
		
		this.renderer.setAnimationLoop( this.render.bind(this) );
    }
    
    requestHitTestSource(){
        const self = this;
        
        const session = this.renderer.xr.getSession();

        session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {
            
            session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

                self.hitTestSource = source;

            } );

        } );

        session.addEventListener( 'end', function () {

            self.hitTestSourceRequested = false;
            self.hitTestSource = null;
            self.referenceSpace = null;

        } );

        this.hitTestSourceRequested = true;

    }
    
    getHitTestResults( frame ){
        const hitTestResults = frame.getHitTestResults( this.hitTestSource );

        if ( hitTestResults.length ) {
            
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const hit = hitTestResults[ 0 ];
            const pose = hit.getPose( referenceSpace );

            this.reticle.visible = true;
            this.reticle.matrix.fromArray( pose.transform.matrix );

        } else {

            this.reticle.visible = false;

        }

    }

    render( timestamp, frame ) {
        const dt = this.clock.getDelta();
        //if (this.knight) this.knight.update(dt);

        const self = this;
        
        if ( frame ) {

            if ( this.hitTestSourceRequested === false ) this.requestHitTestSource( )

            if ( this.hitTestSource ) this.getHitTestResults( frame );

        }
		
        this.renderer.render( this.scene, this.camera );
        
        /*if (this.knight.calculatedPath && this.knight.calculatedPath.length>0){
            console.log( `path:${this.knight.calculatedPath[0].x.toFixed(2)}, ${this.knight.calculatedPath[0].y.toFixed(2)}, ${this.knight.calculatedPath[0].z.toFixed(2)} position: ${this.knight.object.position.x.toFixed(2)}, ${this.knight.object.position.y.toFixed(2)}, ${this.knight.object.position.z.toFixed(2)}`);
        }*/
    }
}

export { App };
