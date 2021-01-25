import { Engine, Scene, Vector3, Color4, FreeCamera, Sound, PostProcess } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";
import { PlayerInfo } from "../classes/PlayerInfo";
import { LoadGame } from "../classes/LoadGame";

export class MainMenu {
  private _scene: Scene;
  private _transition: boolean;
  private _callback;
  private _callback2;
  private _currentCallback;
  private _info;

  constructor(engine: Engine, callback, callback2) {
    this._callback = callback;
    this._callback2 = callback2;
    this._scene = new Scene(engine);
    this._scene.clearColor = new Color4(0, 0, 0, 1);

    let camera = new FreeCamera("camera1", new Vector3(0, 0, 0), this._scene);
    camera.setTarget(Vector3.Zero());

    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    const sfxClick = new Sound("selection", "./assets/sounds/effects/click.wav", this._scene, null);

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
    startBtn.fontFamily = "Arial";
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

    // load game
    const loadBtn = Button.CreateImageWithCenterTextButton(
      "load",
      "LOAD GAME",
      "./assets/images/gui/button2.png"
    );
    loadBtn.fontFamily = "Arial";
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


    let fadeLevel = 1.0;
    this._transition = false;
    this._scene.registerBeforeRender(() => {
      if (this._transition) {
        fadeLevel -= .05;
        if (fadeLevel <= 0) {
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

      const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
      postProcess.onApply = (effect) => {
        effect.setFloat("fadeLevel", fadeLevel);
      };

      this._transition = true;

      sfxClick.play();
      music.stop();

      this._scene.detachControl();
    });

    loadBtn.onPointerDownObservable.add(() => {
      if (localStorage.getItem("health")) {
        this._info = LoadGame.load();

        this._currentCallback = callback2;

        const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
        postProcess.onApply = (effect) => {
          effect.setFloat("fadeLevel", fadeLevel);
        };

        this._transition = true;

        sfxClick.play();
        music.stop();

        this._scene.detachControl();
      }
    });
  }

  getScene() {
    return this._scene;
  }
}
