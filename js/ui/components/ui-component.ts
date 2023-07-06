import { Component, Object3D, TextComponent } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";
import { throwError } from "../../forFramework/throwError.js";

export class UiComponent extends Component {
    static TypeName = 'ui-component';

    @property.object()
    titleObject: Object3D;
    
    titleText: TextComponent;

    start(): void {
        if(!this.titleObject) {
            throw new Error('No title object set on ui component');
        }

        this.titleText = this.titleObject.getComponent(TextComponent) ?? throwError('No text component found on title object');
    }



}