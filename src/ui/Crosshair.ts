import { AdvancedDynamicTexture, Image } from "@babylonjs/gui";

export class Crosshair {
  constructor() {
    const guiCrosshair = AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const image = new Image("crosshair", "./assets/textures/crosshair.png");
    image.widthInPixels = 35;
    image.heightInPixels = 35;
    guiCrosshair.addControl(image);
  }
}
