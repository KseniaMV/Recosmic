export class PlayerInfo {
  private _health: number;
  private _karma: number;
  private _position: Array<number>;
  private _lookAtAngle: number;
  private _map: string;

  constructor() {
    this._health = 100;
    this._karma = 0;
    this._lookAtAngle = 0;
  }

  public setHealth(health: number) {
    this._health = health;
  }

  public getHealth(): number {
    return this._health;
  }

  public setKarma(karma: number) {
    this._karma = karma;
  }

  public getKarma(): number {
    return this._karma;
  }

  public setLookAtAngle(angle: number) {
    this._lookAtAngle = angle;
  }

  public getLookAtAngle(): number {
    return this._lookAtAngle;
  }

  public setPosition(position: Array<number>) {
    this._position = position;
  }

  public getPosition(): Array<number> {
    return this._position;
  }

  public setMap(map: string) {
    this._map = map;
  }

  public getMap(): string {
    return this._map;
  }
}
