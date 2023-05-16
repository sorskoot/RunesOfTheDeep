import {Component, MeshComponent, Type, Emitter} from '@wonderlandengine/api';
import { Easing, clamp, lerp } from '@sorskoot/wonderland-components/src/utils/lerp';

export class FadeScreen extends Component {
    static TypeName = 'fade-screen';
    static Properties = {
        fadeInTime: {type: Type.Float, default: 1},
        continuous:{ type: Type.Bool, default: true}
    }

    /**
     * Called when the fade in process is completed.
     * @type {Emitter}
     */
    FadeInCompleted;

    /**
     * Called when the fade out process is completed.
     * @type {Emitter}
     */
    FadeOutCompleted;

    init() {
        this.FadeInCompleted = new Emitter();
        this.FadeOutCompleted = new Emitter();
    }

    /**
     * @type {MeshComponent}
     */
    mesh;
    #isRunning = false;
    #deltaTime = 0;
    #isFadingIn = false;
    #isFadingOut = false;

    start() {
        this.mesh = this.object.getComponent(MeshComponent);
        this.mesh.active = false;
    }

    fadeIn() {
        this.mesh.active = true;
        this.#isFadingIn= true;
        this.#isRunning = true;
    }
    fadeOut() {
        this.mesh.active = true;
        this.#isFadingOut = true;
        this.#isRunning = true;
    }

    update(dt) {
        if (this.#isRunning) {
            let alpha;
            if(this.#isFadingIn){
                this.#deltaTime -= dt / this.fadeInTime;
                alpha = clamp(lerp(0, 1, this.#deltaTime, Easing.InQuad), 0, 1);
            }
            if(this.#isFadingOut){
                this.#deltaTime += dt / this.fadeInTime;
                alpha = clamp(lerp(0, 1, this.#deltaTime, Easing.OutQuad), 0, 1);
            }

            // increase or decrease alpha
            
            if(this.#deltaTime >= 1 || this.#deltaTime <= 0){
                this.#isRunning = false;
                this.#isFadingIn = false;
                this.#isFadingOut = false;
                if(this.#deltaTime >= 1){
                    this.#deltaTime = 1;
                    this.FadeOutCompleted.notify();
                    if(this.continuous){
                        this.fadeIn();
                    }
                }else{
                    this.mesh.material.color = [0,0,0,0];
                    this.#deltaTime = 0;
                    this.FadeInCompleted.notify();
                }
            }
            this.mesh.material.color = [0,0,0,alpha];
        }
    }

};