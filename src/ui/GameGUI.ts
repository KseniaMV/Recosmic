import { AdvancedDynamicTexture, Button, Rectangle, Image, TextBlock, Control } from "@babylonjs/gui";

export class GameGUI {
  private _gui: AdvancedDynamicTexture;
  private _saveText: TextBlock;
  private _saveRectangle: Rectangle;
  private _demoText: TextBlock;
  private _demoRectangle: Rectangle;
  private _researchRectangle: Rectangle;
  private _researchPic: Image;
  private _researchText: Text;
  private _researchButton: Button;
  private _isResearch: boolean = false;

  constructor() {
    this._gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this._createSave();
    this._createDemo();
    this._createResearch();
  }

  private _createSave() {
    this._saveRectangle = new Rectangle();
    this._saveRectangle.width = 0.5;
    this._saveRectangle.height = 0.15;
    this._saveRectangle.cornerRadius = 20;
    this._saveRectangle.color = "White";
    this._saveRectangle.thickness = 5;
    this._saveRectangle.background = "black";
    this._saveRectangle.alpha = 0.3;
    this._gui.addControl(this._saveRectangle);

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
    this._saveText.fontFamily = "Cabin";
    this._gui.addControl(this._saveText);

    this._saveRectangle.scaleX = 0;
    this._saveRectangle.scaleY = 0;
    this._saveText.scaleX = 0;
    this._saveText.scaleY = 0;
  }

  private _createDemo() {
    this._demoRectangle = new Rectangle();
    this._demoRectangle.width = 0.5;
    this._demoRectangle.height = 0.15;
    this._demoRectangle.cornerRadius = 20;
    this._demoRectangle.color = "White";
    this._demoRectangle.thickness = 5;
    this._demoRectangle.background = "blue";
    this._demoRectangle.alpha = 0.5;
    this._gui.addControl(this._demoRectangle);

    this._demoText = new TextBlock();
    this._demoText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    this._demoText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
    this._demoText.fontSize = "28px";
    this._demoText.color = "white";
    this._demoText.shadowColor = "black";
    this._demoText.shadowBlur = 5;
    this._demoText.shadowOffsetX = -2;
    this._demoText.shadowOffsetY = 2;
    this._demoText.text = "Sorry! This is the end of demo version. We need more donates.";
    this._demoText.resizeToFit = true;
    this._demoText.textWrapping = true;
    this._demoText.height = 0.15;
    this._demoText.width = 0.5;
    this._demoText.fontFamily = "Cabin";
    this._gui.addControl(this._demoText);

    this._demoRectangle.scaleX = 0;
    this._demoRectangle.scaleY = 0;
    this._demoText.scaleX = 0;
    this._demoText.scaleY = 0;
  }

  // research
  private _createResearch() {
    this._researchRectangle = new Rectangle();
    this._researchRectangle.width = 0.5;
    this._researchRectangle.height = 0.57;
    this._researchRectangle.cornerRadius = 20;
    this._researchRectangle.color = "White";
    this._researchRectangle.thickness = 5;
    this._researchRectangle.background = "blue";
    this._researchRectangle.alpha = 0.5;
    this._gui.addControl(this._researchRectangle);

    this._researchPic = new Image("logo", "./assets/images/gui/logo.png");
    this._researchPic.width = 0.39;
    this._researchPic.height = 0.22;
    this._researchPic.top = "-15%";
    this._gui.addControl(this._researchPic);

    this._researchText = new TextBlock();
    this._researchText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    this._researchText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
    this._researchText.fontSize = "28px";
    this._researchText.color = "white";
    this._researchText.shadowColor = "black";
    this._researchText.shadowBlur = 5;
    this._researchText.shadowOffsetX = -2;
    this._researchText.shadowOffsetY = 2;
    this._researchText.text = "Sorry! This is the end of demo version. We need more donates.";
    this._researchText.resizeToFit = true;
    this._researchText.textWrapping = true;
    this._researchText.height = 0.15;
    this._researchText.width = 0.5;
    this._researchText.top = "5%";
    this._researchText.fontFamily = "Cabin";
    this._gui.addControl(this._researchText);

    this._researchButton = Button.CreateImageWithCenterTextButton(
      "research_ok",
      "OK",
      "./assets/images/gui/button2.png"
    );
    this._researchButton.fontFamily =  "Cabin";
    this._researchButton.width = "250px"
    this._researchButton.height = "70px";
    this._researchButton.color = "rgb(19, 55, 90)";
    this._researchButton.fontWeight = "bold";
    this._researchButton.top = "65%";
    this._researchButton.thickness = 0;
    this._researchButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this._researchButton.verticalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    this._gui.addControl(this._researchButton);

    this._researchButton.onPointerDownObservable.add(() => {
      this.hideResearch();
    });

    this._researchRectangle.scaleX = 0;
    this._researchRectangle.scaleY = 0;
    this._researchPic.scaleX = 0;
    this._researchPic.scaleY = 0;
    this._researchText.scaleX = 0;
    this._researchText.scaleY = 0;
    this._researchButton.scaleX = 0;
    this._researchButton.scaleY = 0;
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

  public showDemoText() {
    this._scalingAnimation(0, this._demoText);
    this._scalingAnimation(0, this._demoRectangle);
  }

  public hideDemoText() {
    this._scalingAnimationMinus(1, this._demoText);
    this._scalingAnimationMinus(1, this._demoRectangle);
  }

  public showResearch(name: string) {
    const filename = name.match(/\[(.*?)\]/)[1];
    const animalName = name.match(/\{(.*?)\}/)[1];
    console.log(`name: ${animalName}\nfilename: ../${filename}.png`);

    this._isResearch = true;
    this._scalingAnimation(0, this._researchText);
    this._scalingAnimation(0, this._researchPic);
    this._scalingAnimation(0, this._researchRectangle);
    this._scalingAnimation(0, this._researchButton);
  }

  public hideResearch() {
    this._isResearch = false;
    this._scalingAnimationMinus(1, this._researchText);
    this._scalingAnimationMinus(1, this._researchPic);
    this._scalingAnimationMinus(1, this._researchRectangle);
    this._scalingAnimationMinus(1, this._researchButton);
  }

  public getIsResearch(): boolean {
    return this._isResearch;
  }

  public setIsResearch(is: boolean) {
    this._isResearch = is;
  }
}
