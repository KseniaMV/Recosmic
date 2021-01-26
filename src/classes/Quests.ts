import { Scene } from "@babylonjs/core";
import Popup from "./Popup";

export default class Quests {
    private _scene: Scene;
    private _canvas: any;
    public questsList: Array<object>;
    public currentQuest: object;
    public questCount = 0;
    private _questData: unknown;
    public loadedQuestList: Array<object>;

    constructor () {
        this.questsList = [];
        this.loadedQuestList = [];
    }

    public  getQuestsData (){
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
        }).then((result) => {
            return this._createQuestsArray(result);
        })
    }

    private _createQuestsArray (questObject):Array<object> {
        let questArray = [];
        for (const key in questObject) {
           questArray.push(questObject[key]);
        }
        this._questData = questArray;
        return questArray;
    }

    public createQuestsSection () {
        const questSection = document.createElement("div");
        questSection.classList.add("questSection");
        return questSection;
    }

    public createQuestConteiner (conteiner) {
        this.checkSavedQuests()
        .then(()=>{
            this.questsList.forEach((questObject) => {
                console.log(questObject);
                const questConteiner = document.createElement("div");
                    questConteiner.classList.add("questConsteiner");
                const questTitle = document.createElement("h2");
                    questTitle.classList.add("questTitle");
                    questTitle.textContent = this._questData[questObject['id']].name;
                    questTitle.setAttribute("data-state", questObject['status']);
                    if(questObject['status'] === "complete") {
                        questConteiner.classList.add("quest--complete");
                    }
                    questTitle.id = `${questObject['id']}`;
            questConteiner.append(questTitle)
            conteiner.append(questConteiner);
            });
        });
    }

    private _closeQuestDescription (button, conteiner) {
        button.addEventListener("click", () =>{
            conteiner.remove();
            this.hideQuestConteiners();
        })
    }

    public hideQuestConteiners () {
        const questConteiners = document.querySelectorAll(".questConsteiner");
        questConteiners.forEach(conteiner => {
            conteiner.classList.toggle("quest--hidden");
        });
    }

    public getQuestById (targetId) {
        return this._questData[targetId];
    }

    public addQuestToList (id) {
        this.questsList.push({
            id: id,
            status: "notComplete"
        });
    }

    public createQuestDescription (questObject) {
        const questDescription_conteiner = document.createElement("div");
            questDescription_conteiner.classList.add("questDescription_conteiner");
        const description = document.createElement("p");
            description.classList.add("questDescription");
            description.textContent = questObject.description;
        const questName = document.createElement("h2");
            questName.classList.add("questDescription_name");
            questName.textContent = questObject.name;
        const questReward = document.createElement("p");
            questReward.classList.add("questReward");
            questReward.textContent = "Rewards: " + questObject.rewards;
            questDescription_conteiner.append(questName);
            questName.after(description);
            description.after(questReward);
        const closeButton = document.createElement("button");
            closeButton.classList.add("description_close-button");
            closeButton.style.backgroundImage = "url(../assets/images/gui/close.png)";
            questDescription_conteiner.append(closeButton);
            this._closeQuestDescription (closeButton, questDescription_conteiner);
            return questDescription_conteiner;
    }

    public checkQuestCompleteState (id) {
        if(id === 0) {
            this._setCompleteStatus(id);
        }
        if(id === 1) {
            if(localStorage.getItem("cosmic-items")) {
                const data = JSON.parse(localStorage.getItem("cosmic-items")).length;
                if(data === 5) {
                    this._setCompleteStatus(id)
                }
            } 
        }
    }

    private _setCompleteStatus (id) {
        this.checkSavedQuests()
        .then(() => {
            this.questsList.forEach((questObject)=>{
                console.log(questObject['id']);
                if(questObject['id'] === id) {
                    questObject['status'] = "complete";
                    this.getQuestsData()
                    .then(()=> {
                        const popup = new Popup(`The quest "${this._questData[id].name}" is completed`);
                        popup.createPopup();
                        this.saveQuests();
                    })
                }
            });
        })
    }

    public outPutCurrentQuest (id:number) {                     //notice
        const questNotice = document.createElement("p");
        questNotice.classList.add("questNotice");
        questNotice.textContent = `You have new quest: "${this._questData[id].name}"`;
        document.body.append(questNotice);
        setTimeout(() => {
            questNotice.remove();
        }, 3000);
    }

    //-------------save quest to LocalStorage ------------//

    public saveQuests () {
       /* if(localStorage.getItem("cosmic-quests")) {
            //localStorage.clear();
            localStorage.removeItem("cosmic-quests")
        }*/
        const questForSave = JSON.stringify(this.questsList);
        localStorage.setItem("cosmic-quests", questForSave);
    }

    public async checkSavedQuests () {
        const savedQuests = localStorage.getItem("cosmic-quests");
        if(savedQuests) {
            this.questsList = [];
            this.loadedQuestList = JSON.parse(savedQuests);
            this.loadedQuestList.forEach(questObject =>{
                this.questsList.push({
                    id: questObject['id'],
                    status: questObject['status']
                });
            })
        }
    }
}
