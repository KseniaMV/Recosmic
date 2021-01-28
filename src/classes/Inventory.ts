import { Scene } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, StackPanel } from "@babylonjs/gui";
import Popup from "./Popup";

export default class Inventory {
    private _inventoryBG: HTMLDivElement;
    private _inventory: HTMLDivElement;
    constructor(){
        

    }

    closeInventory () {
        
    }

    private _getDropData (type) {
        return new Promise ((resolve, reject) => {
            const request = new XMLHttpRequest();
            const url = `../assets/data/${type}.json`;
                request.open("GET", url);
                request.send();
                request.onload = function () {
                    if(request.status === 200) {
                        const data = request.response;
                        resolve(JSON.parse(data));
                    }else {
                        reject("Not found");
                    }
                }
        });
    }

   public getItem (name, type, mode) {
        const itemData = this._getDropData(type);
        itemData.then((data)=> {
            const fruit = data[name].drop;
            this._setDropItemToLocalStorage(fruit);
        });
    }

    private _setDropItemToLocalStorage (fruit) {
        let dropList = [];
        if(localStorage.getItem("cosmic-drop")) {
            dropList = JSON.parse(localStorage.getItem("cosmic-drop")); 
            if(dropList.some((item) => item.name === fruit)){
                dropList.map((itemObj) => {
                    if(itemObj.name === fruit) {
                        itemObj.count = Number(itemObj.count) + 1;
                    }
                })
            }else {
                dropList.push({name : fruit, count : 1});
            }
        }else {
            dropList.push({name : fruit, count : 1});
        }
        localStorage.setItem("cosmic-drop", JSON.stringify(dropList));
        const popup = new Popup("New item is added to inventory");
        popup.createPopup();
    }

    public openInventory () {
        document.addEventListener("keydown", (event) => {
            if(event.keyCode == "73") {
                this._createInventorConteiner();
                this._getDropListFromLocalStorage();
            }
        })

    }

    private _createInventorConteiner () {
        const inventoryBG = document.createElement("div");
            inventoryBG.classList.add("inventoryBG");
        const conteiner = document.createElement("div");
            conteiner.classList.add("inventory-conteiner")
            inventoryBG.append(conteiner);
            document.body.append(inventoryBG);
            this._inventoryBG = inventoryBG;
            this._inventory = conteiner;
        const closeInventoryButton = document.createElement("button");
            closeInventoryButton.classList.add("tablet_button", "closeInventoryButton");
            closeInventoryButton.style.backgroundImage = 'url(../assets/images/gui/close.png)';
            conteiner.append(closeInventoryButton);
            closeInventoryButton.addEventListener("click", ()=>{
                inventoryBG.remove();
            });
    }

    private _createItem(image, conteiner, count, name) {
        const inventoryItem = document.createElement("button");
            inventoryItem.classList.add("inventory_item");
            inventoryItem.style.backgroundImage = image;
            conteiner.append(inventoryItem);
        const itemCount = document.createElement("p");
            itemCount.classList.add("inventory_item-count");
            itemCount.textContent = count;
            inventoryItem.append(itemCount);
        const itemName = document.createElement("p");
            itemName.classList.add("dropItem-name");
            itemName.textContent = name;
            inventoryItem.append(itemName);
            inventoryItem.addEventListener("mouseover", ()=>{
                itemName.classList.toggle("dropItem-name--show");
            });
            inventoryItem.addEventListener("mouseout", ()=>{
                itemName.classList.toggle("dropItem-name--show");
            });
    }

    private _getDropListFromLocalStorage () {
        return new Promise((resolve, reject) =>{
            const request = new XMLHttpRequest();
                request.open("GET", "../assets/data/plants_drop.json");
                request.send();
                request.onload = function () {
                    if(request.status === 200) {
                        resolve(JSON.parse(request.response));
                    }
                }
        }).then((data)=> {
            const dropData = JSON.parse(localStorage.getItem("cosmic-drop"));
            dropData.forEach(element => {
                console.log(element);
                const image = data[element.name].image;
                const count = element.count;
                this._createItem(image, this._inventory, count, element.name );
            });

        })
    }


    getItemDescritpion () {

    }
}