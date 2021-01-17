import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image, StackPanel } from "@babylonjs/gui";

export default class Tablet {
    private _scene: any;
    private _tabletGui: AdvancedDynamicTexture;
    private _tabletButton: Button; //HTMLButtonElement
    private _panel: StackPanel;
    private _canvas: any;
    public encyclopedia: Array<object>;
    public quests: Array<object>;


    constructor(scene: Scene, canvas){
        this._scene = scene;
        this._canvas = canvas;

        this.createGUI();
        this.createTabletButton();
        this.openTablet();
        this.encyclopedia = [];
        this.quests = [];

    }

    createGUI () {
        const tabletGui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._tabletGui = tabletGui;
    }

    createTabletButton () {
        const tabletButton = Button.CreateImageWithCenterTextButton(
            "tabButton",
            "",
            "../assets/images/gui/tablet.png"
        );
        tabletButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        tabletButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        tabletButton.top = "60px";
        tabletButton.left = "-64px";
        tabletButton.width = "150px";
        tabletButton.height = "100px";
        tabletButton.thickness = 0;
        this._tabletGui.addControl(tabletButton);
        this._tabletButton = tabletButton; 
    }

    openTablet () {
        this._tabletButton.onPointerDownObservable.add(() => {
            console.log("tablet open");
        });
    }

    closeTablet () {
        this._canvas.addEventListener("click", () =>{
            console.log("close tablet");
        })
    }


    //settings section

    createSettingsSection () {

    }

    openSettings () {

    }

    closeSettings () {

    }

    saveGame () {

    }

    exitGame () {

    }

    //encyclopedia section

    createEncyclopediaSection () {

    }

    openEncyclopedia () {

    }

    closeEncyclopedia () {

    }

    addInfoToEncyclopedia () {

    }

    //quest section 

    createQuestsSection () {

    }

    openQuestsSection () {

    }

    closeQuestsionSection () {

    }

    addQuest (quest) {
        this.quests.push(quest);
        console.log(quest.name);
        console.log(quest.description);
    }

    setQuestStatus () {
        
    }
}