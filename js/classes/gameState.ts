import { Subject } from "rxjs";
import { LevelState } from "./levelState.js";
import { DirectionSymbol } from "../types/index.js";
import { Room } from "../dungeongen/room.js";
import { findCharInStringArrayByPos } from "../forFramework/findCharInStringArray.js";
import { RoomTemplatePatternDefinitions } from "../dungeongen/roomTemplates.js";
import { Object3D } from "@wonderlandengine/api";
import { singleton } from "tsyringe";

export const State = {
  Init: -1,
  Title: 0,
  Pause: 1,
  Playing: 2,
  End: 3,
  Complete: 4,
};

@singleton()
export class GameState {
  
  room: Room | null = null;

  constructor() {
    this.playerPositionSubject = new Subject();
    this.playerRotationSubject = new Subject();
    this.isInVRSubject = new Subject();
    this.levelSubject = new Subject();
    this.availableTargetsSubject = new Subject();

    this.levelState = new LevelState();

    this.currentRoomSubject = new Subject();

    this.levelSubject.subscribe((level) => {});

    this.stateSubject = new Subject();
  }

  levelState: LevelState;

  stateSubject: Subject<number>;
  _state = State.Init;
  set state(value) {
    this._state = value;
    this.stateSubject.next(value);
  }
  get state() {
    return this._state;
  }

  availableTargetsSubject: Subject<number>;
  _availableTargets = 0;
  set availableTargets(value) {
    this._availableTargets = value;
    this.availableTargetsSubject.next(value);
  }
  get availableTargets() {
    return this._availableTargets;
  }

  levelSubject: Subject<number>;
  _level = 0;
  set level(value) {
    this._level = value;
    this.levelSubject.next(value);
  }
  get level() {
    return this._level;
  }

  playerPositionSubject: Subject<number[]>;
  _playerPosition = [0, 0, 0];
  set playerPosition(value) {
    this._previousPlayerPosition = this._playerPosition;
    this._playerPosition = value;
    this.playerPositionSubject.next(value);
  }
  get playerPosition() {
    return this._playerPosition;
  }
  _previousPlayerPosition = [0, 0, 0];
  get previousPlayerPosition() {
    return this._previousPlayerPosition;
  }

  playerRotationSubject: Subject<number>;
  _playerRotation = 0;
  set playerRotation(value) {
    this._previousPlayerRotation = this._playerRotation;
    this._playerRotation = value;
    this.playerRotationSubject.next(value);
  }
  get playerRotation() {
    return this._playerRotation;
  }

  _previousPlayerRotation = 0;
  get previousPlayerRotation() {
    return this._previousPlayerRotation;
  }

  isInVRSubject: Subject<boolean>;
  _isInVR = false;
  set isInVR(value) {
    this._isInVR = value;
    this.isInVRSubject.next(value);
  }
  get isInVR() {
    return this._isInVR;
  }

  currentRoomSubject: Subject<number[]>;
  _currentRoom = [0, 0];
  set currentRoom(value) {
    this._currentRoom = value;
    this.currentRoomSubject.next(value);
  }
  get currentRoom() {
    return this._currentRoom;
  }

  offTarget() {}

  /**
   * Whether or not the player is currently navigating to a room
   */
  navigating = false;

  /**
   * The direction the player entered the room from
   */
  roomPreviousExitDirection: DirectionSymbol | null = null;

  /**
   * Navigate to a room
   * @param {number} roomx the x position on the map of the room to navigate to
   * @param {number} roomy the y position on the map of the room to navigate to
   * @param {DirectionSymbol|null} direction the direction the player exited the room from, if null the player will be teleported to the center of the room (this should only happen at the start)
   */
  navigateToRoom(roomx: number, roomy: number, direction: DirectionSymbol | null = null) {
    if (this.navigating) {
      return;
    }
    this.navigating = true;

    if (direction) {
      this.roomPreviousExitDirection = direction;
    } else {
      this.playerPosition = [3, 0, 7];
      this.playerRotation = 270;
    }

    this.currentRoom = [roomx, roomy];

    // use direction to teleport to the correct location in the new room

    this.navigating = false;
  }

  /**
   * Is it possible to teleport to the given position?
   * @param x
   * @param y
   * @param z
   * @returns true if it is possible to teleport to the given position
   */
  canPick(x: number, y: number, z: number) {
    if (!this.room) {
      return false;
    }

    const template = this.room.getRoomTemplate();
    if (!template) {
      console.error(`no template found for current room. Odd... We're in it.`);
      return false;
    }

    const char = findCharInStringArrayByPos(template.pattern, Math.floor(x), Math.floor(z));
    if(!char){
      // somehow there's NO char at this position
      console.warn(`no char found at position ${x},${z} in template ${template.name}`);
      return false;
    }
    const definition = RoomTemplatePatternDefinitions[char];

    if(definition.behavior === "Door"){
      return (char === "N" && this.room.doors.north) ||
      (char === "E" && this.room.doors.east) ||
      (char === "S" && this.room.doors.south) ||
      (char === "W" && this.room.doors.west); 
    }else{
      return definition.canTeleportToTile;
    }
  }

  pick(obj:Object3D, x: number, y: number, z: number) {
    if (!this.room) {
      return false;
    }

    const template = this.room.getRoomTemplate();
    if (!template) {
      console.error(`no template found for current room. Odd... We're in it.`);
      return false;
    }

    const char = findCharInStringArrayByPos(template.pattern, Math.floor(x), Math.floor(z));
    if(!char){
      // somehow there's NO char at this position
      console.warn(`no char found at position ${x},${z} in template ${template.name}`);
      return ;
    }

    // get the items in there for the given position
    const items = this.room.getItemsAtPosition({x:Math.floor(x), y:Math.floor(z)});
   
    if(!items || items.length === 0){
      if(RoomTemplatePatternDefinitions[char].canTeleportToTile){
        this.setPlayerPosition(x,z);
      };
      return;
    }

    for(let i = 0; i < items.length; i++){
      const item = items[i];
      item.interact(obj, x, y, z);
    }

    

    // execute behavior picked on tile
      
      // for a door this should be navigating to the next room
      // for a floor tile this should be teleporting to that location
      // for a chest this should be opening the chest
      // for a character this should be talking to the character
      // etc
      // but how? Somehow there should be a link to the room template, the tiles 
      // and the objects in the room.
      // maybe the room template should have a list of objects in the room?
      // would it be possible to store them in a 2D array?
      // so we can just request X,Y and get the object, and execute the behavior?
      
    

    //definition.behavior;


    return;
    // let tags = obj.getComponent(Tags);
    // if (!tags) return;
    // let position = this.playerPosition;
    // //this.player.getTranslationWorld(position);
   
    // switch (true) {
    //   case tags.hasTag("floor"):
    //     globals.soundFxPlayer.playSound(Sounds.teleport);
    //     this.playerPosition = [x, position[1], z];
    //     break;
    //   case tags.hasTag("button"):
    //     break;
    //   case tags.hasTag("chest"):
    //     console.log(`picking chest not implemented yet. ${x}, ${z}`);
    //     break;
    //   case tags.hasTag("door"):
    //     console.log("picking door not implemented yet");
    //     break;
    // }
  }

  setCurrentRoom(currentRoom: Room) {
    this.room = currentRoom;
  }

  setPlayerPosition(x: number, y: number) {
    this.playerPosition = [x, this.playerPosition[1], y];
}
}
