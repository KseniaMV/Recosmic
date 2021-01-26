import { AdvancedDynamicTexture, Image, TextBlock, Control } from "@babylonjs/gui";

export class BattleGUI {
  private _health_line: Image;
  private _health_circle: Image;
  private _enemyName: TextBlock;
  private _old_health_Width: number;
  private _wonText: TextBlock;
  private _byeText: TextBlock;

  constructor() {
    const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    this._enemyName = new TextBlock();
    this._enemyName.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    this._enemyName.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_TOP;
    this._enemyName.verticalAlignment = 0;
    this._enemyName.top = 20 + "px";
    this._enemyName.fontSize = "28px";
    this._enemyName.color = "white";
    this._enemyName.shadowColor = "black";
    this._enemyName.shadowBlur = 5;
    this._enemyName.shadowOffsetX = -2;
    this._enemyName.shadowOffsetY = 2;
    this._enemyName.text = "Enemy";
    this._enemyName.resizeToFit = true;
    this._enemyName.height = 0.1;
    this._enemyName.width = 0.5;
    this._enemyName.fontFamily =  "Cabin";
    gui.addControl(this._enemyName);

    this._health_line = new Image("image_line", "./assets/images/battle/enemy_line.png");
    this._health_line.width = 0.5;
    this._health_line.height = 0.035;
    this._health_line.verticalAlignment = 0;
    this._health_line.top = 71 + "px";
    gui.addControl(this._health_line);

    const health_bar = new Image("image_bar", "./assets/images/battle/enemy_bar.png");
    health_bar.width = 0.5;
    health_bar.height = 0.05;
    health_bar.verticalAlignment = 0;
    health_bar.top = 65 + "px";
    gui.addControl(health_bar);

    // player health
    this._health_circle =  new Image("health", "../assets/images/battle/health.png");
    this._health_circle.width = "150px";
    this._health_circle.height = "150px";
    this._health_circle.cellId = 0;
    this._health_circle.cellHeight = 100;
    this._health_circle.cellWidth = 100;
    this._health_circle.sourceWidth = 100;
    this._health_circle.sourceHeight = 100;
    this._health_circle.horizontalAlignment = 0;
    this._health_circle.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    this._health_circle.left = "80px";
    this._health_circle.top = "-70px";
    gui.addControl(this._health_circle);


    // won title
    this._wonText = new TextBlock();
    this._wonText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    this._wonText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this._wonText.fontSize = "50px";
    this._wonText.fontWeight = "bold";
    this._wonText.color = "white";
    this._wonText.shadowColor = "black";
    this._wonText.shadowBlur = 5;
    this._wonText.shadowOffsetX = -2;
    this._wonText.shadowOffsetY = 2;
    this._wonText.text = "ANIMAL IS DEAD\nYOU WIN";
    this._wonText.textWrapping = true;
    this._wonText.resizeToFit = true;
    this._wonText.height = 0.1;
    this._wonText.width = 0.5;
    gui.addControl(this._wonText);
    this._wonText.scaleX = 0;
    this._wonText.scaleY = 0;


    // won title
    this._byeText = new TextBlock();
    this._byeText.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
    this._byeText.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
    this._byeText.fontSize = "50px";
    this._byeText.fontWeight = "bold";
    this._byeText.color = "white";
    this._byeText.shadowColor = "black";
    this._byeText.shadowBlur = 5;
    this._byeText.shadowOffsetX = -2;
    this._byeText.shadowOffsetY = 2;
    this._byeText.text = "YOU'RE GOOD, BUT I'M BETTER!";
    this._byeText.textWrapping = true;
    this._byeText.resizeToFit = true;
    this._byeText.height = 0.1;
    this._byeText.width = 0.5;
    this._byeText.fontFamily =  "Cabin";
    gui.addControl(this._byeText);
    this._byeText.scaleX = 0;
    this._byeText.scaleY = 0;
  }

  public setHP (hp: number) {
    let id = 20 - Math.floor(20 / 100 * hp);
    id = id < 0 ? 0 : id;
    id = id > 20 ? 20 : id;
    this._health_circle.cellId = id;
  }

  public setEnemyHealth(percent: number) {
    if (!this._old_health_Width) {
      this._old_health_Width = this._health_line.widthInPixels;
    }

    this._health_line.width = 0.005 * percent;
    this._health_line.left = ((this._health_line.widthInPixels - this._old_health_Width)/2 + 5) + "px";
  }

  public setEnemyName(name: string) {
    this._enemyName.text = name;
  }

  private _scalingAnimation(a, p) {
    if (a < 1) {
      a += 0.05;
      p.scaleX = a;
      p.scaleY = a;
      setTimeout(() => {
        this._scalingAnimation(a, p)
      }, 100);
    }
  }

  public showWin() {
    this._scalingAnimation(0, this._wonText);
  }

  public showByeBye() {
    this._scalingAnimation(0, this._byeText);
  }
}
