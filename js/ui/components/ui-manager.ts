import {Component, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

/**
 * uiManager
 */
export class UiManager extends Component {
    static TypeName = 'ui-manager';

    @property.object()
    uiCollection: Object3D;

    private uiElements: Object3D[] = [];

    start(): void {
        if(!this.uiCollection) {
            throw new Error('No ui collection set');
        }

        for (const child of this.uiCollection.children) {
            this.uiElements.push(child);
        }
    }

    /**
     * Closes all UI elements, by moving them far away.
     */
    closeAll() {
        for (const uiRootObject of this.uiElements) {
              uiRootObject.setPositionWorld([0, -10000, 0]);
        }
    }
}
