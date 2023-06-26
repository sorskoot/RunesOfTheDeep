import {Component, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

/**
 * uiManager
 */
export class UiManager extends Component {
    static TypeName = 'ui-manager';

    

    static onRegister(engine: WonderlandEngine) {
        /* Triggered when this component class is registered.
         * You can for instance register extra component types here
         * that your component may create. */
    }

    init() {
        
    }

    start() {
        
    }

    update(dt: number) {
        /* Called every frame. */
    }
}
