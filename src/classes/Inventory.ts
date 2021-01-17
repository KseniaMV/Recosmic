import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, StackPanel } from "@babylonjs/gui";

export default class Inventory {
    private _scene: any;
    private _inventoryGui: AdvancedDynamicTexture;
    private _inventoryButton: Button; //HTMLButtonElement
    private _panel: StackPanel;
    private _canvas: any;


    constructor(scene: Scene, canvas){
        this._scene = scene;
        this._canvas = canvas;

        this.createGUI();
        this.createInventoryButton();
        this.openInventory();

    }

    createGUI () {
        const inventoryGui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._inventoryGui = inventoryGui;
    }

    createInventoryButton () {
        const inventoryButton = Button.CreateImageWithCenterTextButton(
            "inventoryButton",
            "",
            "../assets/images/gui/Kriminalist.png"
        );
        inventoryButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        inventoryButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        inventoryButton.top = "-80px";
        inventoryButton.left = "-64px";
        inventoryButton.width = "80px";
        inventoryButton.height = "50px";
        inventoryButton.thickness = 0;
        this._inventoryGui.addControl(inventoryButton);
        this._inventoryButton = inventoryButton; 
    }

    createInventory () {


    }

    openInventory () {
        this._inventoryButton.onPointerDownObservable.add(() => {
            console.log("open");
        });
    }

    closeInventory () {
        this._canvas.addEventListener("click", () =>{
            console.log("close inventory");
        })
    }

    addItem () {

    }

    deleteItem () {

    }

    getItemDescritpion () {

    }
}