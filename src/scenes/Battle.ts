import { SceneLoader, GlowLayer, StandardMaterial, Space, Ray, ShadowGenerator, PointLight, DirectionalLight, FreeCamera, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess } from "@babylonjs/core";
import { World } from "../classes/World";
import { Crosshair } from "../ui/Crosshair";
import { BattleGUI } from "../ui/BattleGUI";
import { Bullet } from '../classes/Bullet';
import { Enemy } from '../classes/Enemy';
import { PlayerInfo } from "./classes/PlayerInfo";

export class Battle {
  private _scene: Scene;
  private _canvas: HTMLCanvasElement;
  private _camera: FreeCamera;
  private _transition: boolean;
  private _callback: Function;
  private _fadeLevel: number = 1.0;
  private _bullets: any;
  private _player: Player;
  private _playerModel: Mesh;
  private _infoGame: PlayerInfo;
  private _world: World;
  private _enemy: Enemy;
  private _isFireEnabled: boolean = true;
  private _weaponShootAnime: animationGroup;
  private _battleGUI: BattleGUI;
  private _playerHealth: number;
  private _startUpdate: boolean = false;
  private _BULLET_SPEED: number = 10;
  private _PLAYER_SPEED: number = 20;
  private _PLAYER_DAMAGE: number = 5;
  private _ARENA_LENGTH: number = 1000;
  isBattleOver: any;
  private _playerKarma: number;
  _weapon: any;

  constructor(engine: Engine, canvas: HTMLCanvasElement, callback: Function) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._canvas = canvas;
    this._scene.gravity = new Vector3(0, -100, 0);
    this._scene.collisionsEnabled = true;
    this._bullets = [];
    this._playerHealth = 100;

    const glowStation = new GlowLayer("glowStation", this._scene, { mainTextureSamples: 2 });

    this._createCamera();

    this._world = new World(this._scene, this._ARENA_LENGTH);

    const crosshair = new Crosshair();

    this._battleGUI = new BattleGUI();
    this._battleGUI.setEnemyName("Catoxeltis Colorful");
    this._battleGUI.setHP(this._playerHealth);

    SceneLoader.ImportMesh("", "./assets/models/", "weapon.glb", this._scene, this._setWeaponModel.bind(this));
    SceneLoader.ImportMesh("", "./assets/models/", "doc.glb", this._scene, this._setPlayerModel.bind(this));

    this._scene.registerBeforeRender(() => {
      if (this._transition) {
        this._fadeLevel -= .05;
        if (this._fadeLevel <= 0) {
          this._transition = false;
          this._callback(this._infoGame);
        }
      }

      this._update();

    });

    const sfxShoot = new Sound("shoot", "./assets/sounds/effects/blast.wav", this._scene, null);

    const music = new Sound("battleMusic", "./assets/sounds/music/battle.mp3", this._scene, null, {
      volume: 0.3,
      loop: true,
      autoplay: true
    });

    music.play();

    canvas.onclick = canvas.requestPointerLock;

    canvas.addEventListener("click", (event) => {
      if (this._startUpdate && this._isFireEnabled && !this.isBattleOver) {
        if (this._weaponShootAnime) {
          sfxShoot.play();
          this._weaponShootAnime.start(false, 2.0, this._weaponShootAnime.from, this._weaponShootAnime.to, false);
          this._fire();
          this._isFireEnabled = false;
          setTimeout(this._bulletPrepare.bind(this), 500);
        }
      }
    });

