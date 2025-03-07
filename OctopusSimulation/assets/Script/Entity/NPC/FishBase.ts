// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
export default class FishBase extends cc.Component {

    state:EFishState=EFishState.Move;
    @property
    moveSpeed:number;
    @property
    body:number;


    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    }

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, evt => this._onclick());
    }

    update (dt) {
        this._updateState(dt);

    }

    private _updateState(dt)
    {

    }

    private _onclick()
    {

    }
}

export enum EFishState
{
    Move,
    FollowTarget,
}