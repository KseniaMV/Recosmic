
export default class Popup {
    private _message: string;
    private _popup: HTMLDivElement;
    constructor(message: string) {
        this._message = message;
    }

    public createPopup () {
        const popup = document.createElement("div");
        popup.classList.add("popup");
        popup.textContent = this._message;
        document.body.append(popup);
        this._popup = popup;
        this._deletePopup();
    }

    private _deletePopup () {
        setTimeout(() => {
            this._popup.remove();
        }, 2000);
    }
}