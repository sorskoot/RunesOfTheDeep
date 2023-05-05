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

    offTarget(){
        this.availableTargets++;
    }

    onTarget(){        
        this.availableTargets--;
        if(this.availableTargets == 0){
            if(this.level==14){                
                this.state = State.Title; 
                this.playerRotation = 0;
                // Should be complete, but title for now to prevent crash
            }else{            
                this.level++;            
            }
        }
    }
}
