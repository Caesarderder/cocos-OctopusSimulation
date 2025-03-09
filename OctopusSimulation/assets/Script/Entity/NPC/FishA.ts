// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import InputManager from "../../Managers/InputManager";
import FishBase from "./FishBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class FishA extends FishBase {

    onLoad () {
        super.onLoad();
    }

    start () {
        super.start();
    }

    update (dt) {
        super.update(dt);

    }
    test() {
    }
}
