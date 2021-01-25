import { SceneLoader, GlowLayer, StandardMaterial, Space, Ray, ShadowGenerator, PointLight, DirectionalLight, FreeCamera, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess } from "@babylonjs/core";

export class Bullet {
  private _scene: Scene;
  private _speed: number;
  private _borderRadius: number;
  private _bullets;

  constructor(scene: Scene) {
    this._scene = scene;
    this._speed = 1;
    this._bullets = [];
  }

  public setVelocity(speed: number) {
    this._speed = speed;
  }

  public setBorderRadius(radius: number) {
    this._borderRadius = radius;
  }

  private _createBullet(target: Vector3, position: Vector3, color: Color3) {
    const bullet = Mesh.CreateSphere ("bullet", 12, 3, this._scene, false);
    const direction = target.subtract(position);
    direction.normalize();
    direction.scaleInPlace(this._speed);
    bullet.position = position.add(direction);

    const material = new StandardMaterial("bullet", this._scene);
    material.emissiveColor = color;

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

  private _removeBullet(item) {
    const idx = this._bullets.indexOf(item);
    item.bullet.dispose();
    this._bullets.splice(idx, 1);
  }

  public checkIntersect(object: Mesh): boolean {
    let result = false;

    this._bullets.forEach(item => {
      if (item.bullet.intersectsMesh(object)) {
        result = true;
        this._removeBullet(item);
      }

      object.getChildMeshes().forEach(mesh => {
        if (item.bullet.intersectsMesh(mesh)) {
          result = true;
          this._removeBullet(item);
        }
      });
    });

    return result;
  }

  public update() {
    this._bullets.forEach(item => {
      item.bullet.position = item.bullet.position.add(item.direction);
    });
  }

  public getBullets() {
    return this._bullets;
  }
}
