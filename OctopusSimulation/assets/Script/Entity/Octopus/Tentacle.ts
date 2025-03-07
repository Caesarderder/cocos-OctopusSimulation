import { StateMachine } from "../../FSM/StateMachine";
import SpriteMeshProcessor, { MeshAnimationInfo } from "../../MeshProcesser/SpriteMeshProcessor";
import { TryCatchingFish } from "../../Util/Events";
import Utils from "../../Util/Utils";

const { ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class Tentacle extends cc.Component {

    meshProcessor: SpriteMeshProcessor=null;

    moveInfos: Array<TentacleMoveInfo>=new Array<TentacleMoveInfo>();

    state:ETentableState=ETentableState.Idle;

    // onLoad () {}

    start () 
    {
        this.meshProcessor=this.getComponent(SpriteMeshProcessor);
    }


    update (dt:number) {
        this._updateState(dt);


    }

    _updateState(dt:number)
    {
        switch (this.state) {
            case ETentableState.Move:
                this._move(dt);
                break;
        
            default:
                break;
        }

    }

    _switchState(newState: ETentableState) {
        if (this.state != newState) {
            switch (this.state) {
                case ETentableState.Idle:

                    break;

                case ETentableState.Move:

                    break;

                case ETentableState.Catching:

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
                this._switchState(curMoveInfo.stateToEnter);
            }

            //移动到了目标点

        }
        
    }

    //#region Action
    catch(info:TryCatchingFish)
    {
        this.moveInfos.length=0;
        this.moveInfos.push(new TentacleMoveInfo(new MeshAnimationInfo(),info.fish.node,100,ETentableState.Catching,info.callback));
        this._switchState(ETentableState.Move);
    }

    //#endregion
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


