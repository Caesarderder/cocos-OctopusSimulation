// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import InputManager from "../../Managers/InputManager";
import PhysicsManager from "../../Managers/PhysicsManager";
import Utils from "../../Util/Utils";

const {executeInEditMode,ccclass, property} = cc._decorator;

@ccclass
@executeInEditMode
export default class Octopus extends cc.Component {
    @property
    moveForce:number=10;

    rig:cc.RigidBody=null;

    onLoad () 
    {
    }

    start () 
    {
        this.rig=this.getComponent(cc.RigidBody);
        InputManager.Instance.addListener('mouse',this.onMove,this);
        InputManager.Instance.addListener(cc.macro.KEY.w,this.onKey,this);
        InputManager.Instance.test();
        PhysicsManager.Instance.test();
    }

    update (dt) {
        // cc.log(this.node.position);
    }

    //Move
    public onMove(event,isDown)
    {
        if(isDown)
        {
            let point = event.currentTouch._point as cc.Vec2;
            let dir: cc.Vec2 = point.sub(Utils.GetWorldPostitions(this.node)).normalize();
            this.rig.applyLinearImpulse(dir.mul(this.moveForce),Utils.GetWorldPostitions(this.node), true);
            cc.log("Move:", dir, " ?? ", event,);
        }
    }

    public onKey(event,isDown)
    {
        cc.log("Key event:",isDown," ?? ",event,);

        // this.rig.applyForceToCenter(dir.normalize().mul(this.moveForce),true);
    }

}



