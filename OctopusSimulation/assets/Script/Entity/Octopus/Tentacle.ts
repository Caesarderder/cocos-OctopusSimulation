import { FishBeCaughthedState } from "../../FSM/NPC/FishState/FishBeCaughtedState";
import { StateMachine } from "../../FSM/StateMachine";
import SpriteMeshProcessor, { MeshAnimationInfo } from "../../MeshProcesser/SpriteMeshProcessor";
import { TryCatchingFish } from "../../Util/Events";
import Utils from "../../Util/Utils";
import FishBase from "../NPC/FishBase";
import Octopus from "./Octopus";

const { ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
export default class Tentacle extends cc.Component {

    octopus:Octopus;
    dstPos:cc.Node;

    meshProcessor: SpriteMeshProcessor=null;
    moveInfos: Array<TentacleMoveInfo>=new Array<TentacleMoveInfo>();
    state:ETentableState=ETentableState.Idle;

    //#region CatchingState
    catchSpeed:number=400;
    normalSpeed:number=400;

    fish:FishBase;

    mulA:number=1;
    mulK:number=1;
    mulW:number=1;


    //#endregion 
    // onLoad () {}

    start () 
    {
        this.octopus=this.node.parent.parent.getComponent(Octopus);
        this.meshProcessor=this.getComponent(SpriteMeshProcessor);
    }


    update (dt:number) {
        this._updateState(dt);
    }

    _updateState(dt:number)
    {
        switch (this.state) {
            case ETentableState.Idle:
                //移动到目标位置
                let dis = Utils.GetWorldPostitions(this.dstPos).sub(Utils.GetWorldPostitions(this.meshProcessor.targetPivot));
                if (dis.len() > 10) {
                    this.meshProcessor.Move(dis.normalize().mul(this.normalSpeed * dt));
                }
                break;
            case ETentableState.Move:
                this._move(dt);
                break;
            case ETentableState.Catching:
                this.meshProcessor.targetPivot.setPosition(Utils.GetLocalPostitionsByOffset(this.meshProcessor.targetPivot, Utils.GetWorldPostitions(this.fish.node)));
                break;
        
            default:
                break;
        }

    }

    switchState(newState: ETentableState) {
        if (this.state != newState) {
            switch (this.state) {
                case ETentableState.Idle:

                    break;

                case ETentableState.Move:

                    break;

                case ETentableState.Catching:
                    this.fish=null;
                    break;
                default:
                    break;
            }
        }
        this.state = newState;

        switch (this.state) {
            case ETentableState.Idle:

                break;

            case ETentableState.Move:

                break;

            case ETentableState.Catching:
                if(this.fish) {
                this.fish.stateMachine.getState<FishBeCaughthedState>(FishBeCaughthedState.name).Enter(this);
                }
                break;
            default:
                break;
        }


    }

    _move(dt:number)
    {
        if(this.moveInfos.length>0)
        {
            let curMoveInfo=this.moveInfos[0];
            //未移动到目标点
            let dis =Utils.GetWorldPostitions(curMoveInfo.targetNode).sub(Utils.GetWorldPostitions(this.meshProcessor.targetPivot));
            if(dis.len()>10)
            {
                this.meshProcessor.Move(dis.normalize().mul(curMoveInfo.moveSpeed*dt));
            }
            else
            {
                cc.log("移动到了目标点")
                this.switchState(curMoveInfo.stateToEnter);
            }

            //移动到了目标点
        }
        else
        {



        }
        
    }

    //#region CatchingState
    catch(info:TryCatchingFish)
    {
        this.moveInfos.length=0;
        this.moveInfos.push(new TentacleMoveInfo(new MeshAnimationInfo(3,0.05,0.02),info.fish.node,this.catchSpeed,ETentableState.Catching,info.callback));
        this.fish=info.fish;
        cc.log("Fish:",this.fish);
        this.switchState(ETentableState.Move);
    }

    onAddForce(type:EEntityType,force:cc.Vec2)
    {
        if(this.state==ETentableState.Catching&&this.fish) {
            var o2TargetDir = Utils.GetWorldPostitions(this.meshProcessor.targetPivot).sub(Utils.GetWorldPostitions(this.meshProcessor.startPivot)).normalizeSelf();
            if (type == EEntityType.Player) {
                let len = cc.Vec2.dot(force, o2TargetDir);
                if (len < 0) {
                    this.fish.onAddForce(o2TargetDir.mul(len));
                }
            }
            else if (type == EEntityType.Npc) {
                let len = cc.Vec2.dot(force, o2TargetDir);
                if (len > 0) {
                    this.octopus.onAddForce(o2TargetDir.mul(len));
                }
            }
        }
    }

    onBodyChange(body:number)
    {
        this.mulA=1+body/10;
        this.mulA=1+body/10;
        this.mulA=1+body/10;
    }



    //#endregion
}
export enum EEntityType
{
    Player,
    Npc
}

export enum ETentableState
{
    Idle,
    Move,
    Catching,
}

export class TentacleMoveInfo
{
    public animationInfo:MeshAnimationInfo;
    public targetNode:cc.Node;
    public moveSpeed:number;
    public stateToEnter:ETentableState;
    public callback:any;

    constructor(a,t,m,s,c)
    {
        this.animationInfo=a;
        this.targetNode=t;
        this.moveSpeed=m;
        this.stateToEnter=s;
        this.callback=c
    }
}


