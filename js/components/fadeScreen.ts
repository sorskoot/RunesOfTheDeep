import {Component, MeshComponent, Emitter} from '@wonderlandengine/api';
import { Easing, clamp, lerp } from '@sorskoot/wonderland-components';
import { property } from '@wonderlandengine/api/decorators.js';
import { FlatMaterial } from '../types/index.js';

export class FadeScreen extends Component {
    static TypeName = 'fade-screen';

    /**
     * The time it takes to fade in or out.
     * @type {number}
     */
    @property.float(1)
    fadeInTime:number = 1;

    /**
     * If true, the screen will fade in again after fading out.
     * @type {boolean}
     */
    @property.bool(true)
    continuous:boolean = true

    /**
     * Called when the fade in process is completed.
     * @type {Emitter}
     */
    FadeInCompleted!: Emitter;

    /**
     * Called when the fade out process is completed.
     * @type {Emitter}
     */
    FadeOutCompleted!: Emitter;

    init() {
        this.FadeInCompleted = new Emitter();
        this.FadeOutCompleted = new Emitter();
    }

    /**
     * The mesh component of the object. This should be a black sphere around the head
     * of the player that fades in and out.
     * @type {MeshComponent}
     */    
    mesh!:MeshComponent;

    #isRunning = false;
    #deltaTime = 0;
    #isFadingIn = false;
    #isFadingOut = false;

    start() {
        const mc = this.object.getComponent(MeshComponent);
        if(!mc) throw new Error('No mesh component found on object');
        this.mesh = mc;
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

    update(delta:number) {
        if (this.#isRunning) {
            let alpha:number=0;
            if(this.#isFadingIn){
                this.#deltaTime -= delta / this.fadeInTime;
                alpha = clamp(lerp(0, 1, this.#deltaTime, Easing.InQuad), 0, 1);
            }
            if(this.#isFadingOut){
                this.#deltaTime += delta / this.fadeInTime;
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

                    const flatMaterial = this.mesh.material as FlatMaterial;
                    if (flatMaterial)
                    {
                        flatMaterial.color = [0,0,0,0];
                    }


                    this.#deltaTime = 0;
                    this.FadeInCompleted.notify();
                }
            }
            const flatMaterial = this.mesh.material as FlatMaterial;
            if (flatMaterial)
            {
                flatMaterial.color = [0,0,0, alpha];
            }
        }
    }

};