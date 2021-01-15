import { Scene, Vector3, Ray, TransformNode, Mesh, Color3, Color4, UniversalCamera, Quaternion, AnimationGroup, ExecuteCodeAction, ActionManager, ParticleSystem, Texture, SphereParticleEmitter, Sound, Observable, ShadowGenerator } from "@babylonjs/core";
import { PlayerInput } from "./inputController";

export class CharacterController extends TransformNode {
    public scene: Scene;
    private _input: PlayerInput;
    private _camRoot: TransformNode;

    //Player
    public mesh: Mesh;

    
    //animations player
    private _walk: AnimationGroup;
    private _idle: AnimationGroup;


    // animation trackers
    private _currentAnim: AnimationGroup = null;
    private _prevAnim: AnimationGroup;
    //------------------------------
    //const values
    private static readonly PLAYER_SPEED: number = 0.45;
    private static readonly JUMP_FORCE: number = 0.80;
    private static readonly GRAVITY: number = -2.8;
    private static readonly DASH_FACTOR: number = 2.5;
    private static readonly DASH_TIME: number = 10; //how many frames the dash lasts
    private static readonly ORIGINAL_TILT: Vector3 = new Vector3(0.5934119456780721, 0, 0);

    //player movement vars
    private _deltaTime: number = 0;
    private _h: number;
    private _v: number;

    private _moveDirection: Vector3 = new Vector3();
    private _inputAmt: number;

    //gravity
    private _gravity: Vector3 = new Vector3();

    //sfx
    private _walkingSfx: Sound;

    //observables
    public onRun = new Observable();
    private _grounded: any;
    private _dashingSfx: Sound;

    constructor(player: Mesh, scene: Scene, root: TransformNode, input?: PlayerInput) {
        super("player", scene);
        this.scene = scene;
        this._camRoot = root; 
        console.log(player);
        this.mesh = player;
        //this.mesh.parent = this
        //--COLLISIONS--
        this.mesh.actionManager = new ActionManager(this.scene);

        //set up sounds
        //this._loadSounds(this.scene);

        //--SOUNDS--
        //observable for when to play the walking sfx
        this.onRun.add((play) => {
            if (play && !this._walkingSfx.isPlaying) {
                this._walkingSfx.play();
            } else if (!play && this._walkingSfx.isPlaying) {
                this._walkingSfx.stop();
                this._walkingSfx.isPlaying = false; // make sure that walkingsfx.stop is called only once
            }
        })
        //this._setUpAnimations();
        this._input = input;
        //this._animatePlayer();
    }

    private _updateFromControls(): void {
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        this._moveDirection = Vector3.Zero();
        this._h = this._input.horizontal; //right, x
        this._v = this._input.vertical; //fwd, z

        //--MOVEMENTS BASED ON CAMERA (as it rotates)--
        let fwd = this._camRoot.forward;
        let right = this._camRoot.right;
        let correctedVertical = fwd.scaleInPlace(this._v);
        let correctedHorizontal = right.scaleInPlace(this._h);

        //movement based off of camera's view
        let move = correctedHorizontal.addInPlace(correctedVertical);

        //clear y so that the character doesnt fly up, normalize for next step
        this._moveDirection = new Vector3((move).normalize().x, 0, (move).normalize().z);   

        //clamp the input value so that diagonal movement isn't twice as fast
        let inputMag = Math.abs(this._h) + Math.abs(this._v);
        if (inputMag < 0) {
            this._inputAmt = 0;
        } else if (inputMag > 1) {
            this._inputAmt = 1;
        } else {
            this._inputAmt = inputMag;
        }
        //final movement that takes into consideration the inputs
        this._moveDirection = this._moveDirection.scaleInPlace(this._inputAmt * CharacterController.PLAYER_SPEED);

        //check if there is movement to determine if rotation is needed
        let input = new Vector3(this._input.horizontalAxis, 0, this._input.verticalAxis); //along which axis is the direction
        if (input.length() == 0) {//if there's no input detected, prevent rotation and keep player in same rotation
            return;
        }

        //rotation based on input & the camera angle
        let angle = Math.atan2(this._input.horizontalAxis, this._input.verticalAxis);
        angle += this._camRoot.rotation.y;
        let targ = Quaternion.FromEulerAngles(0, angle, 0);
        this.mesh.rotationQuaternion = Quaternion.Slerp(this.mesh.rotationQuaternion, targ, 10 * this._deltaTime);
    }

    
    private _setUpAnimations() {
        const idle = this.scene.getAnimationGroupByName("idle");
        const walking = this.scene.getAnimationGroupByName("walking");
        idle.start(true, 1.0, idle.from, idle.to, false);
        idle.start(true, 1.0, idle.from, idle.to, false);
        idle.start(true, 1.0, idle.from, idle.to, false);
        this._walk = walking;
        this._idle = idle;
    }

