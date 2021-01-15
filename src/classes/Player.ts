import { Scene, Vector3, Mesh, Color4, Sound, SceneLoader, MeshBuilder, AssetsManager, ArcRotateCamera, AnimationGroup, TransformNode, UniversalCamera, ShadowGenerator } from "@babylonjs/core";
import { CharacterController } from "./CharacterController";
import { PlayerInput } from "./inputController";
import { Hud } from "./ui";

export class Player {

  private _scene: Scene;
  private _playerMesh: any;

  public camera: UniversalCamera;

  private _coordinates: Vector3;

  //camera
  private _camRoot: TransformNode;
  private _yTilt: TransformNode;

  //const values
  private static readonly ORIGINAL_TILT: Vector3 = new Vector3(0.5934119456780721, 0, 0);
  public dashTime: number = 0;

  //player movement vars
  private _deltaTime: number = 0;
  private _h: number;
  private _v: number;

  private _moveDirection: Vector3 = new Vector3();
  private _inputAmt: number;
  private _input: PlayerInput;
  private _camera: any;

  constructor(scene: Scene, coordinates: Vector3, camera) {
    this._scene = scene;
    this._coordinates = coordinates;
    this._camera = camera;

    this._setupPlayerCamera();

    this.loadPlayer().then((result) =>{
      this._playerMesh = result;
      this._setBasicPlayerSettings();
      this._camera.lockedTarget  = this._playerMesh;
    });

    this._scene.registerBeforeRender(() => {
      this._updateCamera();
    })
  }

  public async loadPlayer() {
    const result = await SceneLoader.ImportMeshAsync("", "../assets/models/", "alien1.glb", this._scene);
    console.log(result.meshes[0]);
    return result.meshes[0];
}

  private _setBasicPlayerSettings ():void {
    this._setPlayerPosition(this._coordinates);
    this._setPlayerConroller();
    //this._setPlayerAnimation();
  }

  private _setPlayerConroller () {
    const input = new PlayerInput(this._scene, false); //detect keyboard/mobile inputs
    console.log(input);
    const controller = new CharacterController(this._playerMesh, this._scene, this._camRoot, this._input);
  }

  private _setPlayerPosition (coordinates: Vector3) {
    this._playerMesh.position = coordinates;
    this._playerMesh.scale = 1.2;
  }

  //--CAMERA--
  private _updateCamera(): void {
    //update camera postion up/down movement
    let centerPlayer = this._playerMesh.position.y + 20;
    let centerZ = this._playerMesh.position.z + 20;
    let centerX = this._playerMesh.position.x;
    this._camRoot.position = Vector3.Lerp(this._camRoot.position, new Vector3(centerX, centerPlayer, centerZ), 0.4);
}

private _setupPlayerCamera(): UniversalCamera {
    //root camera parent that handles positioning of the camera to follow the player
    this._camRoot = new TransformNode("root");
    this._camRoot.position = new Vector3(0, 0, 0); //initialized at (0,0,0)
    //to face the player from behind (180 degrees)
    this._camRoot.rotation = new Vector3(0, Math.PI, 0);

    //rotations along the x-axis (up/down tilting)
    let yTilt = new TransformNode("ytilt");

    //adjustments to camera view to point down at our player
    yTilt.rotation = Player.ORIGINAL_TILT;
    this._yTilt = yTilt;
    yTilt.parent = this._camRoot;

    //our actual camera that's pointing at our root's position
    this.camera = new UniversalCamera("cam", new Vector3(0, 0, -6), this._scene);
    this.camera.lockedTarget = this._camRoot.position;
    this.camera.fov = 0.47350045992678597;
    this.camera.parent = yTilt;
    this.camera.checkCollisions = true;

    //this._scene.activeCamera = this.camera;
    return this.camera;
  }

}

/*  private _setUpAnimations(): void {

        this.scene.stopAllAnimations();
        this._run.loopAnimation = true;
        this._idle.loopAnimation = true;

        //initialize current and previous
        this._currentAnim = this._idle;
    }
        this._input = new PlayerInput(this._scene, false); //detect keyboard/mobile inputs
    this._input.updateFromKeyboard();
    
    
    */