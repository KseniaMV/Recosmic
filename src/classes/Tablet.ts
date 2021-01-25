import { Scene} from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Rectangle, Control } from "@babylonjs/gui";
import Catalog from "./Catalog";
import Inventory from './Inventory';
import Quests  from './Quests';

//27 esc
export default class Tablet {
    private _scene: Scene;
    private _canvas: any;
    private _tabletGui: AdvancedDynamicTexture;
    private _tabletButton: HTMLButtonElement; 
    public isTabletOpen: boolean;
    public tabletBG: HTMLDivElement;
    public tablet: HTMLDivElement;
    private _settingButton: HTMLButtonElement;
    private _questsButton: HTMLButtonElement;
    private _closeButton: HTMLButtonElement;
    private _catalogButton: HTMLButtonElement;
    public questsData: Array<object>;
    public quests: Quests;
    public sceneQuestId: Array<number>;
    private _backButton: HTMLButtonElement;

    constructor(scene: Scene, canvas){
        this._scene = scene;
        this._canvas = canvas;
        this.isTabletOpen = false;
        this.sceneQuestId = [0,1];
        this.createTablet();
        this._createGUI();
        this.quests = new Quests(this._scene, this._canvas);  //массив всех квестов дотсупный на планете
        this.quests.getQuestsData()
        .then(()=>{
            setTimeout(() => {
                this.quests.outPutCurrentQuest(0);
                this.quests.questsList.push({
                    id : 0,
                    status : "notComplete"
                });
                this._createNoticeTablet();
            }, 5000);
            setTimeout(() => {
                this.quests.outPutCurrentQuest(1);
                this.quests.questsList.push({
                    id : 1,
                    status : "notComplete"
                });
            }, 9000);
        });
    }

    private _createGUI () {
        const tabletGui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._tabletGui = tabletGui;
        this._createOpenTabletButton();
        this._openTablet();
    }

    private _createOpenTabletButton () {
        const tabletButton = document.createElement("button");
            tabletButton.classList.add("openTabletButton");
            tabletButton.style.backgroundImage = "url(../assets/images/gui/tablet2.png)";
            document.body.append(tabletButton);
            this._tabletButton = tabletButton;
    }

    public createTablet ():void{
        const tabletBG = document.createElement("div");
            tabletBG.classList.add("tabletBG", "section--hidden");
            tabletBG.style.cursor = "url(../assets/images/gui/cursor2.png), pointer";
            document.body.append(tabletBG);
            this.tabletBG = tabletBG;
        const tablet = document.createElement("div");
            tablet.classList.add("tablet", "section--hidden");
            tabletBG.append(tablet);
            this.tablet = tablet;
        const settingButton = this._createButtons("settingButton", "setting.png");
        const catalogButton = this._createButtons("catalogButton", "catalog.png");
        const questsButton = this._createButtons("questsButton", "quests.png");
        const closeButton = this._createButtons("closeButton", "close.png");
        const backButton = this._createButtons("backButton","back.png");
        this._settingButton = settingButton;
        this._closeButton = closeButton;
        this._questsButton = questsButton;
        this._catalogButton = catalogButton;
        this._backButton = backButton;
    }

    private _createButtons (buttonName: string, buttonImage: string):HTMLButtonElement {
        const button = document.createElement("button");
            button.classList.add("tablet_button", buttonName);
            button.style.backgroundImage = `url(../assets/images/gui/${buttonImage})`;
            button.style.cursor = "url(../assets/images/gui/cursor_point.png), pointer";
            this._addButtonToTablet(button);
            this._addEvents(button);
            return button;
    }

    private _addButtonToTablet (button: HTMLButtonElement):void{
        if(!button.classList.contains("backButton")) {
            this.tablet.append(button);
        }
    }

