import {Component, Type} from '@wonderlandengine/api';

export class TileDescriptor extends Component {
    static TypeName = 'tile-descriptor';
    static Properties = {
        canRotate: {type: Type.Bool, default: true},
        canMirror: {type: Type.Bool, default: true},
    }

    init() {
    }

    start() {
    }

    update(dt) {
    }

};