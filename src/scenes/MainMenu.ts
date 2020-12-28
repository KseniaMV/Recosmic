import { Engine, Scene, Vector3, Mesh, Color4, FreeCamera, Sound, PostProcess, Effect, AssetsManager } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";

export class MainMenu {
  private _scene: Scene;
  private _transition: boolean;
  private _callback;

  constructor(engine: Engine, callback) {
    this._callback = callback;
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

    const startbg = new Image("startbg", "./assets/images/backgrounds/main_menu_bg.jpg");
    imageRectBg.addControl(startbg);

    const logo = new Image("logo", "./assets/images/gui/logo.png");
    logo.width = 0.5;
    logo.height = 0.3;
    logo.top = "-20%";
    imageRectBg.addControl(logo);

    const startBtn = Button.CreateImageWithCenterTextButton(
      "start",
      "START GAME",
      "./assets/images/gui/button.png"
    );

    startBtn.fontFamily = "Arial";
    startBtn.width = 0.2
    startBtn.height = "70px";
    startBtn.color = "white";
    startBtn.top = "-25%";
    startBtn.thickness = 0;
    startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    imageRectBg.addControl(startBtn);

    let fadeLevel = 1.0;
    this._transition = false;
    this._scene.registerBeforeRender(() => {
      if (this._transition) {
        fadeLevel -= .05;
        if (fadeLevel <= 0) {
          this._transition = false;
          this._callback();
        }
      }
    });

    startBtn.onPointerDownObservable.add(() => {
      const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, camera);
      postProcess.onApply = (effect) => {
        effect.setFloat("fadeLevel", fadeLevel);
      };

      this._transition = true;

      sfxClick.play();
      music.stop();

      this._scene.detachControl();
    });
  }

  getScene() {
    return this._scene;
  }
}
