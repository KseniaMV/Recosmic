import { Scene, Vector3, Mesh, Color4, Sound, SceneLoader, MeshBuilder, AssetsManager } from "@babylonjs/core";

export class Player {
  private _scene: Scene;
  private _tailAnim;
  private _model;

  constructor(scene: Scene) {
    this._scene = scene;
    SceneLoader.ImportMesh("", "./assets/models/", "test-fox.glb", this._scene, this._setTestModel.bind(this));
  }

  private _setTestModel (newMeshes, particleSystems, skeletons, animationGroups) {
    this._model = newMeshes[0];
    this._model.scaling.scaleInPlace(0.2);

    this._tailAnim = this._scene.getAnimationGroupByName("SwimTale");
    this._tailAnim.start(true, 1.0, this._tailAnim.from, this._tailAnim.to, false);
  }

}
