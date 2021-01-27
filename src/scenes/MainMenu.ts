import { Engine, Scene, Vector3, Color4, FreeCamera, Sound, PostProcess } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";
import { PlayerInfo } from "../classes/PlayerInfo";
import { LoadGame } from "../classes/LoadGame";

export class MainMenu {
  private _scene: Scene;
  private _camera: FreeCamera;
  private _transition: boolean;
  private _fadeLevel: number = 1.0;
  private _music: Sound;
  private _sfxClick: Sound;
  private _callback: Function;
  private _callback2: Function;
  private _currentCallback: Function;
  private _info: PlayerInfo;

  constructor(engine: Engine, callback, callback2) {
    this._callback = callback;
    this._callback2 = callback2;
    this._scene = new Scene(engine);
    this._scene.clearColor = new Color4(0, 0, 0, 1);

    this._camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this._scene);
    this._camera.setTarget(Vector3.Zero());

    this._music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    this._sfxClick = new Sound("selection", "./assets/sounds/effects/click.wav", this._scene, null);

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    const imageRectBg = new Rectangle("mainMenuBackground");
    imageRectBg.width = 1;
    imageRectBg.thickness = 0;
    guiMenu.addControl(imageRectBg);

    const startbg = new Image("startbg", "./assets/images/backgrounds/main_menu_bg2.png");
    imageRectBg.addControl(startbg);

    const logo = new Image("logo", "./assets/images/gui/logo.png");
    logo.width = 0.5;
    logo.height = 0.3;
    logo.top = "10%";
    logo.left = "-25%";
    imageRectBg.addControl(logo);

    const startBtn = Button.CreateImageWithCenterTextButton(
      "start",
      "START GAME",
      "./assets/images/gui/button2.png"
    );
    startBtn.fontFamily =  "Cabin";
    startBtn.width = "250px"
    startBtn.height = "70px";
    startBtn.color = "rgb(19, 55, 90)";
    startBtn.fontWeight = "bold";
    startBtn.top = "82%";
    startBtn.left = "-25%";
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    startBtn.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    imageRectBg.addControl(startBtn);

    const loadBtn = Button.CreateImageWithCenterTextButton(
      "load",
      "LOAD GAME",
      "./assets/images/gui/button2.png"
    );
    loadBtn.fontFamily =  "Cabin";
    loadBtn.width = "250px"
    loadBtn.height = "70px";
    loadBtn.color = "rgb(19, 55, 90)";
    loadBtn.fontWeight = "bold";
    loadBtn.top = "70%";
    loadBtn.left = "-25%";
    loadBtn.thickness = 0;
    loadBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    loadBtn.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    imageRectBg.addControl(loadBtn);

    this._transition = false;
    this._scene.registerBeforeRender(() => {
      if (this._transition) {
        this._fadeLevel -= .05;
        if (this._fadeLevel <= 0) {
          this._transition = false;

          if (this._info) {
            this._currentCallback(this._info);
          } else {
            this._currentCallback();
          }
        }
      }
    });

    startBtn.onPointerDownObservable.add(() => {
      this._info = null;
      this._currentCallback = callback;
      localStorage.clear();
      this._closeScene();
    });

    loadBtn.onPointerDownObservable.add(() => {
      if (JSON.parse(localStorage.getItem("checkpoint"))) {
        this._info = LoadGame.load();
        this._currentCallback = callback2;
        this._closeScene();
      }
    });
  }

  private _closeScene() {
    const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this._camera);
    postProcess.onApply = (effect) => {
      effect.setFloat("fadeLevel", this._fadeLevel);
    };

    this._transition = true;

    this._sfxClick.play();
    this._music.stop();
  }

  public getScene() {
    return this._scene;
  }
}
