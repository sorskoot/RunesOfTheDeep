
export const Sounds = {
    click:0,
    movebox:1,
    teleport:2,
    boxstop:3
}

export class SoundfxPlayer{
    constructor() {
        this.initialized = false;          
        this.currentSfxIndex =0;
        this.audiopool = [];
        this.pannerNodes = [];
    }

    initAudio() {
        if (this.audioContext) return;
        this.initialized = true;
        this.sounds= [
            new Audio('sfx/click.mp3'),
            new Audio('sfx/movebox.mp3'),
            new Audio('sfx/teleport.mp3'),
            new Audio('sfx/boxstop.mp3')
        ];

        this.audioContext = new AudioContext();
        this.audioContext.listener.upY.value = 1;        
        let gain = this.audioContext.createGain();
        gain.connect(this.audioContext.destination);
        
        for (let i = 0; i < 25; i++) {
            const audio = new Audio();            
            this.audiopool.push(audio);
            const element = this.audioContext.createMediaElementSource(audio);
            
            const pn = new PannerNode(this.audioContext, {
                panningModel: 'HRTF',
                distanceModel: 'exponential',
            });

            element.connect(pn);
            pn.connect(gain);
            this.pannerNodes.push(pn);
        }
    }

    playSound(audioIndex, pos) {
        if(!this.audioContext) return;
        if(!pos || !pos[0] || isNaN(pos[0])){
            pos=[0,0,0];
        }
        
        this.pannerNodes[this.currentSfxIndex].positionX.value = pos[0];
        this.pannerNodes[this.currentSfxIndex].positionY.value = pos[1];
        this.pannerNodes[this.currentSfxIndex].positionZ.value = pos[2];

        this.audiopool[this.currentSfxIndex].src = this.sounds[audioIndex].src;        
        this.audiopool[this.currentSfxIndex].play();
        this.currentSfxIndex = (this.currentSfxIndex + 1) % 25;
    }
};
