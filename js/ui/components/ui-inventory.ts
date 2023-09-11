import {Component, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import { UiComponent } from './ui-component.js';

/**
 * ui-inventory
 * 
 */
export class UiInventory extends UiComponent {
    static TypeName = 'ui-inventory';

    @property.object()
    titleObject: Object3D;

    @property.object()
    slot1Object: Object3D;

    setInventory(chestType: string) {
        this.titleText.text = chestType;
    }

}
