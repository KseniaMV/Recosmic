import { Engine, Scene, Vector3, Mesh, Color3, Color4, HemisphericLight, ArcRotateCamera, Sound, PostProcess, Animation, BezierCurveEase, CubeTexture, Texture, BackgroundMaterial} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control} from "@babylonjs/gui";
import { Planet } from "../classes/Planet";

export class CutScene {
  private _scene: Scene;
  private _camera: ArcRotateCamera;
  private _transition: boolean = false;
  private _callback;
  private _fadeLevel: number = 1.0;

  constructor(engine: Engine, callback) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._scene.clearColor = new Color4(0, 0, 0, 1);

    this._camera = new ArcRotateCamera("camera", 100, 0.8, 100, Vector3.Zero(), this._scene);
    const light = new HemisphericLight("hemiLight", new Vector3(-40, -80, 10), this._scene);
    light.diffuse = new Color3(1, 1, 1);

    const skybox = Mesh.CreateBox("BackgroundSkybox", 720, this._scene, undefined, Mesh.BACKSIDE);
    
    // Create and tweak the background material.
    const backgroundMaterial = new BackgroundMaterial("backgroundMaterial", this._scene);
    backgroundMaterial.reflectionTexture = new CubeTexture("./assets/images/backgrounds/stars", this._scene);
    backgroundMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
    skybox.material = backgroundMaterial;
    
    // test models
    const ship = Mesh.CreateTorus("torus", 8, 2, 32, this._scene, false);
    ship.position = new Vector3(-100, 10, -20);

    //create planet
    //argumets: scene, url texture, coordinates
    const planet = new Planet(this._scene, "./assets/images/backgrounds/texture.jpg", new Vector3(50, -15, 30));
    planet.createPlanet();

    // Create the ship animation
    const animateShip = new Animation("animationShip", "position", 30, Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CONSTANT);
    let keysBezierShip = [];

    keysBezierShip.push({ frame: 0, value: ship.position });
      keysBezierShip.push({ 
          frame: 150, 
          value: ship.position.add(new Vector3(170, 10, 50)) 
          });
    animateShip.setKeys(keysBezierShip);
    const bezierEase = new BezierCurveEase(0.32, -0.73, 0.69, 1.59);
    animateShip.setEasingFunction(bezierEase);
    ship.animations.push(animateShip);
    this._scene.beginAnimation(ship, 0, 150, true, 0.7);


    //GUI
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    const imageRectBg = new Rectangle("CutSceneBackground");
    imageRectBg.width = 1;
    imageRectBg.thickness = 0;
    guiMenu.addControl(imageRectBg);

    const playBtn = Button.CreateImageWithCenterTextButton(
      "play",
      "PLAY",
      "./assets/images/gui/button2.png"
    );
    playBtn.fontFamily = "Arial";
    playBtn.width = 0.2
    playBtn.height = "70px";
    playBtn.fontWeight = "bold";
    playBtn.color = "rgb(19, 55, 90)";
    playBtn.top = "-25%";
    playBtn.thickness = 0;
    playBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

    setTimeout(() => {
      imageRectBg.addControl(playBtn);
    }, 5000);

    playBtn.onPointerDownObservable.add(() => {
      this.closeScene();
    });

    //sound
    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    this._scene.registerBeforeRender(() => {
      planet._rotatePlanet();               //add planet rotation
      if (this._transition) {
        this._fadeLevel -= .05;
        if (this._fadeLevel <= 0) {
          this._transition = false;
          this._callback();
        }
      }
    });
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

