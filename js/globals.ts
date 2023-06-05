import { SoundfxPlayer } from "./utils/soundfx-player.js";
import { MusicPlayer } from "./utils/music-player.js";
import { GameState } from "./classes/gameState.js";

const GameGlobals = {
  gameState: new GameState(),
  soundFxPlayer: new SoundfxPlayer(),
  musicPlayer: new MusicPlayer(),
  particlePool: null,
  globalObjectCache:null
};

export default GameGlobals;