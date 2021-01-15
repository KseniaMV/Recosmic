import { Scene, ShadowGenerator,Quaternion, Vector3,PBRMaterial, Mesh,StandardMaterial, Texture, Color4, Color3, CubeTexture, Sound, SceneLoader, MeshBuilder, AssetsManager } from "@babylonjs/core";

export class Environment {
  private _scene: Scene;
  private _shadowGenerator;
  private _env;
  private _ground;
  private _allMeshes;
  private _playerPoint;

  constructor(scene: Scene, shadow: ShadowGenerator) {
    this._scene = scene;
    this._shadowGenerator = shadow;

    SceneLoader.ImportMesh("", "./assets/models/", "firstLevel.glb", this._scene, this._setEnvironment.bind(this));
  }

  private _setEnvironment (newMeshes, particleSystems, skeletons, animationGroups) {
    this._env = newMeshes[0];
    this._env.position.y = 0;

    /*const axis = new Vector3(0, 1, 0);
    const angle = -Math.PI / 4;
    const quaternion = new Quaternion.RotationAxis(axis, angle);
    this._env.rotationQuaternion = quaternion;*/

    //this._env.checkCollisions = true;

    this._allMeshes = this._env.getChildMeshes();

    //this._env.checkCollisions = true;
    //this._env.isPickable = true;
    this._env.receiveShadows = true;

    this._allMeshes.forEach(mesh => {
      mesh.receiveShadows = true;

      if (mesh.name === 'Plane') {
          this._ground = mesh;
      }

      if (mesh.name === 'player') {
        console.log('p');
        this._playerPoint = new Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
      }

      if (mesh.name === 'player22') {
        console.log('p22');
        this._playerPoint = new Vector3(mesh.position.x, mesh.position.y, mesh.position.z);
      }


      mesh.checkCollisions = true;
      mesh.isPickable = true;

      if (mesh.name.includes('wall'))  {
        mesh.isVisible = false;
        mesh.isPickable = true;

      }
      if(mesh.name.includes("Cube")) {
        mesh.isPickable = true;
      }

      if (mesh.name === 'roud') {
        /*var materialSphere1 = new StandardMaterial("texture1", this._scene);
        materialSphere1.wireframe = true;
        mesh.material = materialSphere1;*/

      }


      if (mesh.name === 'Plane' || mesh.name === 'ground' || mesh.name === 'roud') {
          mesh.isPickable = false;
      }

      if (mesh.name.includes('Cube') || mesh.name.includes('tree') || mesh.name.includes('Stone')) {
        this._shadowGenerator.getShadowMap().renderList.push(mesh);
        mesh.receiveShadows = false;
      }


      if (mesh.name.includes('grass')) {
        const mat = new StandardMaterial("grass", this._scene);
        mat.diffuseTexture = new Texture("./assets/textures/grass.png", this._scene);
        mat.diffuseColor = new Color3(1,1,1);
        mat.diffuseTexture.hasAlpha = true;
        mat.backFaceCulling = false;
        mesh.material = mat;
        mesh.receiveShadows = false;
        mesh.checkCollisions = false;
        mesh.isPickable = false;
      }
    });

  }

  public getMesh() {
    return this._env;
  }

  public getAllMeshes() {
    return this._allMeshes;
  }

  public getGround() {
    return this._ground;
  }

  public getPlayerPoint() {
    return this._playerPoint;
  }
}
