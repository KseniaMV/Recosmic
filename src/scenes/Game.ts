import { Engine, Scene, Vector3, Mesh, Sound, PostProcess, ArcRotateCamera, Color3, ShadowGenerator, PointLight, HemisphericLight} from "@babylonjs/core";
import { Player } from '../classes/Player';
import {SkyMaterial} from '@babylonjs/materials/sky/skyMaterial';
import  Environment from '../classes/Environment';

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
  private _shadowGenerator: ShadowGenerator;

  constructor(engine: Engine, callback: any, canvas: any) {
    this._callback = callback;
    this._engine = engine;
    this._canvas = canvas;
    this._scene = new Scene(engine);
    this._scene.collisionsEnabled = true;
    this._scene.gravity = new Vector3(0, -0.98, 0);

    this._camera = new ArcRotateCamera("Camera", 0, 0.8, 200, Vector3.Zero(), this._scene);
    this._camera.setPosition(new Vector3(0, 8, -10));
    this._camera.setTarget(Vector3.Zero());
    this._camera.attachControl(this._canvas);
    this._camera.checkCollisions = true;
    this._camera.collisionRadius = new Vector3(1.5, 1.5, 1.5);
    this._camera.lowerBetaLimit = 0.1;
    this._camera.upperBetaLimit = (Math.PI / 2) * 0.8;
    this._camera.lowerRadiusLimit = 5;
    this._camera.upperRadiusLimit = 18.5;
    this._light = new HemisphericLight("light", new Vector3(-3, 10, 50), this._scene);
   /* this._light = new PointLight("sparklight", new Vector3(0, 20, 0), this._scene);
    this._light.diffuse = new Color3(0.08627450980392157, 0.10980392156862745, 0.15294117647058825);
    this._light.intensity = 35;
    this._light.radius = 30;*/
    
    this._player = new Player(this._scene, new Vector3(0, 0, 0), this._camera);

    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    this.loadScene(this._scene);
    this._createSkyBox();
    /*this._shadowGenerator = new ShadowGenerator(1024, this._light);
    this._shadowGenerator.darkness = 0.4;*/
  }

  loadScene(scene: Scene) {
    const gameScene = new Environment(scene, "../assets/models/", "firstLevel1.glb", "ground");
    gameScene.load("ground");      //ground || asset   
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

  private _createSkyBox() {
    var skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
      skyboxMaterial.backFaceCulling = false;
      var skybox = Mesh.CreateBox("skyBox", 1000.0, this._scene);
      skybox.material = skyboxMaterial;		
    }

}


