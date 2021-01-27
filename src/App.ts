import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, Effect } from "@babylonjs/core";
import { MainMenu } from "./scenes/MainMenu";
import { CutScene } from "./scenes/CutScene";
import { Game } from "./scenes/Game";
import { Story } from "./scenes/Story";
import { PlayerInfo } from "./classes/PlayerInfo";
import { Battle } from "./scenes/Battle";

export class App {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;

  constructor() {
    this._canvas = <HTMLCanvasElement> this._createCanvas();
    this._engine = new Engine(this._canvas, true);
    this._createShader();
    this._main();
  }

  private _createCanvas(): HTMLCanvasElement {
    const canvas = <HTMLCanvasElement> document.createElement('canvas');
    canvas.classList.add('renderCanvas');
    document.body.appendChild(canvas);
    return canvas;
  }

  private _createShader() {
    Effect.RegisterShader("fade",
      "precision highp float;" +
      "varying vec2 vUV;" +
      "uniform sampler2D textureSampler; " +
      "uniform float fadeLevel; " +
      "void main(void){" +
      "vec4 baseColor = texture2D(textureSampler, vUV) * fadeLevel;" +
      "baseColor.a = 1.0;" +
      "gl_FragColor = baseColor;" +
      "}");
  }

  private async _main(): Promise<void> {
    await this._goToStart();

    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  private async _goToScene(scene: Scene): Promise<void> {
    this._engine.displayLoadingUI();

    if (this._scene) {
      this._scene.detachControl();
    }

    await scene.whenReadyAsync();
    this._engine.hideLoadingUI();

    if (this._scene) {
      this._scene.dispose();
    }
    
    this._scene = scene;
  }

  private _goToStory() {
    Story.getVideo('./assets/video/story.mp4', this._goToCutScene.bind(this))
  }

  private async _goToStart(): Promise<void> {
    const scene = new MainMenu(this._engine, this._goToStory.bind(this), this._goToGameScene.bind(this)).getScene();
    await this._goToScene(scene);
  }

  private async _goToCutScene(): Promise<void> {
    const scene = new CutScene(this._engine, this._goToGameScene.bind(this)).getScene();
    await this._goToScene(scene);
  }

  private async _goToGameScene(info: PlayerInfo): Promise<void> {
    const game = new Game(this._engine, this._goToStart.bind(this), this._canvas);
    const scene = game.getScene();
    await this._goToScene(scene);
    game.setSavedGame(info);
    game.setCallbackToChangeScene(this._goToBattleScene.bind(this));
  }

  private async _goToBattleScene(info: PlayerInfo): Promise<void> {
    const battle = new Battle(this._engine, this._canvas, this._goToGameScene.bind(this));
    const scene = battle.getScene();
    await this._goToScene(scene);
    battle.setInfoGame(info);
  }
}
