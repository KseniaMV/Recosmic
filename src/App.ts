import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, Effect } from "@babylonjs/core";
import { MainMenu } from "./scenes/MainMenu";
import { CutScene } from "./scenes/CutScene";
import { Game } from "./scenes/Game";
import { Story } from "./scenes/Story";
import { PlayerInfo } from "./classes/PlayerInfo";

enum State { START = 0, GAME = 1, CUTSCENE = 3, STORY = 4 };

export class App {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _engine: Engine;
  private _state: number = 0;

  constructor() {
    this._canvas = <HTMLCanvasElement> document.createElement('canvas');
    this._canvas.classList.add('renderCanvas');
    document.body.appendChild(this._canvas);
    this._engine = new Engine(this._canvas, true);
    this._engine.loadingUIText = "Loading...";
    this._scene = new Scene(this._engine);

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

    this._main();
  }

  private async _main(): Promise<void> {
    await this._goToStart();
    //await this._goToGameScene();
    this._engine.runRenderLoop(() => {
      this._scene.render();
    });

    window.addEventListener('resize', () => {
      this._engine.resize();
    });
  }

  private async _goToScene(state: State, scene: Scene): Promise<void> {
    this._engine.displayLoadingUI();
    this._scene.detachControl();
    await scene.whenReadyAsync();
    this._engine.hideLoadingUI();
    this._scene.dispose();
    this._scene = scene;
    this._state = state;
  }

  private _goToStory() {
    Story.getVideo('./assets/video/story.mp4', this._goToCutScene.bind(this))
  }

  private async _goToStart(): Promise<void> {
    const scene = new MainMenu(this._engine, this._goToStory.bind(this), this._goToGameScene.bind(this)).getScene();
    await this._goToScene(State.START, scene);
  }

  private async _goToCutScene(): Promise<void> {
    const scene = new CutScene(this._engine, this._goToGameScene.bind(this)).getScene();
    await this._goToScene(State.CUTSCENE, scene);
  }

  private async _goToGameScene(info: PlayerInfo): Promise<void> {
    const game = new Game(this._engine, null, this._canvas);
    const scene = game.getScene();
    await this._goToScene(State.GAME, scene);
    game.setSavedGame(info);
  }
}
