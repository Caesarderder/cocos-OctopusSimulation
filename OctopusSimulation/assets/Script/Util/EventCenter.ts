// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

export class EventCenter  {

    private static _eventCallbacks: { [key: string]: Function[] } = {};

    public static subscribe(eventType: string, callback: Function, target: any) {
        if (!this._eventCallbacks[eventType]) {
            this._eventCallbacks[eventType] = [];
        }
        this._eventCallbacks[eventType].push(callback.bind(target));
    }

    public static unsubscribe(eventType: string, callback: Function, target: any) {
        if (this._eventCallbacks[eventType]) {
            const index = this._eventCallbacks[eventType].findIndex(cb => cb === callback.bind(target));
            if (index > -1) {
                this._eventCallbacks[eventType].splice(index, 1);
            }
        }
    }

    public static dispatchEvent(eventType: string, ...args: any[]) {
        if (this._eventCallbacks[eventType]) {
            this._eventCallbacks[eventType].forEach(callback => {
                callback(...args);
            });
        }
    }
}
