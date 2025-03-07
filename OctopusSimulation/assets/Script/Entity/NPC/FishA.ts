// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import FishBase from "./FishBase";

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class FishA extends FishBase {


    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {

    }

    update (dt) {}
    test()
    {
    }
}
