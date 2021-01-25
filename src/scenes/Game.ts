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
import { Animal } from '../classes/Animal';

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
  public   tablet: Tablet;
  public quests: Quests;
  public characterState: CharacterState;
  private _choiseBox: any;

  constructor(engine: Engine, callback, canvas) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._canvas = canvas;
    this._scene.clearColor = new Color4(0, 0, 0, 1);
    this._camera = new ArcRotateCamera("camera", (Math.PI / 3), (Math.PI / 3), 3*3, new Vector3(10, 10, 0), this._scene);

    this._animals = [];
    this._killedAnimals = [];

    this._choiseBox = new ChoiseBox(this._scene, this._actionAfterChose.bind(this));
    this._choiseBox2 = new ChoiseBox(this._scene, this._actionAfterChose2.bind(this));

    this._createSkyBox();

    const sun = new PointLight('Omni0', new Vector3(0, 50, -20), this._scene);
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 1, 1);

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

    //GUI
    this._inventory = new Inventory(this._scene, this._canvas);
    this._tablet = new Tablet(this._scene, this._canvas);
    this.quests = new Quests(this._scene, this._canvas);
    this._characterState = new CharacterState(this._scene);

    // set callback to tablet
    this._tablet.setCallback(this._funcForTablet.bind(this));

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

    canvas.onclick = null;
  }

  public setCallbackToChangeScene(func) {
    this._callbackToChangeScene = func;
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
    console.log(info.getKilled())
    if (Number.parseInt(info.getHealth()) > 0) {
      this._savedGame = info;
    } else {
      info = LoadGame.load();
    }
    
    this._animals.forEach(animal => {
      const regName = animal.getName().match(/\[(.*?)\]/);
      if (regName) {
        const cname = regName[1];
        if (info.getKilled().includes(cname)) {
          console.log('need to remove animal');
          this._killedAnimals.push(cname);
          animal.removeModel();
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
  }

  private _actionAfterChose(name: string, action: string) {
    console.log(`${name} --- ${action}`);
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
      info.setHealth(this._player.getHealth());
      info.setKarma(this._player.getKarma());
      info.setLookAtAngle(this._player.getLookAtAngle());
      info.setEnemyName(name.match(/\[(.*?)\]/)[1]);
      info.setKilled(this._killedAnimals);
      this._callbackToChangeScene(info);
    }
  }

  private _checkCollisions(name) {
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
      LoadGame.save(info);
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
      /*this._skybox = Mesh.CreateBox("skyBox", 5000.0, this._scene);
      const skyboxMaterial = new StandardMaterial("skyBox", this._scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new CubeTexture("./assets/textures/TropicalSunnyDay_nx.jpg", this._scene);
      skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
      skyboxMaterial.specularColor = new Color3(0, 0, 0);
      skyboxMaterial.disableLighting = true;
      this._skybox.material = skyboxMaterial;*/
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

  public checkOpenUI(flag:boolean) {
    if(flag === true ) {
      this.characterState.removeHoverEffect();
    }
  }

}
