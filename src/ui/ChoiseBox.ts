import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";
import { Scene, Sound }from "@babylonjs/core";

export class ChoiseBox {
  private _attackButton: any;
  private _investigateButton: any;
  private _isChose: boolean = false;
  private _objectName: string;

  constructor(scene: Scene, callback: Function) {
    const sfxClick = new Sound("clickChoise", "./assets/sounds/effects/click.wav", scene, null);

    const choiseMenu = AdvancedDynamicTexture.CreateFullscreenUI("ChoiseBoxUI");

    this._attackButton = Button.CreateImageWithCenterTextButton(
      "ATTACK",
      "EXPERIMENT",
      "./assets/images/gui/button2.png"
    );

    this._attackButton.fontFamily = "Cabin";
    this._attackButton.width = 0.2
    this._attackButton.height = "70px";
    this._attackButton.color = "white";
    this._attackButton.top = "-25%";
    this._attackButton.thickness = 0;
    this._attackButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    choiseMenu.addControl(this._attackButton);

    this._attackButton.onPointerDownObservable.add(() => {
      sfxClick.play();
      this.setShow(false);
      this._isChose = true;
      callback(this._objectName, 'attack');
    });

    this._investigateButton = Button.CreateImageWithCenterTextButton(
      "INVESTIGATE",
      "RESEARCH",
      "./assets/images/gui/button2.png"
    );

    this._investigateButton.fontFamily = "Cabin";
    this._investigateButton.width = 0.2
    this._investigateButton.height = "70px";
    this._investigateButton.color = "white";
    this._investigateButton.top = "-15%";
    this._investigateButton.thickness = 0;
    this._investigateButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    choiseMenu.addControl(this._investigateButton);

    this._investigateButton.onPointerDownObservable.add(() => {
      sfxClick.play();
      this.setShow(false);
      this._isChose = true;
      callback(this._objectName, 'research');
    });

    this.setShow(false);
  }

  public setShow(isShow: boolean, name: string) {
    if (name) {
      this._objectName = name;
    }
    this._attackButton.isVisible = isShow;
    this._investigateButton.isVisible = isShow;
  }

  public getIsChose() {
    return this._isChose;
  }

  public setIsChose(isChose: boolean) {
    this._isChose = isChose;
  }

}
