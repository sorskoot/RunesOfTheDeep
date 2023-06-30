import {Component, Emitter, Material, MeshComponent, NumberArray, Object3D, WonderlandEngine} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';
import { Cursor, CursorTarget, EventTypes } from '@wonderlandengine/components';

/**
 * ui-button
 */
export class UiButton extends Component {
    static TypeName = 'ui-button';

    @property.material()
    hoverMaterial: Material;

    @property.object()
    buttonMeshObject: Object3D;

    @property.object()
    buttonTargetObject: Object3D;

    pressed!: Emitter;

    returnPos: NumberArray;
    mesh: MeshComponent;
    defaultMaterial: Material;
    target: CursorTarget;

    init(): void {
        this.pressed = new Emitter();
    }

    start() {
        const m = this.buttonMeshObject.getComponent(MeshComponent);
        if(!m) {
            throw new Error('No mesh component found on button mesh object');
        }
        this.mesh = m;

        const material = this.mesh.material;
        if(!material){
            throw new Error('No material found on button mesh object');
        }
        this.defaultMaterial = material;

        this.buttonMeshObject.getPositionLocal(this.returnPos);

        const target = this.buttonTargetObject.getComponent(CursorTarget);        
        if(!target) {
            throw new Error('No cursor target found on button and could not add one');
        }

        this.target = target;

        this.returnPos = this.buttonMeshObject.getPositionLocal();
    }

    onActivate() {
        this.target.onHover.add(this.onHover.bind(this));
        this.target.onUnhover.add(this.onUnhover.bind(this));
        this.target.onDown.add(this.onDown.bind(this));
        this.target.onUp.add(this.onUp.bind(this));
    }

    onDeactivate() {
        this.target.onHover.remove(this.onHover);
        this.target.onUnhover.remove(this.onUnhover);
        this.target.onDown.remove(this.onDown);
        this.target.onUp.remove(this.onUp);
    }

    update(dt: number) {
        /* Called every frame. */
    }

    onHover(obj3D_:Object3D, cursor:Cursor, eventTypes:EventTypes|undefined){
        this.mesh.material = this.hoverMaterial;
       // hapticFeedback(cursor.object, 0.5, 50);
    }

    onUnhover(obj3D_:Object3D, cursor:Cursor, eventTypes:EventTypes|undefined){
        this.mesh.material = this.defaultMaterial;
       // hapticFeedback(cursor.object, 0.3, 50);
    }

    onDown(obj3D_:Object3D, cursor:Cursor, eventTypes:EventTypes|undefined){
        //this.soundClick.play();
        this.buttonMeshObject.translateLocal([0.0, -0.1, 0.0]);
       // hapticFeedback(cursor.object, 1.0, 20);
    }
    onUp(obj3D_:Object3D, cursor:Cursor, eventTypes:EventTypes|undefined){
       // this.soundUnClick.play();
        this.buttonMeshObject.setPositionLocal(this.returnPos);
        this.pressed.notify();
      //  hapticFeedback(cursor.object, 0.7, 20);
    }
}
