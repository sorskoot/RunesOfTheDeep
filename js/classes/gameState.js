import { Subject } from 'rxjs';

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
        this.levelState = null;
        
        this.currentRoomSubject = new Subject();

        this.levelSubject.subscribe(level => {
        });

        this.stateSubject = new Subject();
    }

    _state = State.Init;
    set state(value) {
        this._state = value;
        this.stateSubject.next(value);
    }
    get state() {
        return this._state;
    }

    _availableTargets = 0;
    set availableTargets(value) {
        this._availableTargets = value;
        this.availableTargetsSubject.next(value);
    }
    get availableTargets() {
        return this._availableTargets;
    }

    _level = 0;
    set level(value) {
        this._level = value;
        this.levelSubject.next(value);
    }
    get level() {
        return this._level;
    }
    
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

    _isInVR = false;
    set isInVR(value) {
        this._isInVR = value;
        this.isInVRSubject.next(value);
    }
    get isInVR() {
        return this._isInVR;
    }

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
     * @type {DirectionSymbol}
     */
    roomPreviousExitDirection = null;
    /**
     * Navigate to a room
     * @param {number} roomx 
     * @param {number} roomy 
     * @param {DirectionSymbol} direction 
     */
    navigateToRoom(roomx,roomy, direction=null){
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

    canTeleportToPosition(x, y, z) {
        return true;
    }
}
