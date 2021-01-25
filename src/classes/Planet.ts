import { Space, StandardMaterial, Texture } from '@babylonjs/core';
import { MeshBuilder, Scene, Vector3 } from '@babylonjs/core';

export class Planet {
    private _scene: Scene;
    private _texture: string;
    private _planet;
    private _position: Vector3;

    constructor (scene: Scene, texture: string, position: Vector3) {
        this._scene = scene;
        this._texture = texture;
        this._position = position;
    }

    private async _createSphere() {
        const planet = MeshBuilder.CreateSphere("box2", {diameter: 60}, this._scene);
        planet.position = this._position;
        planet.rotation.x = 40;
        this._planet = planet;
    }

    private _addMaterial():void {
        const planetTexture = new StandardMaterial("planetTexture", this._scene);
        const texture = new Texture(this._texture, this._scene);
        planetTexture.diffuseTexture = texture;
        planetTexture.bumpTexture = new Texture("../assets/images/backgrounds/bump.jpg", this._scene);
        this._planet.material = planetTexture;
    }

    //use this method to animate rotate planet in this._scene.registerBeforeRender(()) method
    public _rotatePlanet():void {
        var earthAxis = new Vector3(Math.sin(23 * Math.PI/180), Math.cos(23 * Math.PI/180), 0);
        var angle = 0.001;
        this._planet.rotate(earthAxis, angle, Space.WORLD);
    }

    public createPlanet() {
        this._createSphere()
        .then(()=>this._addMaterial());
    }
}