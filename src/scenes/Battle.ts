import { SceneLoader, GlowLayer, PBRMaterial, CubeTexture, Texture, StandardMaterial, Space, Ray, ShadowGenerator, PointLight, DirectionalLight, FreeCamera, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess } from "@babylonjs/core";
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
  private _bullet: Bullet;
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
  private isBattleOver: any;
  private _playerKarma: number;
  private _weapon: any;
  private _weakSpotSFX;

  constructor(engine: Engine, canvas: HTMLCanvasElement, callback: Function) {
    this._callback = callback;
    this._scene = new Scene(engine);
    this._canvas = canvas;
    this._scene.gravity = new Vector3(0, -100, 0);
    this._scene.collisionsEnabled = true;
    this._bullets = [];
    this._playerHealth = 100;
    this._bullet = new Bullet();
    this._bullet.setVelocity(this._BULLET_SPEED);
    this._bullet.setBorderRadius(this.__ARENA_LENGTH);

    const glowStation = new GlowLayer("glowStation", this._scene, { mainTextureSamples: 2 });

    this._createCamera();

    this._world = new World(this._scene, this._ARENA_LENGTH);

    const crosshair = new Crosshair();

    this._battleGUI = new BattleGUI();
    this._battleGUI.setEnemyName("Catoxeltis Colorful");
    this._battleGUI.setHP(this._playerHealth);

    this._weakSpotSFX = new Sound("weakSfx", "./assets/sounds/effects/weakspot.wav", this._scene, null);

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
          this._bullet._createBullet(this._camera.getTarget(), this._camera.position, new Color3(0.3, 0.9, 1.0));
          this._isFireEnabled = false;
          setTimeout(this._bulletPrepare.bind(this), 500);
        }
      }
    });
  }

  public setInfoGame(info: PlayerInfo) {
    this._infoGame = info;
    this._playerHealth = Number.parseInt(info.getHealth());
    this._playerKarma = Number.parseInt(info.getKarma());
    this._battleGUI.setHP(this._playerHealth);

    const filename = info.getEnemyName().match(/\[(.*?)\]/)[1];
    const name = info.getEnemyName().match(/\{(.*?)\}/)[1];
    const weakSpot = info.getWeakSpots().includes(name)

    this._enemy = new Enemy(filename, this._scene, weakSpot);
    this._enemy.runAfterLoaded(this._setEnemy.bind(this));

    this._battleGUI.setEnemyName(name);
  }

  private _bulletPrepare() {
    this._isFireEnabled = true;
  }

  private _setWeaponModel(newMeshes) {
    var hdrTexture = CubeTexture.CreateFromPrefilteredData("/assets/textures/environment.dds", this._scene);
    var metal = new PBRMaterial("metal", this._scene);
    metal.reflectivityTexture = new Texture("/assets/textures/weapon.png", this._scene);
    metal.useMicroSurfaceFromReflectivityMapAlpha = true;
    metal.albedoColor = Color3.White();
    metal.albedoTexture = new Texture("/assets/textures/weapon.png", this._scene);
    metal.reflectionTexture = hdrTexture;
    metal.microSurface = 0.96;
    metal.reflectivityColor = new Color3(0.35, 0.35, 0.85);

    newMeshes[0].scaling.scaleInPlace(0.75);
    newMeshes[0].position = new Vector3(8, -5, 12);
    newMeshes[0].rotate(new Vector3(0, 1, 0), Math.PI, Space.WORLD);
    newMeshes[0].rotate(new Vector3(1, 0, 0), -Math.PI/20, Space.WORLD);
    newMeshes[0].parent = this._camera;
    newMeshes[0].getChildMeshes().forEach(mesh => {
      mesh.material = metal;
      this._world.addShadow(mesh, true);
    });

    this._weaponShootAnime = this._scene.getAnimationGroupByName("shoot");

    this._weapon = newMeshes[0];
  }

  private _setPlayerModel(newMeshes, p, s, animationGroups) {
    newMeshes[0].scaling.scaleInPlace(7);
    newMeshes[0].position = new Vector3(0, -10, -15);
    newMeshes[0].parent = this._camera;
    newMeshes[0].getChildMeshes().forEach(mesh => {
      this._world.addShadow(mesh, true);
    });
    this._playerModel = newMeshes[0];
    animationGroups.forEach(animation => {
      animation.stop();
    });

    this._battleGUI.showStartMessage();
    setTimeout(() => {
      this._battleGUI.hideStartMessage();
    }, 4500);
  }

  private _setEnemy() {
    this._enemy.getMesh().receiveShadows = false;
    this._enemy.getMesh().getChildMeshes().forEach(mesh => {
      this._world.addShadow(mesh, true);
      const name = this._infoGame.getEnemyName().match(/\{(.*?)\}/)[1];
      if (mesh == 'active_place' && this._infoGame.getWeakSpots().includes(name)) {
        mesh.isVisible = true;
        mesh.receiveShadows = false;
      }
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

  private _update() {
    if (this._startUpdate && !this.isBattleOver) {
      this._bullet.update();

      this._enemy.getMeshes().forEach(mesh => {
        if (this._bullet.checkIntersect(mesh)) {
          const name = this._infoGame.getEnemyName().match(/\{(.*?)\}/)[1];
          if (mesh.name === 'active_place' && !this._infoGame.getWeakSpots().includes(name)) {
            if (!mesh.isVisible) {
              this._weakSpotSFX.play();
            }
            mesh.isVisible = true;
            this._enemy.setHealth(this._enemy.getHealth() - 5);
            this._battleGUI.showFoundWeakSpot();
            setTimeout(() => {
              this._battleGUI.hideFoundWeakSpot();
            }, 1500);
            this._infoGame.pushWeakSpots(name);
          }
          this._enemy.setHealth(this._enemy.getHealth() - 5);
          this._battleGUI.setEnemyHealth(this._enemy.getHealth());
          if (this._enemy.getHealth() <= 0) {
            this._enemy.runDeadAction();
            this.isBattleOver = true;
            this._infoGame.pushKilled(this._infoGame.getEnemyName());
            this._infoGame.setKarma(this._infoGame.getKarma() + 5);
            this._battleGUI.showWin();
            setTimeout(() => {
              this.closeScene();
            }, 9000);
          }
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
