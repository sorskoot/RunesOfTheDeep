import { SoundfxPlayer } from "./utils/soundfx-player";
import { MusicPlayer } from "./utils/music-player";
import { GameState } from "./classes/gameState";

const GameGlobals = {
  gameState: new GameState(),
  soundFxPlayer: new SoundfxPlayer(),
  musicPlayer: new MusicPlayer(),
  particlePool: null,
  globalObjectCache:null
};

export default GameGlobals;