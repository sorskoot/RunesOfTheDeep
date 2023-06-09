import { SoundfxPlayer } from "./utils/soundfx-player.js";
import { MusicPlayer } from "./utils/music-player.js";
import { GameState } from "./classes/gameState.js";
import { ObjectCache } from "@sorskoot/wonderland-components";
import { singleton } from "tsyringe";

@singleton()
class GameGlobals {
  private static _instance: GameGlobals | null = null;

  //gameState: GameState;
  soundFxPlayer: SoundfxPlayer;
  //musicPlayer: MusicPlayer;
  // particlePool: null;
  globalObjectCache: ObjectCache | null;

  constructor() {
    //this.gameState = container.resolve<GameState>(GameState);
    this.soundFxPlayer = new SoundfxPlayer();
    //this.musicPlayer = new MusicPlayer();
    //  this.particlePool= null;
    this.globalObjectCache = null;
  }

  static get instance(): GameGlobals {
    if (GameGlobals._instance === null) {
      GameGlobals._instance = new GameGlobals();
    }
    return GameGlobals._instance;
  }
}

export default GameGlobals.instance;
