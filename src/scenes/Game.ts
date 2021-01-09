import { Engine, Scene, Vector3, Mesh, Color4, HemisphericLight, Sound, PostProcess, MeshBuilder,  StandardMaterial, FollowCamera, Animation, Texture, SceneLoader, CannonJSPlugin, ArcRotateCamera, PhysicsImpostor, UniversalCamera} from "@babylonjs/core";
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

  constructor(engine: Engine, callback: any, canvas: any) {
    this._callback = callback;
    this._engine = engine;
    this._canvas = canvas;
    this._scene = new Scene(engine);
    this._scene.gravity = new Vector3(0, -0.15, 0);
    this._scene.collisionsEnabled = true;


    this._camera = new ArcRotateCamera("Camera", 0, 0, 10, new Vector3(0, 0, 0), this._scene);
    this._camera.setPosition(new Vector3(0, 12, -10));

    this._light = new HemisphericLight("light", new Vector3(-3, 10, 50), this._scene);
    this._camera.setTarget(Vector3.Zero());
    this._camera.attachControl(this._canvas);
    this._camera.checkCollisions = true;
    this._camera.collisionRadius = new Vector3(1.5, 1.5, 1.5);

    //this._player = new Player(this._scene);

    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });
    this.loadScene(this._scene);
    this.loadPhisics(this._scene);
    this._setCamera();
    this._createSkyBox();
  }

  loadScene(scene: Scene) {
    SceneLoader.Append("scenes/", "planet.babylon", scene, function (meshes) {
        //scene.createDefaultCameraOrLight(true, true, true);
        //scene.createDefaultEnvironment();       
    });
  }

  loadPhisics(scene: Scene) {
      var gravityVector = new Vector3(0, 0, 0);
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

  private _setCamera() {
    const box = MeshBuilder.CreateBox("box", {});    //add box for checking the movement of camera
    box.position.x = -15;
    box.position.y = 0.5;
    box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this._scene);
    box.checkCollisions = true;
    document.addEventListener("click", ()=>{
      Animation.CreateAndStartAnimation("anim", box, "position", 100, 100, box.position, box.position.add(new Vector3(3, 0, 0)), 0);
    });
    this._camera.lockedTarget = box;
  }

  private _createSkyBox() {
    var skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
      skyboxMaterial.backFaceCulling = false;
      var skybox = Mesh.CreateBox("skyBox", 1000.0, this._scene);
      skybox.material = skyboxMaterial;		
    }
}
