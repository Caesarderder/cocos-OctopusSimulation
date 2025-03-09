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
import FishBase from "../NPC/FishBase";
import Tentacle, { EEntityType, ETentableState } from "./Tentacle";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Octopus extends cc.Component {
    @property
    moveForce:number=1;
    @property(cc.Node)
    head:cc.Node=null;
    @property(cc.Node)
    t1:cc.Node=null;
    @property(cc.Node)
    t2:cc.Node=null;
    @property(cc.Node)
    t3:cc.Node=null;
    @property(cc.Node)
    t4:cc.Node=null;

    rig:cc.RigidBody=null;
    tentacles:Array<Tentacle>=null;

    @property(Number)
    static body:number=0.4;
    @property(cc.Label)
    label:cc.Label;

    onLoad () 
    {
        Octopus.body = 0.4;
        this.tentacles=this.node.getComponentsInChildren(Tentacle);
        this.tentacles[0].dstPos=this.t1;
        this.tentacles[1].dstPos=this.t2;
        this.tentacles[2].dstPos=this.t3;
        this.tentacles[3].dstPos=this.t4;
        this.node.scale=Utils.BodyToScale(Octopus.body)-0.3;
    }

    start () 
    {
        this.rig=this.getComponent(cc.RigidBody);

        EventCenter.subscribe(TryCatchingFish.name,this.onTryCatchingFish,this);
        InputManager.Instance.subscribe('mouse',this.onMove,this);
        InputManager.Instance.subscribe(cc.macro.KEY.w,this.onKey,this);
    }
    onDestroy(): void {
        EventCenter.unsubscribe(TryCatchingFish.name,this.onTryCatchingFish,this);
        //InputManager.Instance.unsubscribe('mouse',this.onMove,this);
        //InputManager.Instance.unsubscribe(cc.macro.KEY.w,this.onKey,this);
    }

    update (dt) {
        this.label.string="当前体型"+Octopus.body.toFixed(2);
        // cc.log(this.node.position);
    }

    //Move
    public onMove(event,isDown)
    {
        if(isDown)
        {
            let point = event.currentTouch._point as cc.Vec2;
            let dir: cc.Vec2 = point.sub(Utils.GetWorldPostitions(this.node)).normalize();
            this.addForce(dir.mul(this.moveForce));
            this.lookAt(point);
        }
    }

    lookAt(targetWorldPos: cc.Vec2) {
        let target=Utils.GetLocalPostitionsByOffset(this.head,targetWorldPos);
        // 计算方向向量
        let dx = target.x - this.head.x;
        let dy = target.y - this.head.y;
        let dir = cc.v2(dx, dy);

        // 计算角度
        let angle = dir.signAngle(cc.v2(1, 0)); // 基准为 X 轴正方向
        let degree = angle / Math.PI * 180; // 将弧度转换为角度
        if(Math.abs(this.head.rotation-degree-90)>180)
            this.head.scaleX*=-1;

        // 设置节点的旋转角度
        this.head.rotation = degree+90;
    }

    public onKey(event, isDown)
    {
        // cc.log("Key event:",isDown," ?? ",event,);

        // this.rig.applyForceToCenter(dir.normalize().mul(this.moveForce),true);
    }

    onTryCatchingFish(evt:TryCatchingFish)
    {
        //找一个空闲触手
        let idleTentacle:Tentacle;
        // idleTentacle=this.ryGetIdleTentacle();
        idleTentacle=this.GetIdleTentacle()
        {
            evt.fish.canClick=false;
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

    onAddForce(force:cc.Vec2)
    {
        this.rig.applyLinearImpulse(force, Utils.GetWorldPostitions(this.node),true);
    }

    addForce(force:cc.Vec2)
    {
        this.rig.applyLinearImpulse(force, Utils.GetWorldPostitions(this.node),true);
        this.tentacles.forEach(tentacle=> {
            tentacle.onAddForce(EEntityType.Player,force);
        });
    }
    //#endregion

    //#region  大鱼吃小鱼系统
     onCollisionEnter(other: cc.Collider, self: cc.Collider) {
        let fish=other.getComponent(FishBase);
        fish.onBodyBattle(this);
    }

    onCollisionStay(other: cc.Collider, self: cc.Collider) {
        let fish=other.getComponent(FishBase);
    }

    addBody(add:number)
    {
        Octopus.body+=add;
        this.node.scale=Utils.BodyToScale(Octopus.body)-0.3;
    }

    desBody(sub:number)
    {
        Octopus.body-=sub;
        if(Octopus.body<0.4)
        {
            Octopus.body=0.4;
        }
        this.node.scale=Utils.BodyToScale(Octopus.body)-0.3;
    }
    //#endregion

}



