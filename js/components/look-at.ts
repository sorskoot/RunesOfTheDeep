import {Component, Object3D} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

export class LookAt extends Component {
    static TypeName = 'look-at';

    /**
     * The player object that the object looks at
     */
    @property.object()
    target:Object3D;

    update(dt: number) {
         if (this.target) {
            let pos = this.target.getPositionWorld();
            this.object.lookAt([pos[0],0,pos[2]]);
            this.object.rotateAxisAngleDegObject([0, 1, 0], 180);
         }
    }

};