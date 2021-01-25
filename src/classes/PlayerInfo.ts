export class PlayerInfo {
  private _health: number;
  private _karma: number;
  private _position: Array<number>;
  private _lookAtAngle: number;
  private _map: string;
  private _enemyName: string;
  private _killed: Array<string>;

  constructor() {
    this._health = 100;
    this._karma = 0;
    this._lookAtAngle = 0;
    this._killed = []
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

  public setEnemyName(name: string) {
    this._enemyName = name;
  }

  public getEnemyName(): string {
    return this._enemyName;
  }

  public getKilled(): Array<string> {
    return this._killed;
  }

  public setKilled(killed: Array<string>) {
    this._killed = killed;
  }

  public pushKilled(name: string) {
    this._killed.push(name);
  }
}
