import { PlayerInfo } from './PlayerInfo';

export class LoadGame {
  static load() : PlayerInfo {
    const info = new PlayerInfo();
    info.setMap(localStorage.getItem("map", "firstLevel"));
    const pos = JSON.parse(localStorage.getItem("playerPosition"));
    info.setPosition(pos);
    info.setHealth(Number.parseInt(localStorage.getItem("health", "100")));
    info.setKarma(Number.parseInt(localStorage.getItem("karma", "0")));
    info.setLookAtAngle(Number.parseFloat(localStorage.getItem("lookAtAngle", "0")));
    const killed = JSON.parse(localStorage.getItem("killed", []));
    info.setKilled(killed);
    info.setCheckpoint(localStorage.getItem("checkpoint", false));
    return info;
  }

  static save(info: PlayerInfo) {
    localStorage.setItem("map", info.getMap());
    localStorage.setItem("playerPosition", info.getPosition());
    localStorage.setItem("health", info.getHealth());
    localStorage.setItem("karma", info.getKarma());
    localStorage.setItem("lookAtAngle", info.getLookAtAngle());
    localStorage.setItem("killed", JSON.stringify(info.getKilled()));
    localStorage.setItem("checkpoint", info.getCheckpoint());
  }

}
