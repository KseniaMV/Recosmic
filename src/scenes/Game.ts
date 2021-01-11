import { Engine, Scene, Vector3, Mesh, HemisphericLight, Sound, PostProcess, MeshBuilder,  Animation, SceneLoader, CannonJSPlugin, ArcRotateCamera, PhysicsImpostor, StandardMaterial, Texture, Color3} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";
import { Player } from '../classes/Player';
import {SkyMaterial} from '@babylonjs/materials/sky/skyMaterial';

export class Game {
  private _scene: Scene;
  private _newScene: Scene;
  private _engine: Engine;
  private _camera: ArcRotateCamera;
  private _transition: boolean;
  private _callback;
  private _fadeLevel: number = 1.0;
  private _player;
  private _light: HemisphericLight;
  private _canvas: any;
  public model;
  private _ground;

  constructor(engine: Engine, callback: any, canvas: any) {
    this._callback = callback;
    this._engine = engine;
    this._canvas = canvas;
    this._scene = new Scene(engine);
    this._scene.collisionsEnabled = true;

    this._camera = new ArcRotateCamera("Camera", 0, 0.8, 200, Vector3.Zero(), this._scene);
    this._camera.setPosition(new Vector3(0, 8, -10));
    this._camera.setTarget(Vector3.Zero());
    this._camera.attachControl(this._canvas);
    this._camera.checkCollisions = true;
    this._camera.collisionRadius = new Vector3(1.5, 1.5, 1.5);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = (Math.PI / 2) * 0.9;
    this._camera.lowerRadiusLimit = 5;
    this._camera.upperRadiusLimit = 20;

    this._light = new HemisphericLight("light", new Vector3(-3, 10, 50), this._scene);
    this._player = new Player(this._scene);

    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });
    this.loadPhisics(this._scene);
    this.loadScene(this._scene);
    this._addBox(this._scene);
    this._createSkyBox();
  }

  loadScene(scene: Scene) {
    const ground = MeshBuilder.CreateGround("ground", {width:60, height:30});
      ground.physicsImpostor = new PhysicsImpostor(ground, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
    const largeGround = MeshBuilder.CreateGroundFromHeightMap("largeGround", "https://assets.babylonjs.com/environments/villageheightmap.png", {width:150, height:150, subdivisions: 30, minHeight:0, maxHeight: 10});
      largeGround.physicsImpostor = new PhysicsImpostor(largeGround, PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.5, restitution: 0.7 }, scene);
      largeGround.position.y = -0.5;
      this._ground = ground; 
      ground.checkCollisions = true;        //нужно создать стену для того чтобы не выходил кубик за пределы сцены
    const groundMat = new StandardMaterial("groundMat", this._scene);
      groundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/villagegreen.png", scene);
      groundMat.bumpTexture = new Texture("../assets/images/backgrounds/bump.jpg", scene)
      ground.material = groundMat;

    const largeGroundMat = new StandardMaterial("largeGroundMat", scene);
      largeGroundMat.diffuseTexture = new Texture("https://assets.babylonjs.com/environments/valleygrass.png", scene);
      largeGround.material = largeGroundMat;
      largeGroundMat.ambientColor = new Color3(0, 1, 0);
  } 

  loadPhisics(scene: Scene) {
      var gravityVector = new Vector3(0, -9, 0);
      var physicsPlugin = new CannonJSPlugin();
      scene.enablePhysics(gravityVector, physicsPlugin);
  }

  getScene() {
    return this._scene;
  }

  closeScene() {
    const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this._camera);
    postProcess.onApply = (effect) => {
      effect.setFloat("fadeLevel", this._fadeLevel);
    };
    this._transition = true;
    this._scene.detachControl();
  }

  private _addBox(scene: Scene) {
    SceneLoader.ImportMesh("", "../assets/images/examples/", "player.glb", this._scene, function(newMeshes){
      newMeshes[0].position = new Vector3(-15, 0.5, 0);
    });
    const box = MeshBuilder.CreateBox("box", {});    //add box for checking the movement of camera
      box.position.x = -15;
      box.position.y = 0.8;
      box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.1 }, scene);
      box.checkCollisions = true;
      this._camera.lockedTarget = box;

      const box2 = MeshBuilder.CreateBox("box2", {});    //add box for checking the movement of camera
      box2.position.x = 0;
      box2.position.y = 0.5;
      box2.physicsImpostor = new PhysicsImpostor(box2, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0 }, scene);
      box2.checkCollisions = true;
    
      document.addEventListener("click", ()=>{
        if (box.intersectsMesh(box2, false)) {
          console.log("re");
          box.position.x = -15;
        }
        Animation.CreateAndStartAnimation("", box, "position", 100, 100, box.position, box.position.add(new Vector3(3, 0, 0)), 0);
      });
  }

  private _createSkyBox() {
    var skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
      skyboxMaterial.backFaceCulling = false;
      var skybox = Mesh.CreateBox("skyBox", 1000.0, this._scene);
      skybox.material = skyboxMaterial;		
    }
}


