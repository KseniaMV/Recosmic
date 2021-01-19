import { DivideBlock, Scene, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control, Image, StackPanel, PlanePanel, HolographicButton, GUI3DManager } from "@babylonjs/gui";

export default class Tablet {
    private _scene: any;
    private _tabletGui: AdvancedDynamicTexture;
    private _tabletButton: Button; //HTMLButtonElement
    private _panel: StackPanel;
    private _canvas: any;
    public encyclopedia: Array<object>;
    public quests: Array<object>;
    public isTabletOpen: boolean;
    callback: Function;

    constructor(scene: Scene, canvas, callback){
        this._scene = scene;
        this._canvas = canvas;
        this.createGUI();
        this.createTabletButton();
        this.openTablet();
        this.encyclopedia = [];
        this.quests = [];
        this.isTabletOpen = false;
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

    createTablet () {
        const tabletBG = new Rectangle("tabletBackground");
            tabletBG.width = 1;
            tabletBG.thickness = 0;
            this._tabletGui.addControl(tabletBG);
                const bgImage = new Image("bgImage", "./assets/images/backgrounds/tabletBg.png");
                tabletBG.addControl(bgImage);

                const settingsButton = Button.CreateImageWithCenterTextButton(
                    "settings",
                    "",
                    "./assets/images/gui/settings.svg"
                );
                settingsButton.width = "80px"
                settingsButton.height = "80px"; 
                settingsButton.color = "rgb(255,255,255)";
                settingsButton.top = "-35%";
                settingsButton.left = "-40%";
                settingsButton.thickness = 0;
                tabletBG.addControl(settingsButton);
                tabletBG.isVisible = true; 
    }

    openTablet (){
        this._tabletButton.onPointerDownObservable.add(() => {
            this.isTabletOpen = true;
            const fn = this.callback;
            fn(this.isTabletOpen);
            this.createTablet();
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