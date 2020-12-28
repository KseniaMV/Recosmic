import { Engine, Scene, Vector3, Mesh, Color4, HemisphericLight, ArcRotateCamera, Sound, PostProcess, Effect, MeshBuilder, AssetsManager } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";

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

    this._camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), this._scene);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);

    // test models
    const box = MeshBuilder.CreateBox("box", {}, this._scene);
    box.position.y = 0.5;
    box.position.x = 0.5;
    const box2 = MeshBuilder.CreateSphere("box2", {}, this._scene);
    box2.position.y = -0.5;
    box2.position.x = -0.5;

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
    guiMenu.idealHeight = 720;

    const imageRectBg = new Rectangle("mainMenuBackground");
    imageRectBg.width = 1;
    imageRectBg.thickness = 0;
    guiMenu.addControl(imageRectBg);

    const skipBtn = Button.CreateSimpleButton("skip", "SKIP");
    skipBtn.fontFamily = "Arial";
    skipBtn.width = "45px";
    skipBtn.left = "-14px";
    skipBtn.height = "40px";
    skipBtn.color = "white";
    skipBtn.top = "14px";
    skipBtn.thickness = 0;
    skipBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    skipBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
    imageRectBg.addControl(skipBtn);

    skipBtn.onPointerDownObservable.add(() => {
      this.closeScene();
    });

    const music = new Sound("mainMenuMusic", "./assets/sounds/music/pulse.wav", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    this._scene.registerBeforeRender(() => {
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
