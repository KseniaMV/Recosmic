
import { Ray, ShadowGenerator, PointLight, DirectionalLight, FreeCamera, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess } from "@babylonjs/core";
import { AdvancedDynamicTexture, Rectangle} from "@babylonjs/gui";
import {SkyMaterial} from '@babylonjs/materials/sky/skyMaterial';
import { Player } from '../classes/Player';
import { Environment } from '../classes/Environment';
import { ChoiseBox } from '../ui/ChoiseBox';
import { GameGUI } from '../ui/GameGUI';
import Tablet from "../classes/Tablet";
import { CharacterState } from '../classes/CharacterState';
import { PlayerInfo } from '../classes/PlayerInfo';
import { LoadGame } from '../classes/LoadGame';
import { Animal } from '../classes/Animal';
import { ChoiseBoxTree } from "../ui/ChoiseBoxTree";

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
  private _killedAnimals;
  private _skybox;
  private _animals;
  private _callbackToChangeScene;
  private _currentEnemy: string;
  private _canvas: any;
  private _inventory;
  private  _tablet: Tablet;
  private _characterState: CharacterState;
  private _choiseBox: any;
  private _choiseBox2: ChoiseBox;
  private _incrementHealth: boolean = false;
  private _incrementHealthAllow: boolean = true;
  private _isEnd: boolean = false;

  constructor(engine: Engine, callback, canvas) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._canvas = canvas;
    this._scene.clearColor = new Color4(0, 0, 0, 1);
    this._camera = new ArcRotateCamera("camera", (Math.PI / 3), (Math.PI / 3), 3*3, new Vector3(10, 10, 0), this._scene);

    this._animals = [];
    this._killedAnimals = [];
    this._reseached = [];

    this._choiseBox = new ChoiseBoxTree(this._scene, this._actionAfterChose.bind(this));
    this._choiseBox2 = new ChoiseBox(this._scene, this._actionAfterChose2.bind(this));

    this._gameGUI = new GameGUI();

    this._createSkyBox();

    const sun = new PointLight('Omni0', new Vector3(0, 50, -20), this._scene);
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 1, 1);
    //sun.intensity = 10;

    // shadow
    var light2 = new DirectionalLight("dir01", new Vector3(0, -7, -1), this._scene);
    light2.position = new Vector3(0, 50, 30);

    light2.diffuse = new Color3(1, 1, 1);
	  light2.specular = new Color3(0.9, 0.7, 0.9);
    light2.intensity = 3.5;

    this._shadowGenerator = new ShadowGenerator(1024, light2);
    this._shadowGenerator.usePoissonSampling = true;
    this._shadowGenerator.useBlurExponentialShadowMap = true;
    this._shadowGenerator.blurKernel = 32;
    this._shadowGenerator.blurBoxOffset = 1;
    this._shadowGenerator.blurScale = 1.0;
    this._shadowGenerator.setDarkness(0.3);


    this._environment = new Environment(this._scene, this._shadowGenerator);
    this._environment.setActionAfterLoaded(this.setToStartPosition.bind(this));

    this._player = new Player(this._scene, this._shadowGenerator);
    this._player.setCollisionCallback(this._checkCollisions.bind(this));

    // CharacterState test
    /*window.addEventListener('click',(function(){
      this._player.setHealth(this._player.getHealth() - 5);
      this._player.setKarma(this._player.getKarma() + 5);
      this._updateState();
    }).bind(this));*/

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

    canvas.onclick = null;
    document.exitPointerLock();
  }

  private createUI () {
    this._characterState = new CharacterState(this._scene);
    this._tablet = new Tablet(this._scene, this._canvas);
    this._tablet.setExitFunc(this._callback.bind(this));
  }

  public setCallbackToChangeScene(func) {
    this._callbackToChangeScene = func;
  }

  private _healing() {
    if (Number.parseInt(this._player.getHealth()) >= 100) {
      this._incrementHealth = false;
    } else {
      this._incrementHealth = true;
      this._player.setHealth(Number.parseInt(this._player.getHealth()) + 5);
      this._updateState();
    }
    if (this._incrementHealth) {
      setTimeout(this._healing.bind(this), 5000);
    }
  }

  private _funcForTablet(str: string) {
    if (str === 'open') {
      this._characterState.block(true);
    } else {
      this._characterState.block(false);
    }
    console.log('This is from Tablet: ' + str);
  }

  public setSavedGame(info: PlayerInfo) {
    if (Number.parseInt(info.getHealth()) > 0) {
      this._savedGame = info;
    } else {
      info = LoadGame.load();
    }

    this._animals.forEach(animal => {
      const regName = animal.getName().match(/\[(.*?)\]/);
      if (regName) {
        const cname = regName[1];
        const killedAnimals = info.getKilled();
        if (killedAnimals) {
          if (info.getKilled().includes(cname)) {
            this._killedAnimals.push(cname);
            animal.removeModel();
          }
        }
      }
    });

    this._player.setHealth(Number.parseInt(info.getHealth()));
    this._player.setKarma(Number.parseInt(info.getKarma()));
    this._player.setLookAtAngle(Number.parseFloat(info.getLookAtAngle()));
    const x = Number.parseFloat(info.getPosition()[0]);
    const y = Number.parseFloat(info.getPosition()[1]);
    const z = Number.parseFloat(info.getPosition()[2]);
    this._player.setOriginPosition(new Vector3(x, y, z));
    //this._killedAnimals = info.getKilled();
    this._updateState();
    this._healing();
  }

  private _updateState() {
    this._characterState.setHP(this._player.getHealth());
    this._characterState.setCarma(this._player.getKarma());
  }

  private _createAnimals() {
    console.log('creating animals...');
    const animalPositions = this._environment.getAnimals();
    animalPositions.forEach(item => {
      const animal = new Animal(item.name, this._scene, this._shadowGenerator);
      animal.setInfo(item.position, item.mesh, item.isDead);
      this._animals.push(animal);
    });

    // save start
    if (!LoadGame.load().getCheckpoint()) {
      const info = this._createInfo();
      info.setCheckpoint(false);
      LoadGame.save(info);
    }
  }

  private _actionAfterChose(name: string, action: string) {         
    console.log(`${name}`);
    if (action === 'get') {
      const info = new PlayerInfo();
      const treeName = name.match(/{(.*?)}/)[1];
      info.setPlanetItemToLocalStorage(treeName);
    }
  }

  private _actionAfterChose2(name: string, action: string) {
    if (action === 'attack') {
      console.log('go to battle scene');

      const info = new PlayerInfo();
      info.setMap('firstLevel');
      info.setPosition([
        this._player.getMesh().position.x,
        this._player.getMesh().position.y,
        this._player.getMesh().position.z
      ]);
      info.setPlanetItemToLocalStorage(name.match(/\[(.*?)\]/)[1]);
      info.setHealth(this._player.getHealth());
      info.setKarma(this._player.getKarma());
      info.setLookAtAngle(this._player.getLookAtAngle());
      info.setEnemyName(name.match(/\[(.*?)\]/)[1]);
      info.setKilled(this._killedAnimals);

      this._incrementHealth = false;

      this._callbackToChangeScene(info);
    }
  }

  private _checkCollisions(name) {
    if (name.includes('laboratory')) {
      if (!this._isEnd) {
        this._isEnd = true;
        this._gameGUI.showDemoText();

        setTimeout(() => {
          this._gameGUI.hideDemoText();
        }, 5000);

        setTimeout(() => {
          this._isEnd = false;
        }, 6000);
      }
    }

    //console.log(name);
    if (!this._choiseBox.getIsChose() && name.includes('active_tree')) {
      this._choiseBox.setShow(true, name);
      this._environment.addMeshToHighlight(name);
    } else {
      this._environment.removeMeshToHighlight(name);
      this._choiseBox.setShow(false);
      if (this._choiseBox.getIsChose()) {
        setTimeout(() => {
            this._choiseBox.setIsChose(false);
        }, 5000);
      }
    }

    if (!this._choiseBox2.getIsChose() && name.includes('animal')) {
      const regName = name.match(/\[(.*?)\]/);
      if (regName) {
        this._currentEnemy = regName[1];
      }
      this._choiseBox2.setShow(true, name);
      //this._environment.addMeshToHighlight(name);
    } else {
      //this._environment.removeMeshToHighlight(name);
      this._choiseBox2.setShow(false);
      if (this._choiseBox2.getIsChose()) {
        setTimeout(() => {
            this._choiseBox2.setIsChose(false);
        }, 5000);
      }
    }

    if (name.includes('savestation')) {
      if (!this._isSaved) {
        this._isSaved = true;
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
        info.setKilled(this._killedAnimals);
        info.setCheckpoint(true);
        LoadGame.save(info);

        this._gameGUI.showSaveText();

        setTimeout(this._gameGUI.hideSaveText.bind(this._gameGUI), 3000);

        setTimeout(() => {
          this._isSaved = false;
        }, 5000);
      }
    }
  }

  setToStartPosition() {
    this._player.setOriginPosition(this._environment.getPlayerPoint());
    this._createAnimals();
    this._environment.addToWaterRender(this._skybox);
    this._player.getMesh().getChildMeshes().forEach(mesh => {
        this._environment.addToWaterRender(mesh);
    });
  }


  private _createSkyBox() {
      this._skybox = Mesh.CreateBox("skyBox", 5000.0, this._scene);
      const skyboxMaterial = new SkyMaterial("skyBox", this._scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.turbidity = 20;
      skyboxMaterial.luminance = 0.1;
      skyboxMaterial.rayleigh = 0;
      this._skybox.material = skyboxMaterial;
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
