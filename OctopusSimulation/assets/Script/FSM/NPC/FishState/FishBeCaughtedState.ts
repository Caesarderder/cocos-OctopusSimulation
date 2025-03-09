import Tentacle, { EEntityType, ETentableState } from "../../../Entity/Octopus/Tentacle";
import Utils from "../../../Util/Utils";
import { FishMoveState } from "./FishMoveState";
import { FishStateBase } from "./FishStateBase";

export class FishBeCaughthedState extends FishStateBase {

    //#region BeCatchedState
    escapeForce:number;
    interval:number;
    totoalEscapeTime:number;

    curInterval:number;
    curEscapeTime :number;
    tentacle:Tentacle;
    //#endregion

    constructor(entity)
    {
        super(entity);
        this.interval=0.3;
        this.totoalEscapeTime=3;
        this.escapeForce=30;
    }

    Enter(tentacle)
    {
        this.tentacle=tentacle;
        this.entity.stateMachine.changeState(FishBeCaughthedState.name);
    }

    onEnter() {
        this.entity.canClick=true;
        this.curInterval=this.interval;
        this.curEscapeTime=this.totoalEscapeTime;
        
    }

    tick(dt:number) {
        this.curInterval-=dt;
        this.curEscapeTime-=dt;
        if(this.curInterval<0)
        {
            this.curInterval = this.interval;
            this.addForce();
        }
        // this.entity.rig.linearVelocity=this.entity.dir.mul(this.entity.moveSpeed);
    }

    onExit() {
        if(this.tentacle)
        {
            this.tentacle.switchState(ETentableState.Idle);
            this.tentacle = null;
        }
    }

    onClick(): void {
        //松手
        this.entity.stateMachine.changeState(FishMoveState.name);
    }

    addForce()
    {
        let dir=cc.v2(Utils.Random(-1,1),Utils.Random(-1,1)).normalizeSelf();
        cc.log(dir);
        this.entity.onAddForce(dir.normalize().mul(this.escapeForce));
        this.tentacle.onAddForce(EEntityType.Npc,dir.normalize().mul(this.escapeForce));
    }

}