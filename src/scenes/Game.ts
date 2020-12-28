import { Engine, Scene, Vector3, Mesh, Color3, Color4, ShadowGenerator, GlowLayer, HemisphericLight, ArcRotateCamera, CubeTexture, Sound, PostProcess, Effect, SceneLoader, Matrix, MeshBuilder, Quaternion, AssetsManager } from "@babylonjs/core";
import { AdvancedDynamicTexture, StackPanel, Button, TextBlock, Rectangle, Control, Image } from "@babylonjs/gui";

export class Game {
  private _scene: Scene;
  private _camera: ArcRotateCamera;
  private _transition: boolean;
  private _callback;
  private _fadeLevel: number = 1.0;

  constructor(engine: Engine, callback) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._scene.clearColor = new Color4(0, 0, 0, 1);
    this._camera = new ArcRotateCamera("camera", Math.PI / 3, Math.PI / 3, 3, new Vector3(0, 0, 0), this._scene);
    const light = new HemisphericLight("light", new Vector3(0, 1, 0), this._scene);

    SceneLoader.ImportMesh("", "./assets/models/", "test-fox.glb", this._scene, function (newMeshes, particleSystems, skeletons, animationGroups) {
        var testFox = newMeshes[0];
        testFox.scaling.scaleInPlace(0.2);

        this._camera.target = testFox;

        const tailAnim = this._scene.getAnimationGroupByName("SwimTale");
        tailAnim.start(true, 1.0, tailAnim.from, tailAnim.to, false);
      });

      const music = new Sound("mainMenuMusic", "./assets/music/pulse.wav", this._scene, null, {
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