    private _animatePlayer(): void {
        if ((this._input.inputMap["w"] || this._input.inputMap["ArrowUp"]) || this._input.mobileUp
            || (this._input.inputMap["s"] || this._input.inputMap["ArrowDown"]) || this._input.mobileDown
            || (this._input.inputMap["a"] || this._input.inputMap["ArrowLeft"]) || this._input.mobileLeft
            || (this._input.inputMap["d"] || this._input.inputMap["ArrowRight"]) || this._input.mobileRight)
            {
                this._currentAnim = this._walk;
                this.onRun.notifyObservers(true);
            } 
            else if (this._grounded) {
                this._currentAnim = this._idle;
                //only notify observer if it's playing
                if(this.scene.getSoundByName("walk").isPlaying){
                    this.onRun.notifyObservers(false);
                }
            }
            //Animations
            if(this._currentAnim != null && this._prevAnim !== this._currentAnim){
                //this._prevAnim.stop();
                this._currentAnim.play(this._currentAnim.loopAnimation);
                this._prevAnim = this._currentAnim;
            }
    }

    //--GROUND DETECTION--
    //Send raycast to the floor to detect if there are any hits with meshes below the character
    private _floorRaycast(offsetx: number, offsetz: number, raycastlen: number): Vector3 {
        //position the raycast from bottom center of mesh
        let raycastFloorPos = new Vector3(this.mesh.position.x + offsetx, this.mesh.position.y + 0.5, this.mesh.position.z + offsetz);
        let ray = new Ray(raycastFloorPos, Vector3.Up().scale(-1), raycastlen);

        //defined which type of meshes should be pickable
        let predicate = function (mesh) {
            return mesh.isPickable && mesh.isEnabled();
        }

        let pick = this.scene.pickWithRay(ray, predicate);

        if (pick.hit) { //grounded
            return pick.pickedPoint;
        } else { //not grounded
            return Vector3.Zero();
        }
    }

    //raycast from the center of the player to check for whether player is grounded
    private _isGrounded(): boolean {
        if (this._floorRaycast(0, 0, .6).equals(Vector3.Zero())) {
            return false;
        } else {
            return true;
        }
    }

    private _updateGroundDetection(): void {
        this._deltaTime = this.scene.getEngine().getDeltaTime() / 1000.0;
        if (!this._isGrounded()) {
          this._gravity = this._gravity.addInPlace(Vector3.Up().scale(this._deltaTime * CharacterController.GRAVITY));
          this._grounded = false;
        }
        if (this._gravity.y < 0) {
            this._gravity.y = -1;
        }
        this.mesh.moveWithCollisions(this._moveDirection.addInPlace(this._gravity));

    }

    //--GAME UPDATES--
    private _beforeRenderUpdate(): void {
        this._updateFromControls();
        this._updateGroundDetection();
        this._animatePlayer();
    }

    private _loadSounds(scene: Scene): void {
        this._dashingSfx = new Sound("dashing", "..assets/sounds/effects/click.wav", scene, function () {
        });

        this._walkingSfx = new Sound("walking", "..assets/sounds/effects/walk.wav", scene, function () {
        }, {
            loop: true,
            volume: 0.20,
            playbackRate: 0.6
        });
    }
}
