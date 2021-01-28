import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, Image, TextBlock } from "@babylonjs/gui";

export class CharacterState {
    private _stateGUI: AdvancedDynamicTexture;
    private _effect: AdvancedDynamicTexture;
    private _carma: Image;
    private _health: Image;
    private _effect1: Image;
    private _effect2: Image;
    private _effect3: Image;
    private _scene: Scene;
    private _effectGui: AdvancedDynamicTexture;
    private _effectName: TextBlock;
    private _effectButton: Button;
    constructor (scene: Scene) {
        this._scene = scene;
        this.createCharacterStateGUI();
        this.createHealth();
        this.createKarma();
        this.createEffect();
    }

    createCharacterStateGUI () {
        const stateGUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._stateGUI  = stateGUI;
    }

    createHealth () {
        const health =  new Image("health", "../assets/sprites2/health_sprite.png");
        health.width = "110px";
        health.height = "100px";
        health.cellId = 0;
        health.cellHeight = 100;
        health.cellWidth = 85;
        health.sourceWidth = 85;
        health.sourceHeight = 100;
        health.horizontalAlignment = 0;
        health.verticalAlignment = 0;
        health.left = "60px";
        health.top = "40px";
        this._stateGUI.addControl(health);
        this._health = health;
        this._health.onPointerEnterObservable.add(()=>{
          this.effectOnHover(this._health);
        });
        this._health.onPointerOutObservable.add(()=>{
          this._effectGui.removeControl(this._effectButton);
      });
    }

    createKarma () {
        const karma =  new Image("karma", "../assets/sprites2/carma_sprite.png");
        karma.width = "100px";
        karma.height = "100px";
        karma.cellId = 0;
        karma.cellHeight = 100;
        karma.cellWidth = 85;
        karma.sourceWidth = 85;
        karma.sourceHeight = 100;
        karma.horizontalAlignment = 0;
        karma.verticalAlignment = 0;
        karma.left = "60px";
        karma.top = "140px";
        this._stateGUI.addControl(karma);
        this._carma = karma;
        this._carma.onPointerEnterObservable.add(()=>{
            this.effectOnHover(this._carma);
        });
        this._carma.onPointerOutObservable.add(()=>{
          this._effectGui.removeControl(this._effectButton);
      });

    }

    createEffect () {
        const effect1 =  new Image("effect1", "../assets/sprites2/effect1.png");
        effect1.width = "50px";
        effect1.height = "50px";
        effect1.cellId = 0;
        effect1.cellHeight = 50;
        effect1.cellWidth = 50;
        effect1.sourceWidth = 50;
        effect1.sourceHeight = 50;
        effect1.horizontalAlignment = 0;
        effect1.verticalAlignment = 0;
        effect1.left = "170px";
        effect1.top = "15px";
        this._stateGUI.addControl(effect1);
        this._effect1 = effect1;
        this._effect1.onPointerEnterObservable.add(()=>{
          this.effectOnHover(this._effect1);
        });
        this._effect1.onPointerOutObservable.add(()=>{
          this._effectGui.removeControl(this._effectButton);
      });

        const effect2 =  new Image("effect2", "../assets/sprites2/effect2.png");
        effect2.width = "50px";
        effect2.height = "50px";
        effect2.cellId = 0;
        effect2.cellHeight = 50;
        effect2.cellWidth = 50;
        effect2.sourceWidth = 50;
        effect2.sourceHeight = 50;
        effect2.horizontalAlignment = 0;
        effect2.verticalAlignment = 0;
        effect2.left = "180px";
        effect2.top = "75px";
        this._stateGUI.addControl(effect2);
        this._effect2 = effect2;
        this._effect2.onPointerEnterObservable.add(()=>{
            this.effectOnHover(this._effect2);
        });
        this._effect2.onPointerOutObservable.add(()=>{
          this._effectGui.removeControl(this._effectButton);
      });


        const effect3 =  new Image("effect3", "../assets/sprites2/effect3.png");
        effect3.width = "50px";
        effect3.height = "50px";
        effect3.cellId = 0;
        effect3.cellHeight = 50;
        effect3.cellWidth = 50;
        effect3.sourceWidth = 50;
        effect3.sourceHeight = 50;
        effect3.horizontalAlignment = 0;
        effect3.verticalAlignment = 0;
        effect3.left = "160px";
        effect3.top = "130px";
        this._stateGUI.addControl(effect3);
        this._effect3 = effect3;
        this._effect3.onPointerEnterObservable.add(()=>{
            this.effectOnHover(this._effect3);
        });
        this._effect3.onPointerOutObservable.add(()=>{
          this._effectGui.removeControl(this._effectButton);
      });
    }

    effectOnHover (effect) {
        const effectGUI = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._effectGui = effectGUI;
        const effectButton = Button.CreateImageWithCenterTextButton(
            "inventoryButton",
            effect.name,
            ""
        );
        effectButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        effectButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        effectButton.top = effect._currentMeasure.top;
        effectButton.left = effect._currentMeasure.left;
        effectButton.width = "80px";
        effectButton.height = "50px";
        effectButton.thickness = 0;
        effectButton.color = "white";
        this._effectGui.addControl(effectButton)
        this._effectButton = effectButton;

    }


    upHP () {
      if (this._health.cellId > 0) {
        this._health.cellId--;
      }
    }

    downHP () {
      if (this._health.cellId < 20) {
        this._health.cellId++;
      }
    }

    setHP (hp: number) {
      let id = 20 - Math.floor(20 / 100 * hp);
      id = id < 0 ? 0 : id;
      id = id > 20 ? 20 : id;
      this._health.cellId = id;
    }

    upCarma () {
      if (this._carma.cellId < 20) {
        this._carma.cellId++;
      }
    }

    downCarma () {
      if (this._carma.cellId > 0) {
        this._carma.cellId--;
      }
    }

    setCarma (carma: number) {
      const id = Math.floor(20 / 100 * carma);
      this._carma.cellId = id;
    }

    setEffect (effect) {

    }

    removeEffect () {

    }
}
