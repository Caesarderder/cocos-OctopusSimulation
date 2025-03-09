// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { FishBeCaughthedState } from "../../FSM/NPC/FishState/FishBeCaughtedState";
import { FishMoveState } from "../../FSM/NPC/FishState/FishMoveState";
import { StateMachine } from "../../FSM/StateMachine";
import AudioManager from "../../Managers/AudioManager";
import Utils from "../../Util/Utils";
import Octopus from "../Octopus/Octopus";
import Tentacle from "../Octopus/Tentacle";

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
export default class FishBase extends cc.Component {

    @property
    moveSpeed:number=10;
    @property
    body:number=10;
    @property(cc.Node)
    particle:cc.Node=null;

    //#region MoveState
    dir:cc.Vec2;
    canClick:boolean;

    //#endregion



    stateMachine:StateMachine=new StateMachine();
    rig:cc.RigidBody;

    onLoad () {
        this.canClick=true;
        cc.log("FishInit");
        this.rig=this.getComponent(cc.RigidBody);
        this.stateMachine.addState(FishMoveState.name,new FishMoveState(this));
        this.stateMachine.addState(FishBeCaughthedState.name,new FishBeCaughthedState(this));

        //test
    }

    start () {
        this.stateMachine.changeState(FishMoveState.name);
        this.node.on(cc.Node.EventType.TOUCH_START, evt => this._onclick());
    }

    init(dir:number,body:number)
    {
        this.particle.active = false;
        this.body=body;
        this.node.scale = Utils.BodyToScale(body);
        if(dir>0)
        {
            this.dir = cc.Vec2.RIGHT;
        }
        else
        {
            this.dir = cc.Vec2.RIGHT.mul(-1);
        }
    }

    update (dt) {
        if(this.body<Octopus.body)
            this.particle.active = true;

        this.stateMachine.tick(dt);
    }

    private _onclick()
    {
        if(!this.canClick)
            return;
        this.stateMachine.curState.onClick();
    }

    onAddForce(force:cc.Vec2)
    {
        cc.log("fish add force");
        this.rig.applyLinearImpulse(force, Utils.GetWorldPostitions(this.node),true);
    }


    //大鱼吃小鱼
    onBodyBattle(octopus:Octopus)
    {
        //吃掉
        if(Octopus.body>=this.body)
        {
            AudioManager.Instance.play(0);
            this.beEaten(octopus);
        }
        else
        {
            AudioManager.Instance.play(1);
            octopus.desBody(0.2);
            this.stateMachine.changeState(FishMoveState.name);
        }

    }

    beEaten(octopus:Octopus)
    {
        octopus.addBody(0.1);

        this.stateMachine.curState.onExit();
        this.node.destroy();
    }


}