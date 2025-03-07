import { FishStateBase } from "./FishStateBase";

export class FishBeCaughthedState extends FishStateBase {


    constructor(entity)
    {
        super(entity);
    }

    onEnter() {
        
    }

    tick(dt:number) {
        // this.entity.rig.linearVelocity=this.entity.dir.mul(this.entity.moveSpeed);
    }

    move()
    {

    }

    onExit() {
    }

    onClick(): void {
        //松手
        
    }

}