import { AdvancedDynamicTexture, Rectangle, Image, TextBlock, Control } from "@babylonjs/gui";

export class GameGUI {
  private _saveText: TextBlock;
  private _saveRectangle: Rectangle;

  constructor() {
    const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this._saveRectangle = new Rectangle();
    this._saveRectangle.width = 0.5;
    this._saveRectangle.height = 0.15;
    this._saveRectangle.cornerRadius = 20;
    this._saveRectangle.color = "White";
    this._saveRectangle.thickness = 5;
    this._saveRectangle.background = "black";
    this._saveRectangle.alpha = 0.3;
    gui.addControl(this._saveRectangle);

    this._saveText = new TextBlock();
    this._saveText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    this._saveText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
    this._saveText.fontSize = "28px";
    this._saveText.color = "white";
    this._saveText.shadowColor = "black";
    this._saveText.shadowBlur = 5;
    this._saveText.shadowOffsetX = -2;
    this._saveText.shadowOffsetY = 2;
    this._saveText.text = "The game has been saved.";
    this._saveText.resizeToFit = true;
    this._saveText.textWrapping = true;
    this._saveText.height = 0.15;
    this._saveText.width = 0.5;
    this._saveText.fontFamily = "Arial";
    gui.addControl(this._saveText);

    this._saveRectangle.scaleX = 0;
    this._saveRectangle.scaleY = 0;
    this._saveText.scaleX = 0;
    this._saveText.scaleY = 0;
  }

  private _scalingAnimation(a, p) {
    if (a < 1) {
      a += 0.05;
      p.scaleX = a;
      p.scaleY = a;
      setTimeout(() => {
        this._scalingAnimation(a, p)
      }, 0.1);
    } else {
      p.scaleX = 1.0;
      p.scaleY = 1.0;
    }
  }

  private _scalingAnimationMinus(a, p) {
    if (a > 0) {
      a -= 0.1;
      p.scaleX = a;
      p.scaleY = a;
      setTimeout(() => {
        this._scalingAnimationMinus(a, p)
      }, 50);
    } else {
      p.scaleX = 0;
      p.scaleY = 0;
    }
  }

  public showSaveText() {
    this._scalingAnimation(0, this._saveText);
    this._scalingAnimation(0, this._saveRectangle);
  }

  public hideSaveText() {
    this._scalingAnimationMinus(1, this._saveText);
    this._scalingAnimationMinus(1, this._saveRectangle);
  }
}
