import { Ray, Quaternion, ShadowGenerator, Engine, Scene, Vector3, Mesh, Color4, Sound, SceneLoader, MeshBuilder, AssetsManager,ActionManager,ExecuteCodeAction } from "@babylonjs/core";


export class Player {
  private _scene: Scene;
  private _tailAnim;
  private _model;
  private _speed;
  private _horizontal;
  private _vertical;
  private _shadowGenerator;
  private _VELOCITY: number = 0.1;
  private _lookAtAngle: number;
  private _idleAnim;
  private _walkingAnim;
  private _currentAnim;
  private _allMeshes: any;
  private _isChangedAnim = false;
  private _originPosition;
  private _collisionCallback: Function;
  private _health: number;
  private _karma: number;

  constructor(scene: Scene, shadow: ShadowGenerator) {
    this._scene = scene;
    this._shadowGenerator = shadow;
    this._speed = this._VELOCITY;
    this._health = 100;
    this._karma = 0;

    SceneLoader.ImportMesh("", "./assets/models/", "doc.glb", this._scene, this._setTestModel.bind(this));

    this.setKeys();
  }

  public setKeys() {
    const KEY = {
      UP: '38',
      W: '87',
      LEFT: '37',
      A: '65',
      DOWN: '40',
      S: '83',
      RIGHT: '39',
      D: '68'
    }

    const inputMap = {};
    this._scene.actionManager = new ActionManager(this._scene);
    this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
        inputMap[evt.sourceEvent.keyCode] = evt.sourceEvent.type == "keydown";
    }));
    this._scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
        inputMap[evt.sourceEvent.keyCode] = evt.sourceEvent.type == "keydown";
    }));

    this._scene.onBeforeRenderObservable.add(() => {
      this._horizontal = 0;
      this._vertical = 0;

      if (inputMap[KEY.RIGHT] || inputMap[KEY.D]) {    //  d
        this._horizontal = 1;
      }

      if (inputMap[KEY.UP] || inputMap[KEY.W]) { //   w
        this._vertical = -1;
      }

      if (inputMap[KEY.LEFT] || inputMap[KEY.A]) {   //a
        this._horizontal = -1;
      }

      if (inputMap[KEY.DOWN] || inputMap[KEY.S]) {   //s
        this._vertical = 1;
      }
    });
  }

  private _setTestModel (newMeshes, particleSystems, skeletons, animationGroups) {
    this._model = newMeshes[0];
    this._model.scaling.scaleInPlace(0.5);

    if (this._originPosition) {
      this._model.position = this._originPosition;
    } else {
        this._model.position = new Vector3(0, 1, 2);
    }

    this._model.isPickable = false;

    this._allMeshes = this._model.getChildMeshes();

    this._allMeshes.forEach(mesh => {
      mesh.isPickable = false;
      this._shadowGenerator.getShadowMap().renderList.push(mesh);
      mesh.receiveShadows = false;
    });

    this._scene.cameras[0].setTarget(this._model);

    this._idleAnim = animationGroups[1];
    this._walkingAnim = animationGroups[2];

    this._currentAnim = this._idleAnim;
    this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);
  }

  public setOriginPosition(position) {
    this._originPosition = position;
    if (this._model) {
      this._model.position = this._originPosition;
    }
  }

  public setCollisionCallback(callback: Function) {
    this._collisionCallback = callback;
  }

  public update() {
    if (this._model) {
      if (this._horizontal !== 0 || this._vertical !== 0) {
        this._lookAtAngle = Math.atan2(-this._vertical, -this._horizontal);

        if (!this._isChangedAnim) {
          this._currentAnim.stop();
          this._currentAnim = this._walkingAnim;
          this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);
          this._isChangedAnim = true;
        }
      } else {
        this._isChangedAnim = false;
        this._currentAnim.stop();
        this._currentAnim = this._idleAnim;
        this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);
      }

      const axis = new Vector3(0, 1, 0);
      const quaternion = Quaternion.RotationAxis(axis, this._lookAtAngle);
      this._model.rotationQuaternion = quaternion;

      this.raycastGrounded();
      this.raycastCollisions();

      this._model.position.z += this._speed * this._horizontal;
      this._model.position.x += this._speed * this._vertical;
    }

    this._speed = this._VELOCITY;
  }

  raycastCollisions() {
    const predicate = (mesh) => mesh.name.includes('wall') || mesh.name.includes('Cube') || mesh.name.includes('tree') || mesh.name.includes('savestation') || mesh.name.includes('animal') || mesh.name.includes('trader') || mesh.name.includes('laboratory');
    const length = 1.5;
    let forward = new Vector3(0, 0, 1);
    //const stopWalking = (hit) => this._speed  = -this._VELOCITY;
    const stopWalking = (hit) => this._speed = 0;
    this.createRaycast(forward, length, predicate, stopWalking);
  }

  raycastGrounded() {
    const predicate = (mesh) => mesh.name.includes('ground') || mesh.name.includes('roud');
    const length = 2;
    let forward = new Vector3(0, -1, 0);
    const grounded = (hit) => this._model.position.y = hit.pickedPoint.y + 0.15;
    this.createRaycast(forward, length, predicate, grounded);
  }

  createRaycast(forward, length, predicate, callback) {
    const vecToLocal = (vector, mesh) => Vector3.TransformCoordinates(vector, mesh.getWorldMatrix());
    const origin = this._model.position;
    forward = vecToLocal(forward, this._model);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    let ray = new Ray(origin, direction, length);
    const hit = this._scene.pickWithRay(ray, predicate);

    if (hit.pickedMesh) {
      callback(hit);
      this._collisionCallback(hit.pickedMesh.name);
    }
  }

  public getMesh() {
    return this._model;
  }

  public getHealth(): number {
    return this._health;
  }

  public setHealth(health: number) {
    if (health >=0 && health <= 100) {
      this._health = health;
    }
  }

  public getKarma(): number {
    return this._karma;
  }

  public setKarma(karma: number) {
    if (karma >=0 && karma <= 100) {
      this._karma = karma;
    }
  }

  public getLookAtAngle(): number {
    return this._lookAtAngle;
  }

  public setLookAtAngle(angle: number) {
    this._lookAtAngle = angle;
  }
}
