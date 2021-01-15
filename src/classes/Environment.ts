import { Scene, SceneLoader} from "@babylonjs/core";


export default class Environment {
    private _scene: Scene;
    private _urlFolder: string;
    private _urlAsset: string;
    private _assetName: string;

    constructor(scene: Scene, urlFolder: string, urlAsset: string, assetName: string) {
        this._scene = scene;
        this._urlFolder = urlFolder;
        this._urlAsset = urlAsset;
        this._assetName = assetName;
    }

    public async load(type: string) {
        if(type === "ground"){
            SceneLoader.Append(this._urlFolder, this._urlAsset, this._scene, function(scene){ 
                scene.meshes.forEach((mesh) => this._checkCollision(mesh, scene));
            });
        }else{
            const assets = await this.loadAsset();
            assets.allMeshes.forEach(mesh =>  this._checkCollision (mesh))
        }
    }

    private _checkCollision (mesh: any, scene?: Scene): void {
        mesh.receiveShadows = true;
        mesh.checkCollisions = true;
        if (mesh.name.includes("tree")) {
            mesh.checkCollisions = false;
            mesh.isPickable = false;
        }
          //collision meshes
        if (mesh.name.includes("collision")) {
            mesh.isVisible = false;
            mesh.isPickable = true;
        }
          //trigger meshes
        if (mesh.name.includes("Trigger")) {
            mesh.isVisible = false;
            mesh.isPickable = false;
            mesh.checkCollisions = false;
        }
        if (mesh.name.includes("Cube")) {
            mesh.isPickable = true;
            mesh.checkCollisions = true;
        }
    }

    //Load all necessary meshes for the environment
    public async loadAsset() {
        //loads game environment
        const result = await SceneLoader.ImportMeshAsync(this._assetName, this._urlFolder, this._urlAsset, this._scene);
        let env = result.meshes[0];
        let allMeshes = env.getChildMeshes();
        return {
            env: env,
            allMeshes: allMeshes,
        }
    }

    
}
