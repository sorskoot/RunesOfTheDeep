import {Component, Emitter, Material, MeshComponent, NumberArray, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import { Cursor, CursorTarget, EventTypes } from '@wonderlandengine/components';
import { UiButton } from './ui-button.js';

/**
 * ui-button
 */
export class UiActionClose extends Component {
    static TypeName = 'ui-action-close';

    @property.object()
    uiButtonObject: Object3D;

    @property.object()
    uiRootObject: Object3D;

    @property.object()
    uiManagerObject: Object3D;
    
    private uiButton: UiButton | null;

    start(): void {
        const but = this.uiButtonObject.getComponent(UiButton);
        if(!but) {
            throw new Error('No button component found on button mesh object');
        }
        this.uiButton = but;
        this.uiButton.pressed.add(()=>{

        });
    }
}