    private _openTablet ():void{
        this._tabletButton.addEventListener("click",  ()=> {
            this._playClickSound();
            this.isTabletOpen = true;
            this.tabletBG.classList.add("section--visible");
            this.tablet.classList.add("section--visible");
            if(this._tabletButton.classList.contains("openTabletButton--active")){
                this._tabletButton.classList.remove("openTabletButton--active");
            }
            this._tabletButton.disabled = true;
        });
    }

    private _addEvents (button: HTMLButtonElement):void {
        if(button.classList.contains("closeButton")){
            button.addEventListener("click", ()=>{
                this._playClickSound();
                this._closeTablet();
            }) ;
        }
        if(button.classList.contains("questsButton")){
            button.addEventListener("click", ()=>{
                this._playClickSound();
                this._clearTablet();
                this._openQuestsSection();
            }) ;
        }
        if(button.classList.contains("catalogButton")){
            button.addEventListener("click", ()=>{
                this._playClickSound();
                this._clearTablet();
                this._openCatalogSection();
            }) ;
        }
        if(button.classList.contains("settingButton")){
            button.addEventListener("click", ()=>{
                this._playClickSound();
                this._clearTablet();
                this._openSettingSection();
            }) ;
        }
        if(button.classList.contains("backButton")){
            button.addEventListener("click", ()=>{
                this._playClickSound();
                this._back(button);
            }) ;
        }
    }

    private _closeTablet() {
        this.tabletBG.classList.remove("section--visible");
        this.tablet.classList.remove("section--visible");
        this.isTabletOpen = false;
        this._tabletButton.disabled = false;
    }

    private _clearTablet () {
        this.tablet.classList.remove("section--visible");
        this._backButton.classList.remove("backButton--hidden");
    }

    private _createNoticeTablet () {
        this._tabletButton.classList.add("openTabletButton--active");
    }

    private _back(button:HTMLButtonElement) {
        const targetSection = button.parentElement;
        targetSection.remove();
        this.tablet.classList.remove("section--hidden");
        this.tablet.classList.add("section--visible");
    }

    //---------------setting section----------------//

    private _openSettingSection () {
        const settingSection  = document.createElement("div");
            settingSection.classList.add("settingSection");
            settingSection.append(this._backButton);
            this.tabletBG.append(settingSection);
        const saveGameButton = document.createElement("button")
            saveGameButton.classList.add("savegame-button");
            saveGameButton.textContent = "save game";
        const exitButton = document.createElement("button")
            exitButton.classList.add("exit-button");
            exitButton.textContent = "exit game";
        
            settingSection.append(saveGameButton);
            saveGameButton.after(exitButton);
    }

    public saveGame () {

    }

    public exitGame () {

    }

    //----------------catalog section------------//

    private _openCatalogSection () {
        const catalog = new Catalog("Babylon");
        const catalogSection = catalog.createCatalogSection(); 
            this.tabletBG.append(catalogSection);
            catalogSection.append(this._backButton);
            catalog.openCurrentPlanetCatalog(); 

       /* const pagination = catalog.pagination();
            catalogSection.append(pagination); */
    }

    addInfoToCatalog () {

    }

    //-----------------quest section ---------------------------//

    getQuestionsData () {
        return this.quests.getQuestsData();
    }

    private _openQuestsSection () {
        const questSection = this.quests.createQuestsSection();
            questSection.classList.add("questSection");
            questSection.append(this._backButton);
            this.tabletBG.append(questSection);
            this.quests.createQuestConteiner(questSection);
            questSection.addEventListener("click", (event)=>{
                this._playClickSound();
                if(event.target.id) {
                    this.quests.hideQuestConteiners();
                    const questDescription = this.quests.getQuestById(event.target.id)
                    const description = this.quests.createQuestDescription(questDescription);
                    questSection.append(description);
                };
            });
    }

    closeQuestsionSection () {

    }

    setQuestStatus () {
        
    }

    private _playClickSound() {
        const sound  = new Audio("../assets/sounds/effects/table_click.wav");
        sound.play();
    }

}