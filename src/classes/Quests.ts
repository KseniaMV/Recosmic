import { Scene } from "@babylonjs/core";
import { TextBlock, AdvancedDynamicTexture } from "@babylonjs/gui";
import Tablet from "./Tablet";

export class Quests {
    private _scene: Scene;
    private _canvas: any;
    private _questsGui: AdvancedDynamicTexture;
    public quests: Array;
    public currentQuest: object;
    private questNumber: number;
    private _questConteiner: TextBlock;
    public isQuestComplete: boolean;
    public questCount = 0;

    constructor (scene: Scene, canvas) {
        this._scene = scene;
        this._canvas = canvas;

        this.createTextGUI();

        const questData = this.getQuestsData()
        .then((result) => {
            this.quests = result;
            setTimeout(() => {
                this.getCurrentQuest(result);
            }, 5000);
        })
        .then(()=> {
            setTimeout(() => {
                this._questsGui.removeControl(this._questConteiner);
            }, 10000);
            this.addCurrentQuestsToTablet();
        });
    }

    createTextGUI () {
        const questsGui = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        this._questsGui = questsGui;
    }

    private  getQuestsData (){
        return new Promise ((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("GET", '../assets/data/quests.json');
            request.send();
            request.onload = () => {
                if(request.status === 200) {
                    resolve (JSON.parse(request.response));
                }else {
                    reject("failed request");
                }
            }
        })
    }

    getCurrentQuest (result) {
        this.currentQuest = result[this.questCount];
        this.outPutCurrentQuest(this.currentQuest);
        this.isQuestComplete = false;
    }

    outPutCurrentQuest (currentQuest) {
        const quest = new TextBlock();
        this._questConteiner = quest;
        quest.name = "currentQuest";
        //quest.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_LEFT;
        quest.textHorizontalAlignment = TextBlock.HORIZONTAL_ALIGNMENT_CENTER;
        //quest.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_BOTTOM;
        quest.textVerticalAlignment = TextBlock.VERTICAL_ALIGNMENT_CENTER;
        quest.fontSize = "36px";
        quest.color = "white";
        quest.outlineWidth = 2;
        quest.outlineColor = "red";
        quest.shadowColor = "black";
        quest.shadowOffsetX = 5;
        quest.shadowOffsetY = 5;
        quest.text = currentQuest.description;
        quest.resizeToFit = true;
        quest.textWrapping = true;
        //quest.height = "150px";
        quest.height = 0.5;
        // quest.width = "350px";
        quest.width = 0.5;
        quest.fontFamily = "Arial";
        this._questsGui.addControl(quest);
    }

    addCurrentQuestsToTablet () {
        const table = new Tablet(this._scene, this._canvas)
        table.addQuest(this.currentQuest);
    }

    checkIsQuestComplite () {
        //если лаборатория найдена
    }

    createQuestCount () {
        this.questCount ++;
    }
}
