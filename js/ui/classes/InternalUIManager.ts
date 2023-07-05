import { injectable } from "tsyringe";
import { UiManager } from "../components/ui-manager.js";
import { NumberArray } from "@wonderlandengine/api";

@injectable()
export class InternalUIManager{
    uiManager: UiManager;
    
    registerComponent(uiManager:UiManager){
        this.uiManager = uiManager;
    }

    open(name:string, position:Readonly<NumberArray>):void
    {
        if(this.uiManager){
            this.uiManager.open(name, position);
        }
    }
}