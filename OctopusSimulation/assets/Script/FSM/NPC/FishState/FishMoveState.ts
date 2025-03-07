import { EventCenter } from "../../../Util/EventCenter";
import { TryCatchingFish } from "../../../Util/Events";
import { FishBeCaughthedState } from "./FishBeCaughtedState";
import { FishStateBase } from "./FishStateBase";

export class FishMoveState extends FishStateBase {


    constructor(entity)
    {
        super(entity);
    }

    onEnter() {
        
    }

    tick(dt:number) {
        this.move();
    }

    move()
    {
        this.entity.rig.linearVelocity=this.entity.dir.mul(this.entity.moveSpeed);
    }

    onExit() {
    }

    onClick(): void {
        EventCenter.dispatchEvent(TryCatchingFish.name,new TryCatchingFish(this.entity,this.onCathed));
    }

    onCathed()
    {
        //被抓到后进入挣扎状态
        this.entity.stateMachine.changeState(FishBeCaughthedState.name);
    }

}