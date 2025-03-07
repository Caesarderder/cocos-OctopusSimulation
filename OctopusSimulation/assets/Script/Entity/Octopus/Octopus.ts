// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import InputManager from "../../Managers/InputManager";
import { EventCenter } from "../../Util/EventCenter";
import { TryCatchingFish } from "../../Util/Events";
import Utils from "../../Util/Utils";
import Tentacle, { ETentableState } from "./Tentacle";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Octopus extends cc.Component {
    @property
    moveForce:number=10;

    rig:cc.RigidBody=null;
    tentacles:Array<Tentacle>=null;

    onLoad () 
    {
    }

    start () 
    {
        this.rig=this.getComponent(cc.RigidBody);

        EventCenter.subscribe(TryCatchingFish.name,this.onTryCatchingFish,this);
        InputManager.Instance.subscribe('mouse',this.onMove,this);
        InputManager.Instance.subscribe(cc.macro.KEY.w,this.onKey,this);
        this.tentacles=this.node.getComponentsInChildren(Tentacle);
    }
    onDestroy(): void {
        EventCenter.unsubscribe(TryCatchingFish.name,this.onTryCatchingFish,this);
        InputManager.Instance.unsubscribe('mouse',this.onMove,this);
        InputManager.Instance.unsubscribe(cc.macro.KEY.w,this.onKey,this);
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
        }
    }

    public onKey(event,isDown)
    {
        // cc.log("Key event:",isDown," ?? ",event,);

        // this.rig.applyForceToCenter(dir.normalize().mul(this.moveForce),true);
    }

    onTryCatchingFish(evt:TryCatchingFish)
    {
        cc.log("wuhu");
        //找一个空闲触手

        let idleTentacle:Tentacle;
        // idleTentacle=this.ryGetIdleTentacle();
        idleTentacle=this.GetIdleTentacle()
        {
            if(idleTentacle)
            {

            }
            cc.log("SDF");
            //设置触手状态与移动信息
            idleTentacle.catch(evt);

        }
    }

    //#region Tentacles
    GetIdleTentacle():Tentacle{
        let index=this.tentacles.findIndex(x=> x.state==ETentableState.Idle);
        if(index>-1){
            return this.tentacles[index];
        }
        return null;
    }

    setTentacleModeInfo(infos)
    {

    }
    //#endregion

}



