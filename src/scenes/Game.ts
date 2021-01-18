import { Quests } from './../classes/Quests';
import { Ray, ShadowGenerator, PointLight, DirectionalLight, FreeCamera, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {SkyMaterial} from '@babylonjs/materials/sky/skyMaterial';
import { Player } from '../classes/Player';
import { Environment } from '../classes/Environment';
import { ChoiseBox } from '../ui/ChoiseBox';
import Inventory from '../classes/Inventory';
import Tablet from "../classes/Tablet";
import { CharacterState } from '../classes/CharacterState';
import { PlayerInfo } from '../classes/PlayerInfo';
import { LoadGame } from '../classes/LoadGame';

export class Game {
  private _scene: Scene;
  private _camera: any;
  private _transition: boolean;
  private _callback;
  private _fadeLevel: number = 1.0;
  private _player;
  private _environment;
  private _shadowGenerator;
  private _savedGame: PlayerInfo;
  private _canvas: any;
  private _inventory;
  private _tablet: Tablet;
  public quests: Quests;
  private _characterState: CharacterState;

  constructor(engine: Engine, callback, canvas) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._canvas = canvas;
    this._scene.clearColor = new Color4(0, 0, 0, 1);
    this._camera = new ArcRotateCamera("camera", (Math.PI / 3), (Math.PI / 3), 3*3, new Vector3(10, 10, 0), this._scene);

    this._choiseBox = new ChoiseBox(this._scene, this._actionAfterChose.bind(this));

    //this._createSkyBox();

    const sun = new PointLight('Omni0', new Vector3(0, 50, -20), this._scene);
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 1, 1);

    // shadow
    var light2 = new DirectionalLight("dir01", new Vector3(0, -7, -1), this._scene);
    light2.position = new Vector3(0, 50, 30);

    light2.diffuse = new Color3(1, 1, 1);
	   light2.specular = new Color3(0.7, 0.7, 0.9);
     //light2.intensity = 10;

    this._shadowGenerator = new ShadowGenerator(1024, light2);
    this._shadowGenerator.usePoissonSampling = true;

    // for fps camera
    this._scene.gravity = new Vector3(0, -0.9, 0);
    this._scene.collisionsEnabled = true;

    // fps camera
    this._camera = new FreeCamera("FreeCamera", new Vector3(2, 5, 2), this._scene);
    this._camera.attachControl(canvas, true);
    this._camera.checkCollisions = true;
    this._camera.applyGravity = true;
    this._camera.ellipsoid = new Vector3(1, 2, 1);


    this._environment = new Environment(this._scene, this._shadowGenerator);
    this._environment.setActionAfterLoaded(this.setToStartPosition.bind(this));

    this._player = new Player(this._scene, this._shadowGenerator);
    this._player.setCollisionCallback(this._checkCollisions.bind(this));

    //GUI
    this._inventory = new Inventory(this._scene, this._canvas);
    this._tablet = new Tablet(this._scene, this._canvas);
    this.quests = new Quests(this._scene, this._canvas);
    this._characterState = new CharacterState(this._scene);
    // CharacterState test
    window.addEventListener('click',(function(){
      this._player.setHealth(this._player.getHealth() - 5);
      this._player.setKarma(this._player.getKarma() + 5);
      this._updateState();
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


    // test autosave
    /*setTimeout(() => {
      const info = new PlayerInfo();
      info.setMap('firstLevel');
      info.setPosition(JSON.stringify([
        this._player.getMesh().position.x,
        this._player.getMesh().position.y,
        this._player.getMesh().position.z
      ]));
      info.setHealth(this._player.getHealth());
      info.setKarma(this._player.getKarma());
      info.setLookAtAngle(this._player.getLookAtAngle());
      LoadGame.save(info);
    }, 15000);*/

  }

  public setSavedGame(info: PlayerInfo) {
    this._savedGame = info;
    if (this._savedGame) {
      this._player.setHealth(Number.parseInt(info.getHealth()));
      this._player.setKarma(Number.parseInt(info.getKarma()));
      this._player.setLookAtAngle(Number.parseFloat(info.getLookAtAngle()));
      const [ x, y, z ] = info.getPosition();
      this._player.setOriginPosition(new Vector3(x, y, z));
      this._updateState();
    }
  }

  private _updateState() {
    this._characterState.setHP(this._player.getHealth());
    this._characterState.setCarma(this._player.getKarma());
    console.log(this._player.getKarma());
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

    if (name.includes('savestation')) {
      this._environment.startSaveParticles();

      const info = new PlayerInfo();
      info.setMap('firstLevel');
      info.setPosition(JSON.stringify([
        this._player.getMesh().position.x,
        this._player.getMesh().position.y,
        this._player.getMesh().position.z
      ]));
      info.setHealth(this._player.getHealth());
      info.setKarma(this._player.getKarma());
      info.setLookAtAngle(this._player.getLookAtAngle());
      LoadGame.save(info);
    }
  }

  setToStartPosition() {
    this._player.setOriginPosition(this._environment.getPlayerPoint());
  }


  private _createSkyBox() {
    var skyboxMaterial = new SkyMaterial("skyMaterial", this._scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.diffuseColor = new Color3(1,1,1);
      var skybox = Mesh.CreateBox("skyBox", 300.0, this._scene);
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

}
