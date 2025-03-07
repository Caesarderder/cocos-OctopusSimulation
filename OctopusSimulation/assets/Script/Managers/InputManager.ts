// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { SingletonBase } from "./singletonBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class InputManager extends SingletonBase<InputManager> {
    private _eventCallbacks: { [key: string]: Function[] } = {};

    public addListener(eventType: string, callback: Function, target: any) {
        if (!this._eventCallbacks[eventType]) {
            this._eventCallbacks[eventType] = [];
        }
        this._eventCallbacks[eventType].push(callback.bind(target));
    }

    public removeListener(eventType: string, callback: Function, target: any) {
        if (this._eventCallbacks[eventType]) {
            const index = this._eventCallbacks[eventType].findIndex(cb => cb === callback.bind(target));
            if (index > -1) {
                this._eventCallbacks[eventType].splice(index, 1);
            }
        }
    }

    dispatchEvent(eventType: string, ...args: any[]) {
        if (this._eventCallbacks[eventType]) {
            this._eventCallbacks[eventType].forEach(callback => {
                callback(...args);
            });
        }
    }

    protected onLoad(): void {
        InputManager.Instance=this;
    }

    start() 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN.toString(),evt=>this.onKey(evt,true),this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP.toString(),evt=>this.onKey(evt,false),this);

        var canvas=cc.director.getScene().getChildByName('Canvas');
        if(canvas)
        {
            canvas.on(cc.Node.EventType.TOUCH_START, evt=>this.onMouse(evt,true));
            canvas.on(cc.Node.EventType.TOUCH_END, evt=>this.onMouse(evt,false));
        }
    }
    public test()
    {
        cc.log("Input Test");
    }

    onKey(evt,isDown) {
        cc.log(evt,"key dispatch!",isDown);
        this.dispatchEvent(evt.keyCode.toString(),evt,isDown);
    }

    onMouse(evt,isDown) {
        this.dispatchEvent('mouse',evt,isDown);
        cc.log(evt,"mouse dispatch!",isDown);
    }
}


