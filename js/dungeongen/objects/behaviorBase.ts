import { TurnBasedEntity } from "../../classes/base/turnbased.js";

interface Behavior {
  name?: string;
  initialize?: () => void;
  [key: string]: any;
}
/**
 * This class is the base of all behaviors.
 * The idea is that all behaviors have a common base class,
 * so that they can be stored in a list and iterated over.
 * Every object, enemy, weapon, etc. can have a list of behaviors.
 */
export abstract class BehaviorBase {
  [key: string]: any;

  private _behaviorHandlers: { [handlerName: string]: Array<(...args: any[]) => any> } = {};
  private _behaviors: Array<string> = [];

  addBehaviorHandler(handlerName: string, handler: (...args: any[]) => any): void {
    if (!this._behaviorHandlers[handlerName]) {
      this._behaviorHandlers[handlerName] = [];
    }

    this._behaviorHandlers[handlerName].push(handler);
  }

  executeBehavior(handlerName: string, ret: any, ...args: any[]): any {
    if (this._behaviorHandlers && this._behaviorHandlers[handlerName]) {
      this._behaviorHandlers[handlerName].forEach((handler) => {
        args = [ret, ...args];
        ret = handler.apply(this, args);
      });
    }
    return ret;
  }

  wrapFunction(handlerName: string): void {
    if (!this._behaviorHandlers || !this._behaviorHandlers[handlerName]) {
      const originalFunction = this[handlerName];
      
      // Make sure to annotate the wrapped function correctly
      this[handlerName] = (...args: any[]) => {
        const ret = originalFunction.apply(this, args);
        return this.executeBehavior(handlerName, ret, ...args);
      };
    }
  }

  addBehavior(template: Behavior): BehaviorBase {
    const behaviorClone = { ...template };

    const name = behaviorClone.name;

    delete behaviorClone.name;

    behaviorClone.initialize!.apply(this);

    delete behaviorClone.initialize;

    Object.keys(behaviorClone).forEach((key) => {
      this.wrapFunction(key);
      this.addBehaviorHandler(key, behaviorClone[key]);
    });

    this._behaviors.push(name!);

    return this;
  }
}
