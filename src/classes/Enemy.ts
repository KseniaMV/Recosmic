import { Space, GlowLayer, ParticleSystem, StandardMaterial, Color3, Texture, Ray, Quaternion, ShadowGenerator, Engine, Scene, Vector3, Mesh, Color4, Sound, SceneLoader, MeshBuilder, AssetsManager,ActionManager,ExecuteCodeAction } from "@babylonjs/core";
import { Bullet } from './Bullet';

enum ACTION {
  ATTACK_1 = 1,
  ATTACK_2 = 2,
  RUN = 3
}

export class Enemy {
  private _scene: Scene;
  private _model: Mesh;
  private _idleAnime: AnimationGroup;
  private _attackDistanceAnime: AnimationGroup;
  private _attackFarAnime: AnimationGroup;
  private _currentAnime: AnimationGroup;
  private _callback: Function;
  private _health: number;
  private _fallingAngle: number;
  private _deadParticles;
  private _bullet: Bullet;
  private _isFireEnabled: boolean = true;
  private _isWalking: boolean = false;
  private _isChangeAttack: boolean = false;
  private _isChangedAnime: boolean = false;
  private _currentAction: number;
  private _isAttackOne: boolean = false;
  private _isKnowTenderPlace: boolean = false;
  private _isShifting: boolean = false;
  private _WALKING_SPEED = 1.5;
  private _BULLET_SPEED = 5.5;
  private _RELOAD_TIME = 700;
  private _direction: any;
  private _currentAnim: any;

  constructor(name: string, scene: Scene) {
    this._scene = scene;
    this._health = 100;
    this._fallingAngle = 0;

    this._bullet = new Bullet();
    this._bullet.setVelocity(this._BULLET_SPEED);
    this._bullet.setBorderRadius(1000);

    const glowStation = new GlowLayer("glowStation", this._scene, { mainTextureSamples: 2 });

    const filename = name + ".glb";
    SceneLoader.ImportMesh("", "./assets/models/", filename, this._scene, this._setModel.bind(this));
  }

  private _setModel(newMeshes, particleSystems, skeletons, animationGroups) {
    this._model = newMeshes[0];
    this._model.scaling.scaleInPlace(10);
    this._model.position = new Vector3(0, 10, 0);

    this._model.getChildMeshes().forEach(mesh => {
      mesh.checkCollisions = true;
      if (mesh.name == 'active_place') {
        mesh.isVisible = this._isKnowTenderPlace;
      }
    });

    this._idleAnime = animationGroups[1];
    this._attackFarAnime = animationGroups[0];
    this._attackDistanceAnime = animationGroups[2];

    this._currentAnime = this._idleAnime;
    this._currentAnime.start(false, 2.0, this._currentAnime.from, this._currentAnime.to, false);

    this._callback();
  }

  public runDeadAction() {
    this._isFireEnabled = false;
    if (this._fallingAngle < Math.PI) {
      this._fallingAngle += 0.01;
      this._model.rotate(new Vector3(0, 0, 1), 0.01, Space.WORLD);
    } else {
      if (!this._deadParticles) {
        this._idleAnime.stop();
        this._attackFarAnime.stop();
        this._attackDistanceAnime.stop();

        this._deadParticles = this._createParticles();
        this._deadParticles.start();

        setTimeout(() => {
          this._deadParticles.stop();
        }, 5000);
      }
    }
  }

  private _walkToTarget(target) {
    const direction = target.subtract(this._model.position);
    direction.normalize();
    direction.scaleInPlace(this._WALKING_SPEED);
    //direction.y = 1;
    this._direction = direction;
  }

  private _walkAndShift(target) {
    target = new Vector3(target.x + 150, target.y, target.z + 150);
    const direction = target.subtract(this._model.position);
    direction.normalize();
    direction.scaleInPlace(this._WALKING_SPEED);
    //direction.y = 1;
    this._direction = direction;
  }

  public checkIntersect(object: Mesh): boolean {
    let result = false;
    this._model.getChildMeshes().forEach(mesh => {
      if (mesh.intersectsMesh(object)) {
        console.log(mesh.name)
        result = true;
        if (mesh.name === 'active_place') {
          mesh.isVisible = true;
          this._health -= 5;
        }
      }
    });

    return result;
  }

  public update(object: any) {
    if (this._model && this._health > 0) {
      this._model.lookAt(object.position);
      this._aiBot(object.position);
    } else {
      this.runDeadAction();
    }

    if (this._isWalking) {
      this._model.position = this._model.position.add(this._direction);
    }

    if (this._isShifting) {
      this._model.position = this._model.position.add(this._direction);
    }

    this._bullet.update();
  }

