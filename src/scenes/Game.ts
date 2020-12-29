import { Engine, Scene, Vector3, Mesh, Color4, HemisphericLight, ArcRotateCamera, Sound, PostProcess, Effect, SceneLoader, MeshBuilder, AssetsManager } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";
import { Player } from '../classes/Player';

export class Game {
  private _scene: Scene;
  private _camera: ArcRotateCamera;
  private _transition: boolean;
  private _callback;
  private _fadeLevel: number = 1.0;
  private _player;

  constructor(engine: Engine, callback) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._scene.clearColor = new Color4(0, 0, 0, 1);
    this._camera = new ArcRotateCamera("camera", Math.PI / 3, Math.PI / 3, 3, new Vector3(0, 0, 0), this._scene);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);

    this._player = new Player(this._scene);

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