    /*setTimeout(() => {
      this._startUpdate = true;
    }, 6000);*/
  }

  public setInfoGame(info: PlayerInfo) {
    this._infoGame = info;
    this._playerHealth = Number.parseInt(info.getHealth());
    this._playerKarma = Number.parseInt(info.getKarma());
    this._battleGUI.setHP(this._playerHealth);

    this._enemy = new Enemy(info.getEnemyName());
    this._enemy.runAfterLoaded(this._setEnemy.bind(this));

    switch(info.getEnemyName()) {
      case 'animal-1':
        this._battleGUI.setEnemyName("Catoxeltis Colorful");
        break;
      case 'animal-2':
        this._battleGUI.setEnemyName("Purple-brows Bat");
        break;
    }
  }

  private _bulletPrepare() {
    this._isFireEnabled = true;
  }

  private _setWeaponModel(newMeshes) {
    newMeshes[0].scaling.scaleInPlace(0.75);
    newMeshes[0].position = new Vector3(8, -5, 12);
    newMeshes[0].rotate(new Vector3(0, 1, 0), Math.PI, Space.WORLD);
    newMeshes[0].rotate(new Vector3(1, 0, 0), -Math.PI/20, Space.WORLD);
    newMeshes[0].parent = this._camera;
    newMeshes[0].getChildMeshes().forEach(mesh => {
      this._world.addShadow(mesh, true);
    });

    this._weaponShootAnime = this._scene.getAnimationGroupByName("shoot");

    this._weapon = newMeshes[0];
  }

  private _setPlayerModel(newMeshes, p, s, animationGroups) {
    newMeshes[0].scaling.scaleInPlace(7);
    newMeshes[0].position = new Vector3(-10, 0, 50);
    newMeshes[0].parent = this._weapon;
    newMeshes[0].getChildMeshes().forEach(mesh => {
      this._world.addShadow(mesh, true);
    });
    this._playerModel = newMeshes[0];
    animationGroups.forEach(animation => {
      animation.stop();
    });
  }

  private _setEnemy() {
    this._enemy.getMesh().getChildMeshes().forEach(mesh => {
      this._world.addShadow(mesh, true);
    });
    this._startUpdate = true;
  }

  private _createCamera() {
    this._camera = new FreeCamera("FreeCamera", new Vector3(10, 20, -200), this._scene);
    this._camera.attachControl(this._canvas, true);
    this._camera.checkCollisions = true;
    this._camera.applyGravity = true;
    this._camera.ellipsoid = new Vector3(2, 12, 2);
    this._camera.inertia = 0;
    this._camera.fov = 1.5;
    this._camera.minZ = 0;
    this._camera.speed = this._PLAYER_SPEED;
    this._camera.angularSensibility = 500;
    this._camera._needMoveForGravity = true;

    this._camera.keysUp.push(87);
    this._camera.keysDown.push(83);
    this._camera.keysLeft.push(65);
    this._camera.keysRight.push(68);
  }

  private _fire() {
    const bullet = Mesh.CreateSphere ("bullet", 12, 3, this._scene, false);
    const direction = this._camera.getTarget().subtract(this._camera.position);
    direction.normalize();
    direction.scaleInPlace(this._BULLET_SPEED);
    bullet.position = this._camera.position.add(direction);

    const material = new StandardMaterial("bullet", this._scene);
    material.emissiveColor = new Color3(0.3, 0.9, 1.0);

    bullet.material = material;

    const item = {
      bullet: bullet,
      direction: direction,
      check: false
    }

    setTimeout(() => {
      item.check = true;
    }, 25);

    this._bullets.push(item);
  }

  private _update() {
    if (this._startUpdate && !this.isBattleOver) {
      this._bullets.forEach(item => {
        item.bullet.position = item.bullet.position.add(item.direction);

        if (item.check && this._enemy.checkIntersect(item.bullet)) {
          console.log('got it!');
          this._enemy.setHealth(this._enemy.getHealth() - 5);
          this._battleGUI.setEnemyHealth(this._enemy.getHealth());
          console.log(this._enemy.getHealth())
          this._removeBullet(item);
          //this._enemy.subtractHealth(this._PLAYER_DAMAGE);
          if (this._enemy.getHealth() <= 0) {
            this._enemy.runDeadAction();
            this.isBattleOver = true;
            this._infoGame.pushKilled(this._infoGame.getEnemyName());
            this._battleGUI.showWin();
            setTimeout(() => {
              this.closeScene();
            }, 9000);
          }
        }

        if (item.bullet.position.length() > this._ARENA_LENGTH) {
          this._removeBullet(item);
        }
      });

      if (this._enemy) {
        this._enemy.update(this._camera);
        this.raycastGrounded(this._enemy.getMesh());
      }


      this._playerModel.getChildMeshes().forEach(mesh => {
        if (this._enemy.getBullet().checkIntersect(mesh)) {
          if (this._playerHealth > 0) {
            this._playerHealth -= 5;
            this._infoGame.setHealth(this._playerHealth);
            this._battleGUI.setHP(this._playerHealth);
          }
        }
      });

      if (this._enemy.checkAttackOne()) {
        this._playerHealth -= 10;
        this._infoGame.setHealth(this._playerHealth);
        this._battleGUI.setHP(this._playerHealth);
      }
    }

    if (this._startUpdate && this.isBattleOver) {
      this._enemy.runDeadAction();
    }

    if (this._playerHealth <= 30 && !this.isBattleChoise) {
      this.isBattleChoise = true;
      const isOver = Math.random() * 100;
      if (isOver < 20) {
        this.isBattleOver = true;
        this._infoGame.pushKilled(this._infoGame.getEnemyName());
        this._battleGUI.showByeBye();
        setTimeout(() => {
          this.closeScene();
        }, 3000);
      }
    }

    if (this._playerHealth <= 0) {
      this.isBattleOver = true;
      this._playerHealth = 1;
      this._infoGame.setHealth(0);
      setTimeout(() => {
        this.closeScene();
      }, 1000);
    }
  }

  public playerCheckIntersect(object: Mesh): boolean {
    let result = false;
    this._playerModel.getChildMeshes().forEach(mesh => {
      if (mesh.intersectsMesh(object)) {
        result = true;
      }
    });

    return result;
  }

  private _removeBullet(item) {
    const idx = this._bullets.indexOf(item);
    item.bullet.dispose();
    this._bullets.splice(idx, 1);
  }

  private _updateAnimation() {
    this._currentAnim.stop();
    this._currentAnim = this._walkingAnim;
    this._currentAnim.start(true, 1.0, this._currentAnim.from, this._currentAnim.to, false);
    this._isChangedAnim = true;
  }

  raycastGrounded(object: Mesh) {
    const predicate = (mesh) => mesh.name.includes('ground');
    const length = 60;
    let forward = new Vector3(0, -1, 0);
    const grounded = (hit) => object.position.y = hit.pickedPoint.y + 1;
    this.createRaycast(object, forward, length, predicate, grounded);
  }

  createRaycast(object, forward, length, predicate, callback) {
    const vecToLocal = (vector, mesh) => Vector3.TransformCoordinates(vector, mesh.getWorldMatrix());
    const origin = object.position;
    forward = vecToLocal(forward, object);
    let direction = forward.subtract(origin);
    direction = Vector3.Normalize(direction);
    let ray = new Ray(origin, direction, length);
    const hit = this._scene.pickWithRay(ray, predicate);

    if (hit.pickedMesh) {
      callback(hit);
    }
  }

  public getScene() {
    return this._scene;
  }

  public closeScene() {
    const postProcess = new PostProcess("Fade", "fade", ["fadeLevel"], null, 1.0, this._camera);
    postProcess.onApply = (effect) => {
      effect.setFloat("fadeLevel", this._fadeLevel);
    };
    this._transition = true;
    this._scene.detachControl();
  }

}
