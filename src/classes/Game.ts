import { Engine, Scene, Vector3, Mesh, Color3, Color4, ShadowGenerator, GlowLayer, PointLight, FreeCamera, CubeTexture, Sound, PostProcess, Effect, SceneLoader, Matrix, MeshBuilder, Quaternion, AssetsManager } from "@babylonjs/core";
export default class Game {

    private createCanvas() :HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.classList.add("renderCanvas");
        canvas.setAttribute("id", "renderCanvas");
        return canvas;
    }

    //initialize babylon scene and engine
    private initBabylonEngine(canvas : HTMLCanvasElement):any {
        return  new Engine(canvas, true, {preserveDrawingBuffer: true, stencil: true});
    }
    
    public initGame() {
        const canvas = this.createCanvas();
        document.body.append(canvas);
        this.initBabylonEngine(canvas);
        console.log("game init");
    }
}

