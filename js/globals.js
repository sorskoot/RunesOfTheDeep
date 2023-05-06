import { GameState } from "./classes/gameState";
import { LevelState } from "./classes/levelState";
import { SoundfxPlayer } from "./utils/soundfx-player";
import { MusicPlayer } from "./utils/music-player";

const GameGlobals = {
  gameState: new GameState(),
  //levelState: new LevelState(),
  soundFxPlayer: new SoundfxPlayer(),
  musicPlayer: new MusicPlayer(),
  particlePool: null,
};

export default GameGlobals;