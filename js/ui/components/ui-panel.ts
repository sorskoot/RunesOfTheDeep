import {Component, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

/**
 * ui-panel
 */
export class UiPanel extends Component {
    static TypeName = 'ui-panel';

    /* Properties that are configurable in the editor */

    @property.float(1.0)
    param!: number;

    static onRegister(engine: WonderlandEngine) {
        /* Triggered when this component class is registered.
         * You can for instance register extra component types here
         * that your component may create. */
    }

    init() {
        console.log('init() with param', this.param);
    }

    start() {
        console.log('start() with param', this.param);
    }

    update(dt: number) {
        /* Called every frame. */
    }
}