  private _changeAnime(animation: AnimationGroup) {
    if (this._currentAnim) {
      this._currentAnim.stop();
    }

    this._currentAnim = animation;
    this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);

    this._isChangedAnime = true;
  }

  private _fire(target: Vector3) {
    this._bullet._createBullet(target, this._model.position, new Color3(0.1, 0.9, 0.3));
    setTimeout(() => {
      if (this._isFireEnabled) {
        this._fire(target);
      }
    }, this._RELOAD_TIME);
  }

  private _aiBot(position: Vector3) {
    const distance = this._model.position.subtract(position).length();
    let newAction;

    if (distance < 110 && distance > 30) {
      newAction = ACTION.RUN;
    } else if (distance <= 30) {
      newAction = ACTION.ATTACK_1;
    } else {
      newAction = ACTION.ATTACK_2;
    }

    if (this._currentAction !== newAction) {
      this._currentAction = newAction;

      switch (newAction) {
        case ACTION.RUN:
          console.log("walking");
          this._isWalking = true;
          this._isFireEnabled = false;
          this._changeAnime(this._idleAnime);
          this._walkToTarget(position);
          break;
        case ACTION.ATTACK_1:
          console.log("attack 1");
          this._changeAnime(this._idleAnime);
          this._isWalking = false;
          this._isFireEnabled = false;
          break;
        case ACTION.ATTACK_2:
          console.log("attack 2");
          this._changeAnime(this._attackDistanceAnime);
          this._isWalking = false;
          this._isFireEnabled = true;
          setTimeout(() => {
              this._fire(position);
          }, 1000);
          break;
      }
    }

    if (this._currentAction = ACTION.ATTACK_2) {
      const randShift = Math.random() * 100;
      if (randShift < 49 && !this._isShifting) {
        console.log(this._isShifting);
        this._isShifting = true;
        console.log('shift')
        this._walkAndShift(position);
        setTimeout(() => {
          console.log(this._isShifting);
          this._isShifting = false;
        }, 3500);
      }
    }
  }

  public checkAttackOne(): boolean {
    if (this._currentAction == ACTION.ATTACK_1 && !this._isAttackOne) {
      this._isAttackOne = true;
      setTimeout(() => {
        this._isAttackOne = false;
      }, 1000);
      return true;
    }
    return false;
  }

  public getMesh(): Mesh {
    return this._model;
  }

  public runAfterLoaded(callback: Function) {
    this._callback = callback;
  }

  public subtractHealth(percent: number) {
    if (this._health > 0) {
      this._health -= percent;
    } else {
      console.log('Enemy was killed. You won!');
      //this._runDeadAction();
    }
  }

  private _createParticles() {
    const sphere = new Mesh.CreateSphere("deadPoint", 12, 12, false);
    sphere.position = this._model.position;
    sphere.isVisible = false;
    const particleSystem = new ParticleSystem("dead_particles", 2000, this._scene);
    particleSystem.particleTexture = new Texture("../assets/textures/flare.png", this._scene);
    particleSystem.emitter = sphere;
    particleSystem.minEmitBox = new Vector3(-1, 0, 0);
    particleSystem.maxEmitBox = new Vector3(1, 0, 0);
    particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 1.0);
    particleSystem.color2 = new Color4(0.2, 0.5, 1.0, 1.0);
    particleSystem.colorDead = new Color4(0, 0, 0.2, 0.0);
    particleSystem.minSize = 0.75;
    particleSystem.maxSize = 1.5;
    particleSystem.minLifeTime = 0.3;
    particleSystem.maxLifeTime = 3.5;
    particleSystem.emitRate = 1500;
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ONEONE;
    particleSystem.gravity = new Vector3(0, -5.81, 0);
    particleSystem.direction1 = new Vector3(-7, 8, 3);
    particleSystem.direction2 = new Vector3(7, 8, -3);
    particleSystem.minAngularSpeed = 0;
    particleSystem.maxAngularSpeed = Math.PI;
    particleSystem.minEmitPower = 1;
    particleSystem.maxEmitPower = 3;
    particleSystem.updateSpeed = 0.005;
    return particleSystem;
  }

  public getHealth() {
    return this._health;
  }

  public setHealth(health: number) {
    this._health = health
  }

  public getBullet() {
    return this._bullet;
  }
}
