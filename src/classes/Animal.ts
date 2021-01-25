import { Ray, Quaternion, ShadowGenerator, Engine, Scene, Vector3, Mesh, Color3, Texture, Color4, Sound, SceneLoader, MeshBuilder, AssetsManager,ActionManager,ExecuteCodeAction } from "@babylonjs/core";
import { FurMaterial } from "@babylonjs/materials";

export class Animal {
  private _scene: Scene;
  private _name: string;
  private _model: Mesh;
  private _cubeMesh: Mesh;
  private _originPosition: Vector3;
  private _idleAnim;
  private _allMeshes: any;
  private _shadowGenerator: ShadowGenerator;
  private _currentAnim: any;
  isDead: any;

  constructor (animal: string, scene: Scene, shadow: ShadowGenerator) {
    this._scene = scene;
    this._shadowGenerator = shadow;
    this._name = animal;
    const file = animal.match(/\[(.*?)\]/)[1] + ".glb";
    SceneLoader.ImportMesh("", "./assets/models/", file, this._scene, this._setModel.bind(this));
  }

  private _setModel (newMeshes, particleSystems, skeletons, animationGroups) {
    this._model = newMeshes[0];
    this._model.scaling.scaleInPlace(0.5);
    this._model.name = this._name;

    if (this._originPosition) {
      this._model.position = this._originPosition;
    }

    this._model.isPickable = true;
    this._model.checkCollisions = true;

    this._allMeshes = this._model.getChildMeshes();

    this._allMeshes.forEach(mesh => {

      if (mesh.name.includes('active_place')) {
        mesh.isVisible = false;
      }

      mesh.isPickable = true;
      mesh.checkCollisions = true;
      this._shadowGenerator.getShadowMap().renderList.push(mesh);
      mesh.receiveShadows = false;
    });

    this._idleAnim = this._scene.getAnimationGroupByName("idle");

    this._currentAnim = this._idleAnim;
    this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);
  }

  public setInfo(position, mesh, isDead) {
    this._originPosition = position;
    this.isDead = isDead;
    this._cubeMesh = mesh;
    if (this._model) {
      this._model.position = this._originPosition;
    }
  }

  public removeModel() {
    this._model.isPickable = false;
    this._model.checkCollisions = false;
    this._model.isVisible = false;
    this._cubeMesh.checkCollisions = false;
    this._cubeMesh.isPickable = false;
    this._cubeMesh.dispose();
    this._allMeshes.forEach(mesh => {
      mesh.isPickable = false;
      mesh.checkCollisions = false;
      mesh.isVisible = false;
    });
    console.log('removed');
  }

  public getName(): string {
    return this._name;
  }
}
