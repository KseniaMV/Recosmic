export default class Catalog {
    private totalItemCount: number;
    public currentCount: number;
    public planetData: object;
    public currentPlanet: any;
    sliderConteiner: HTMLDivElement;
    catalogPagination: HTMLDivElement;
    paginationCurrentItem: number;
    paginationItems: any[];
    planets: any[];
    private _itemsConteiner: HTMLDivElement;
    private _items: any[];

    constructor (currentPlanet) {
        this.currentPlanet = currentPlanet;
        this.currentCount = 0;       //количество изученых животных
        this.paginationCurrentItem = 0;
        this.paginationItems = [];
        this.planetData = {};
        this.planets = [];
        this._items = [];

    }

    public getPlanetData (){
        return new Promise ((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.open("GET", '../assets/data/planets.json');
            request.send();
            request.onload = () => {
                if(request.status === 200) {
                    resolve (JSON.parse(request.response));
                }else {
                    reject("failed request");
                }
            };
        });
    }

    public createCatalogSection () {
        const catalogSection = document.createElement("div");
            catalogSection.classList.add("catalogSection");
            this.createSlider(catalogSection);
            return catalogSection;
    }

    private createSlider (conteiner) {
        const sliderConteiner = document.createElement("div");
            sliderConteiner.classList.add("catalog_slider");
            this.sliderConteiner = sliderConteiner;
        const planetData = this.getPlanetData()
        .then((result) => {
            this.planetData = result;
            for (const key in this.planetData) {
                const planetSection = this.createPlanetSection(key,this.planetData[key]);
                sliderConteiner.append(planetSection);
            }
        });
        conteiner.append(sliderConteiner);
        
    }

    public createPlanetSection (name, data) {
        const planetSection = document.createElement("div");
            if(name != this.currentPlanet) {
                planetSection.classList.add("planetSection", "unknown_planet"); 
            }else {
                planetSection.classList.add("planetSection");
            }
            planetSection.setAttribute("data-name", name);
        const planetImage = document.createElement("div");
            planetImage.classList.add("planetSection_image");
            planetImage.style.backgroundImage = `url(../assets/images/planets/${data.image})`;
            planetImage.setAttribute("data-name", name);
        const planetName = document.createElement("h2");
            planetName.classList.add("planetSection_name");
            planetName.textContent = name;
        const planetCount = document.createElement("p");
            planetCount.classList.add("planetSection_count");
            if(name === this.currentPlanet) {
                if(localStorage.getItem("cosmic-items")){
                    const count = JSON.parse(localStorage.getItem("cosmic-items")).length;
                    planetCount.textContent = `${count} / ${data.count}`;
                }else {
                    planetCount.textContent = `${this.currentCount} / ${data.count}`;
                } 
            }else {
                planetCount.textContent = `${this.currentCount} / ${data.count}`;
            }
            planetSection.append(planetImage);
            planetImage.after(planetCount);
            planetCount.after(planetName);
            this.planets.push(planetSection);
            return planetSection;
    }

    public openCurrentPlanetCatalog () {
        this.sliderConteiner.addEventListener("click", (e)=>{
            if(e.target.dataset.name && e.target.dataset.name === this.currentPlanet) {
                const targetPlanetData =  this.planetData[e.target.dataset.name];
                const dataConteiner = this._createDataConteiner(targetPlanetData.image);

                targetPlanetData.animals.forEach(animal => {
                    this._createDefaultItem ("animals", dataConteiner, animal);
                });
                targetPlanetData.plants.forEach(plant => {
                    this._createDefaultItem ("plants", dataConteiner, plant);
                });
                this._hidePlanetSection();
                this.sliderConteiner.append(dataConteiner);
                this._createCloseDataButton (dataConteiner);
                this._checkLocalStorage();
            }
        })
    }

    private _createDataConteiner (image) {
        document.querySelector(".backButton").classList.add("backButton--hide");
        let dataConteiner = document.createElement("div");
        dataConteiner.classList.add("itemsConteiner");
        dataConteiner.style.backgroundImage = `url(../assets/images/planets/${image})`;
        this._itemsConteiner = dataConteiner;
        this.createItemDescription();
        return dataConteiner;
    }

    private _createDefaultItem (itemType, conteiner , itemName) {
        const item = document.createElement("div");
        item.classList.add('itemCard', 'unknown_item');
        item.style.backgroundImage = `url(../assets/images/gui/default_item.png)`;
        item.setAttribute("data-name", itemName);
        item.setAttribute("data-type", itemType);
        conteiner.append(item);
        this._items.push(item);
    }

    private _hidePlanetSection () {
        this.planets.forEach(planet =>{
            planet.classList.toggle("section--hidden");
        });
    }

    private _createCloseDataButton (conteiner) {
        const closeDataButton = document.createElement("button");
            closeDataButton.classList.add("button-closeData");
            closeDataButton.style.backgroundImage = "url(../assets/images/gui/close.png";
            conteiner.append(closeDataButton);
            closeDataButton.addEventListener("click", ()=>{
                document.querySelector(".backButton").classList.remove("backButton--hide");
                conteiner.remove();
                this._hidePlanetSection();
            });
    }

    public getItemDescription (type, name) {
        return new Promise ((resolve, reject) => {
            const request = new XMLHttpRequest();
            const url = `../assets/data/${type}.json`;
            request.open("GET", url);
            request.send();
            request.onload = () => {
                if(request.status === 200) {
                    const data = JSON.parse(request.response);
                    for (const key in data) {
                        if(key === name) {
                            resolve (data[key]);
                        }
                    }
                }else {
                    reject("failed request");
                }
            }
        });
    }

    private createItemDescription () {
        this._itemsConteiner.addEventListener("click", (e)=>{
            const targetItem = e.target;
            if(targetItem.dataset.name) {
                const data = this.getItemDescription(targetItem.dataset.type, targetItem.dataset.name);
                data.then((result) => console.log(result));
            }

        });
    }

    public openItemCard () {
    }

    private _checkLocalStorage () {
        if(localStorage.getItem("cosmic-items")) {
            const data =  JSON.parse(localStorage.getItem("cosmic-items"));
            data.forEach(element => {
                this._items.forEach(item => {
                    if(item.dataset.name === element) {
                        const type = item.dataset.type;
                        let imageName = element;
                        if(element === "Catoxeltis colorful") {
                            imageName = "Catoxeltis_colorful";
                        }
                        if(element === "Purple-brows bat") {
                            imageName = "Purple-brows_bat";
                        }
                        item.style.backgroundImage = `url(../assets/images/${type}/${imageName}.png)`;
                        item.classList.remove("unknown_item");
                    }
                });
            });
        }
    }

}
