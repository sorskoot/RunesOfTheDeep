import {Component, NumberArray, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import { container } from 'tsyringe';
import { InternalUIManager } from '../classes/InternalUIManager.js';

/**
 * uiManager
 */
export class UiManager extends Component {
    static TypeName = 'ui-manager';

    @property.object()
    uiCollection: Object3D;

    private uiElements: Object3D[] = [];
    currentVisibleUI: string | null;
    
    start(): void {
        if(!this.uiCollection) {
            throw new Error('No ui collection set');
        }

        for (const child of this.uiCollection.children) {
            child.setPositionWorld([0, -10000, 0]);
            this.uiElements.push(child);
        }

        const internalUIManager = container.resolve(InternalUIManager);
        internalUIManager.registerComponent(this);
    }

    open(name:string, position:Readonly<NumberArray>):void
    {
        const element = this.uiElements.find((element) => element.name === name);
        if(!element) {
            throw new Error(`No ui element found with name ${name}`);
        }
        if(this.currentVisibleUI === name) {
            this.closeAll();
        }
        else{
            this.currentVisibleUI = name;
            element.setPositionWorld(position);
        }
    }

    /**
     * Closes all UI elements, by moving them far away.
     */
    closeAll() {
        for (const uiRootObject of this.uiElements) {
              uiRootObject.setPositionWorld([0, -10000, 0]);
        }
        this.currentVisibleUI = null;
    }
}
