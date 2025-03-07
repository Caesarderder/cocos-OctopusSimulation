// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { FishMoveState } from "../../FSM/NPC/FishState/FishMoveState";
import { StateMachine } from "../../FSM/StateMachine";

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
export default class FishBase extends cc.Component {

    @property
    moveSpeed:number=10;
    @property
    body:number=10;

    //#region MoveState
    dir:cc.Vec2;

    //#endregion

    //#region BeCatchedState
    // dir:cc.Vec2;

    //#endregion


    stateMachine:StateMachine=new StateMachine();
    rig:cc.RigidBody;

    onLoad () {
        cc.log("FishInit");
        this.rig=this.getComponent(cc.RigidBody);
        this.stateMachine.addState(FishMoveState.name,new FishMoveState(this));

        //test
        this.init(cc.Vec2.RIGHT);
    }

    start () {

        this.node.on(cc.Node.EventType.TOUCH_START, evt => this._onclick());
    }

    init(dir:cc.Vec2)
    {
        this.dir=dir;
        this.stateMachine.changeState(FishMoveState.name);

    }

    update (dt) {
        this.stateMachine.tick(dt);
    }

    private _onclick()
    {
        this.stateMachine.curState.onClick();
    }
}