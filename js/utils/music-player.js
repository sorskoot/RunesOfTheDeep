import { State } from "../classes/gameState";
import StorageSpace13 from "../globals";

export const Songs = {
    complete:0,
    gameplay:1,
    title:2
}

export class MusicPlayer{
    constructor() {
        this.initialized = false;                  
    }

    initAudio() {
        if (this.initialized) return;

        this.initialized = true;
        this.songs = [
            new Audio('Music/complete.mp3'),
            new Audio('Music/gameplay.mp3'),
            new Audio('Music/title.mp3')
        ];
        this.currentSong = new Audio();        
        this.isPlaying = false;
        this.firstTime = true;
        StorageSpace13.gameState.isInVRSubject.subscribe(isInVR => {

            if(this.firstTime){
                this.checkState();
                this.firstTime = false;
                return;
            }
            if(!this.isPlaying) return;
            if(isInVR) {
                this.currentSong.play();
            }else{
                this.currentSong.pause();
            }
        });

        StorageSpace13.gameState.stateSubject.subscribe(() => {
           this.checkState();
        });
    }

    checkState(){
        switch(StorageSpace13.gameState.state) {
            case State.Title:
                this.playMusic(Songs.title);
                break;
            case State.Playing:
                this.playMusic(Songs.gameplay);
                break;
            case State.Complete:
                this.playMusic(Songs.complete);
                break;
            default:
                this.currentSong.pause();
                this.isPlaying = false;
                break;
        }
    }

    playMusic(audioIndex) {
        if(!this.initialized) return;
        this.currentSong.src = this.songs[audioIndex].src;  
        this.currentSong.loop = true;      
        this.currentSong.volume = 0.25;
        this.currentSong.play();
        this.isPlaying = true;
    }
};
