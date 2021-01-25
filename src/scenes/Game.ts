import { Ray, ShadowGenerator, PointLight, DirectionalLight, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {SkyMaterial} from '@babylonjs/materials/sky/skyMaterial';
import { Player } from '../classes/Player';
import { Environment } from '../classes/Environment';
import { ChoiseBox } from '../ui/ChoiseBox';
import Tablet from "../classes/Tablet";
import { CharacterState } from '../classes/CharacterState';

export class Game {
  private _scene: Scene;
  private _camera: ArcRotateCamera;
  private _transition: boolean;
  private _callback;
  private _fadeLevel: number = 1.0;
  private _player;
  private _environment;
  private _shadowGenerator;
  private _canvas: any;
  private _inventory;
  private  _tablet: Tablet;
  private _characterState: CharacterState;
  private _choiseBox: any;

  constructor(engine: Engine, callback, canvas) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._canvas = canvas;
    this._scene.clearColor = new Color4(0, 0, 0, 1);
    this._camera = new ArcRotateCamera("camera", (Math.PI / 3), (Math.PI / 3), 3*3, new Vector3(10, 10, 0), this._scene);

    this._choiseBox = new ChoiseBox(this._scene, this._actionAfterChose.bind(this));

    this._createSkyBox();

    const sun = new PointLight('Omni0', new Vector3(0, 50, -20), this._scene);
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 1, 1);
    //sun.intensity = 10;

    // shadow
    var light2 = new DirectionalLight("dir01", new Vector3(0, -1, -1), this._scene);
    light2.position = new Vector3(0, 20, 30);

    light2.diffuse = new Color3(1, 1, 1);
	  light2.specular = new Color3(1, 1, 1);
    light2.intensity = 3.5;

    this._shadowGenerator = new ShadowGenerator(512, light2);
    this._shadowGenerator.usePoissonSampling = true;


    this._scene.gravity = new Vector3(0, -0.15, 0);
    this._scene.collisionsEnabled = true;

    this._environment = new Environment(this._scene, this._shadowGenerator);
    this._environment.setActionAfterLoaded(this.setToStartPosition.bind(this));

    this._player = new Player(this._scene, this._shadowGenerator);
    this._player.setCollisionCallback(this._checkCollisions.bind(this));

    // CharacterState test
    window.addEventListener('click',(function(){
      this._characterState.downHP();
      this._characterState.upCarma();
    }).bind(this));


    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    const imageRectBg = new Rectangle("mainMenuBackground");
    imageRectBg.width = 1;
    imageRectBg.thickness = 0;
    guiMenu.addControl(imageRectBg);

    this._transition = false;

    this._scene.registerBeforeRender(() => {
      if (this._transition) {
        this._fadeLevel -= .05;
        if (this._fadeLevel <= 0) {
          this._transition = false;
          this._callback();
        }
      }

      this._player.update();

    });
    this.createUI();
  }

  private createUI () {
    this._characterState = new CharacterState(this._scene);
    this._tablet = new Tablet(this._scene, this._canvas);
  }

  private _actionAfterChose(object: string, action: string) {
    console.log(`${object} --- ${action}`);
  }

  private _checkCollisions(name) {
    //console.log(name);
    if (!this._choiseBox.getIsChose() && name.includes('active_tree')) {
      this._choiseBox.setShow(true, name);
    } else {
      this._choiseBox.setShow(false);
      if (this._choiseBox.getIsChose()) {
        setTimeout(() => {
            this._choiseBox.setIsChose(false);
        }, 5000);
      }
    }
  }

  setToStartPosition() {
    this._player.setOriginPosition(this._environment.getPlayerPoint());
  }


  private _createSkyBox() {
    var skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
      skyboxMaterial.backFaceCulling = false;
      var skybox = Mesh.CreateBox("skyBox", 1000.0, this._scene);
      skybox.material = skyboxMaterial;
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

  public checkOpenUI(flag:boolean) {
    if(flag === true ) {
      this._characterState.removeHoverEffect();
    }
  }

}
