// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { SingletonBase } from "./singletonBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class PhysicsManager extends SingletonBase<PhysicsManager> {

    onLoad () 
    {
        PhysicsManager.Instance=this;
        cc.director.getPhysicsManager().enabled=true;
        cc.director.getCollisionManager().enabled=true;
    }

    start () {

    }

    public test()
    {
    }

    // update (dt) {}
}
