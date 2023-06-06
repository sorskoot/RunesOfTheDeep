import {Component} from '@wonderlandengine/api';
import { property } from '@wonderlandengine/api/decorators.js';

/**
 * Set player height for a Y-offset above the ground for
 * 'local' and 'viewer' reference spaces.
 */
export class PlayerHeight2 extends Component {
    static TypeName = 'player-height2';

    @property.float()
    height: number = 1.75;
    
    onSessionStartCallback!: () => void;
    onSessionEndCallback!: () => void;

    start() {
        this.object.resetPositionRotation();
        this.object.translateLocal([0.0, this.height, 0.0]);

        this.onSessionStartCallback = this.onXRSessionStart.bind(this);
        this.onSessionEndCallback = this.onXRSessionEnd.bind(this);
    }

    onActivate() {
        this.engine.onXRSessionStart.add(this.onSessionStartCallback);
        this.engine.onXRSessionEnd.add(this.onSessionEndCallback);
    }

    onDeactivate() {
        this.engine.onXRSessionStart.remove(this.onSessionStartCallback);
        this.engine.onXRSessionEnd.remove(this.onSessionEndCallback);
    }

    onXRSessionStart() {
        if (!['local', 'viewer'].includes(this.engine.xr?.currentReferenceSpaceType!)) {
            this.object.resetPositionRotation();
        }
    }

    onXRSessionEnd() {
        if (!['local', 'viewer'].includes(this.engine.xr?.currentReferenceSpaceType!)) {
            this.object.resetPositionRotation();
            this.object.translateLocal([0.0, this.height, 0.0]);
        }
    }
}