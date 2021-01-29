import { Space, Ray, StandardMaterial, Texture, ShadowGenerator, PointLight, DirectionalLight, FreeCamera, Color3, Engine, Scene, Vector3, Mesh, Color4, ArcRotateCamera, Sound, PostProcess, SceneLoader } from "@babylonjs/core";
import { WaterMaterial, SkyMaterial, TerrainMaterial } from "@babylonjs/materials";

export class World {
  private _scene: Scene;
  private _light: DirectionalLight;
  private _shadowGenerator: ShadowGenerator;
  private _skybox: Mesh;

  constructor(scene: Scene, size: number) {
    this._scene = scene;

    this._createLight();
    this._createShadow();
    this._createSkyBox(size*2);
    this._createArena(size);

    SceneLoader.ImportMesh("", "./assets/models/", "mountain.glb", this._scene, this._setMountains.bind(this));
  }

  private _createArena(size: number) {
    const terrainMaterial = new TerrainMaterial("terrainMaterial", this._scene);
    terrainMaterial.specularColor = new Color3(0.5, 0.5, 0.5);
    terrainMaterial.specularPower = 64;
	  terrainMaterial.mixTexture = new Texture("./assets/textures/mixMap.png", this._scene);
    terrainMaterial.diffuseTexture1 = new Texture("./assets/textures/floor.png", this._scene);
    terrainMaterial.diffuseTexture2 = new Texture("./assets/textures/rock.png", this._scene);
    terrainMaterial.diffuseTexture3 = new Texture("./assets/textures/grass-ground.png", this._scene);
    terrainMaterial.bumpTexture1 = new Texture("./assets/textures/floor_bump.png", this._scene);
    terrainMaterial.bumpTexture2 = new Texture("./assets/textures/rockn.png", this._scene);
    terrainMaterial.bumpTexture3 = new Texture("./assets/textures/grassn.png", this._scene);
    terrainMaterial.diffuseTexture1.uScale = terrainMaterial.diffuseTexture1.vScale = 10;
    terrainMaterial.diffuseTexture2.uScale = terrainMaterial.diffuseTexture2.vScale = 10;
    terrainMaterial.diffuseTexture3.uScale = terrainMaterial.diffuseTexture3.vScale = 10;
	  terrainMaterial.specularColor = new Color3(0, 0, 0);

    const ground = Mesh.CreateGroundFromHeightMap("ground", "./assets/textures/heightMap.png", size, size, 100, 0, 20, this._scene, false);
	  ground.position.y = -2.05;
	  ground.material = terrainMaterial;
    ground.checkCollisions = true;
    ground.receiveShadows = true;
  }

  private _setMountains(newMeshes) {
    for (let i = 0; i <= 20; i++) {
      const mountain = newMeshes[0].clone();
      mountain.getChildMeshes().forEach(mesh => {
        mesh.checkCollisions = true;
      });
      mountain.checkCollisions = true;
      const randSize = Math.random() * 50 + 100;
      mountain.scaling.scaleInPlace(randSize);
      const randAngle = Math.random() * Math.PI;
      mountain.rotate(new Vector3(0, 1, 0), randAngle, Space.World);
      mountain.position = new Vector3(500*Math.sin((18*i)/180*Math.PI), -7, 500*Math.cos((18*i)/180*Math.PI));
    }
    newMeshes[0].checkCollisions = true;
    newMeshes[0].scaling.scaleInPlace(100);
    newMeshes[0].position = new Vector3(500, -7, -500);
  }

  private _createSkyBox(size) {
    this._skybox = Mesh.CreateBox("skyBox", size, this._scene);
    const skyboxMaterial = new SkyMaterial("skyBox", this._scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.mieDirectionalG = 0.8;
    skyboxMaterial.mieCoefficient = 0.005;
    skyboxMaterial.useSunPosition = true;
    skyboxMaterial.sunPosition = new Vector3(0, 100, 0);
    skyboxMaterial.turbidity = 20;
    skyboxMaterial.luminance = 0.1;
    skyboxMaterial.rayleigh = 1;
    skyboxMaterial.inclination = 0;
    this._skybox.material = skyboxMaterial;
  }

  private _createLight() {
    const sun = new PointLight('mOmni0', new Vector3(0, 50, -20), this._scene);
    sun.diffuse = new Color3(1, 1, 1);
    sun.specular = new Color3(1, 1, 1);

    this._light = new DirectionalLight("mdir01", new Vector3(0, -7, -1), this._scene);
    this._light.position = new Vector3(0, 500, 30);
    this._light.diffuse = new Color3(1, 1, 1);
	  this._light.specular = new Color3(0.9, 0.7, 0.9);
    this._light.intensity = 2;
  }

  private _createShadow() {
    this._shadowGenerator = new ShadowGenerator(1024, this._light);
    this._shadowGenerator.usePoissonSampling = true;
    this._shadowGenerator.useBlurExponentialShadowMap = true;
    this._shadowGenerator.blurKernel = 32;
    this._shadowGenerator.blurBoxOffset = 1;
    this._shadowGenerator.blurScale = 1.0;
    this._shadowGenerator.setDarkness(0.3);
  }

  public addShadow(mesh: Mesh, receive: boolean) {
    mesh.receiveShadows = receive;
    this._shadowGenerator.getShadowMap().renderList.push(mesh);
  }
}
