export default class MoveRools {
    private _moveBG: HTMLDivElement;
    private _rools: HTMLDivElement;

    public createMoveRools():void{
            const moveBG = document.createElement("div");
            moveBG.classList.add("moveBG");
            moveBG.style.cursor = "url(../assets/images/gui/cursor2.png), pointer";
            document.body.append(moveBG);
            this._moveBG = moveBG;
        const rools = document.createElement("div");
            rools.classList.add("roolsSection");
        const title = document.createElement("h2");
            title.textContent = "Move and actions";
        const sectionMove = document.createElement("div");
            sectionMove.classList.add("rools_section-move");
            sectionMove.style.backgroundImage = "url(../assets/images/backgrounds/move.png)";
        const sectionInventory = document.createElement("div");
            sectionInventory.classList.add("rools_section-inventory");
            sectionInventory.style.backgroundImage = "url(../assets/images/backgrounds/inventory_open.png)";
        const button = this._createCloseRoolsButton();
        moveBG.append( rools);
        rools.append(title);
        title.after(sectionMove);
        sectionMove.after(sectionInventory);
        sectionInventory.after(button);
        this._rools =  rools;
    }
    
    private _createCloseRoolsButton () {
        const button = document.createElement("button");
        button.classList.add("tablet_button", "rools_button");
        button.style.backgroundImage = `url(../assets/images/gui/close.png`;
        button.style.cursor = "url(../assets/images/gui/cursor_point.png), pointer";
        this._closeMoveRools(button);
        return button;
    }

    private _closeMoveRools (button) {
        button.addEventListener("click", () =>{
            this._moveBG.remove();
        });
    }


}