import { Subject } from 'rxjs';
import { LevelState } from './levelState.js';

export const State={
    Init:-1,
    Title:0,
    Pause:1,
    Playing:2,
    End:3,
    Complete:4,
}

export class GameState {

    constructor() {
        this.playerPositionSubject = new Subject();
        this.playerRotationSubject = new Subject();
        this.isInVRSubject = new Subject();
        this.levelSubject = new Subject();
        this.availableTargetsSubject = new Subject();
        
        this.levelState = new LevelState();
        
        this.currentRoomSubject = new Subject();

        this.levelSubject.subscribe(level => {
        });

        this.stateSubject = new Subject();
    }

    levelState:LevelState;

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
    _playerPosition = [0,0,0];
    set playerPosition(value) {
        this._previousPlayerPosition = this._playerPosition;
        this._playerPosition = value;
        this.playerPositionSubject.next(value);
    }
    get playerPosition() {
        return this._playerPosition;
    }    
    _previousPlayerPosition = [0,0,0];
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
    _currentRoom= [0,0];
    set currentRoom(value) {
        this._currentRoom = value;
        this.currentRoomSubject.next(value);
    }
    get currentRoom() {
        return this._currentRoom;
    }   

    offTarget(){
        
    }

    navigating=false;

    /**
     * The direction the player entered the room from
     */
    roomPreviousExitDirection:DirectionSymbol = null;
 
    /**
     * Navigate to a room
     * @param {number} roomx 
     * @param {number} roomy 
     * @param {DirectionSymbol} direction 
     */
    navigateToRoom(roomx:number,roomy:number, direction:DirectionSymbol=null){
        if(this.navigating) return;
        this.navigating=true;
        
        if(direction){
            this.roomPreviousExitDirection=direction;
        }else{
            this.playerPosition = [3, 0, 7];
            this.playerRotation = 270;
        }

        this.currentRoom = [roomx, roomy];
        
        // use direction to teleport to the correct location in the new room
       
        this.navigating=false;
    }

    /**
     * Is it possible to teleport to the given position?
     * @param x 
     * @param y 
     * @param z 
     * @returns true if it is possible to teleport to the given position
     */
    canTeleportToPosition(x:number, y:number, z:number) {
        return true;
    }
}