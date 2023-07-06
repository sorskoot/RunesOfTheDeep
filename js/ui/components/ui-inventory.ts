import {Component, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import { UiComponent } from './ui-component.js';

/**
 * ui-inventory
 * 
 */
export class UiInventory extends UiComponent {
    static TypeName = 'ui-inventory';

    setInventory(chestType: string) {
        this.titleText.text = chestType;
    }

}
