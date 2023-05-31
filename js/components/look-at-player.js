import {Component, Type} from '@wonderlandengine/api';

export class LookAtPlayer extends Component {
    static TypeName = 'look-at-player';
    static Properties = {
        target: {type: Type.Object}
    }

    /**
     * The player object that the object looks at
     */
    target;

    update(dt) {
         if (this.target) {
            let pos = this.target.getPositionWorld();
            this.object.lookAt([pos[0],0,pos[2]], [0, 1, 0]);//this.target.getPositionWorld(), [0, 1, 0]);
            this.object.rotateAxisAngleDegLocal([0, 0, 1], -90);

         }
    }

};