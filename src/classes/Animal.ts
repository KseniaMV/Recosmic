import { Ray, Quaternion, ShadowGenerator, Engine, Scene, Vector3, Mesh, Color3, Texture, Color4, Sound, SceneLoader, MeshBuilder, AssetsManager,ActionManager,ExecuteCodeAction } from "@babylonjs/core";
import { FurMaterial } from "@babylonjs/materials";

export class Animal {
  private _scene: Scene;
  private _name: string;
  private _model: Mesh;
  private _originPosition: Vector3;
  private _idleAnim;

  constructor (animal: string, scene: Scene, shadow: ShadowGenerator) {
    this._scene = scene;
    this._shadowGenerator = shadow;
    this._name = animal;

    const file = animal + ".glb";
    SceneLoader.ImportMesh("", "./assets/models/", file, this._scene, this._setModel.bind(this));
  }

  private _setModel (newMeshes, particleSystems, skeletons, animationGroups) {
    this._model = newMeshes[0];
    this._model.scaling.scaleInPlace(0.5);
    this._model.name = this._name;
    //this._model.scaling.scaleInPlace(0.5);

    if (this._originPosition) {
      this._model.position = this._originPosition;
    }

    this._model.isPickable = true;
    this._model.checkCollisions = true;

    this._allMeshes = this._model.getChildMeshes();

    var furMaterial = new FurMaterial("fur", this._scene);
    furMaterial.highLevelFur = false;
	   furMaterial.furLength = 0.5;
    furMaterial.furAngle = 0;
    furMaterial.furColor = new Color3(1, 1, 1);
    furMaterial.diffuseTexture = new Texture("./assets/textures/fur3.png", this._scene);
    furMaterial.furTexture = FurMaterial.GenerateTexture("furTexture", this._scene);
    furMaterial.furSpacing = 1;
    furMaterial.furDensity = 30;
    furMaterial.furSpeed = 200;
    furMaterial.furGravity = new Vector3(0, -8, 0);
    var quality = 32;




    this._allMeshes.forEach(mesh => {

      //mesh.material = furMaterial;
      //var shells = FurMaterial.FurifyMesh(mesh, quality);

      mesh.isPickable = true;
      mesh.checkCollisions = true;
      this._shadowGenerator.getShadowMap().renderList.push(mesh);
      mesh.receiveShadows = false;
    });

    this._idleAnim = this._scene.getAnimationGroupByName("idle");

    this._currentAnim = this._idleAnim;
    this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);
  }

  public setOriginPosition(position) {
    this._originPosition = position;
    if (this._model) {
      this._model.position = this._originPosition;
    }
  }
}
