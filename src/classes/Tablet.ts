import { Scene} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control } from "@babylonjs/gui";
import Inventory from './Inventory';
import Quests  from './Quests';

//27 esc
export default class Tablet {
    private _scene: Scene;
    private _canvas: any;
    private _tabletGui: AdvancedDynamicTexture;
    private _tabletButton: Button; 
    public encyclopedia: Array<object>;
    public quests: Array<object>;
    public isTabletOpen: boolean;
    public tabletBG: HTMLDivElement;
    public tablet: HTMLDivElement;
    private _settingButton: HTMLButtonElement;
    private _questsButton: HTMLButtonElement;
    private _closeButton: HTMLButtonElement;
    private _catalogButton: HTMLButtonElement;

    constructor(scene: Scene, canvas){
        this._scene = scene;
        this._canvas = canvas;
        this.encyclopedia = [];
        this.quests = [];
        this.isTabletOpen = false;
        this.createTablet();
        this._createGUI();

    }

   private _createGUI () {
        const tabletGui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._tabletGui = tabletGui;
        this._createOpenTabletButton();
        this._openTablet();
    }

    private _createOpenTabletButton () {
        const tabletButton = Button.CreateImageWithCenterTextButton(
            "tabButton",
            "",
            "../assets/images/gui/tablet2.png"
        );
        tabletButton.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        tabletButton.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        tabletButton.top = "20px";
        tabletButton.left = "-20px";
        tabletButton.width = "150px";
        tabletButton.height = "100px";
        tabletButton.thickness = 0;
        this._tabletGui.addControl(tabletButton);
        this._tabletButton = tabletButton; 
    }

    public createTablet ():void{
        const tabletBG = document.createElement("div");
            tabletBG.classList.add("tabletBG");
            tabletBG.style.cursor = "url(../assets/images/gui/cursor2.png), pointer";
            document.body.append(tabletBG);
            this.tabletBG = tabletBG;
        const tablet = document.createElement("div");
            tablet.classList.add("tablet");
            tabletBG.append(tablet);
            this.tablet = tablet;
        const settingButton = this._createButtons("settingButton", "setting.png");
        const catalogButton = this._createButtons("catalogButton", "catalog.png");
        const questsButton = this._createButtons("questsButton", "quests.png");
        const closeButton = this._createButtons("closeButton", "close.png");
        this._settingButton = settingButton;
        this._closeButton = closeButton;
        this._questsButton = questsButton;
        this._catalogButton = catalogButton;
    }

    private _createButtons (buttonName: string, buttonImage: string):HTMLButtonElement {
        const button = document.createElement("button");
            button.classList.add("tablet_button", buttonName);
            button.style.backgroundImage = `url(../assets/images/gui/${buttonImage})`;
            button.style.cursor = "url(../assets/images/gui/cursor2.png), pointer";
            this._addButtonToTablet(button);
            this._addEvents(button);
            return button;
    }

    private _addButtonToTablet (button: HTMLButtonElement):void{
        this.tablet.append(button);
    }


    private _openTablet ():void{
        this._tabletButton.onPointerDownObservable.add(() => {
            this.isTabletOpen = true;
            this.tabletBG.style.display = "flex";
            this.tablet.style.display = "flex";
        });
    }

    private _addEvents (button: HTMLButtonElement):void {
        if(button.classList.contains("closeButton")){
            button.addEventListener("click", ()=>{
                this._closeTablet();
            }) ;
        }
    }

    private _closeTablet() {
        this.tabletBG.style.display = "none";
        this.tablet.style.display = "none";
        this.isTabletOpen = false;
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

    createCatalogSection () {

    }

    openCatalog () {

    }

    closeCatalog () {

    }

    addInfoToCatalog () {

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