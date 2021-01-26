import { AdvancedDynamicTexture, Button, Rectangle, Control, Image } from "@babylonjs/gui";
import { Scene, Sound }from "@babylonjs/core";

export class ChoiseBoxTree {
  private _getButton: any;
  private _isChose: boolean = false;
  private _objectName: string;

  constructor(scene: Scene, callback: Function) {
    const sfxClick = new Sound("clickChoise", "./assets/sounds/effects/click.wav", scene, null);

    const choiseMenu = AdvancedDynamicTexture.CreateFullscreenUI("ChoiseBoxUI");

    this._getButton = Button.CreateImageWithCenterTextButton(
      "GET",
      "GET FRUIT",
      "./assets/images/gui/button2.png"
    );

    this._getButton.fontFamily = "Cabin";
    this._getButton.width = 0.2
    this._getButton.height = "70px";
    this._getButton.color = "white";
    this._getButton.top = "-25%";
    this._getButton.thickness = 0;
    this._getButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    choiseMenu.addControl(this._getButton);

    this._getButton.onPointerDownObservable.add(() => {
        sfxClick.play();
        this.setShow(false);
        this._isChose = true;
        callback(this._objectName, 'get');
    });
        this.setShow(false);
    }

  public setShow(isShow: boolean, name: string) {
    if (name) {
      this._objectName = name;
    }
    this._getButton.isVisible = isShow;
  }

  public getIsChose() {
    return this._isChose;
  }

  public setIsChose(isChose: boolean) {
    this._isChose = isChose;
  }

}
