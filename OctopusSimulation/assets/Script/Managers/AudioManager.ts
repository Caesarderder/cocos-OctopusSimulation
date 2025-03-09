// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import { SingletonBase } from "./singletonBase";

const {ccclass, property} = cc._decorator;

@ccclass
export default class AudioManager extends SingletonBase<AudioManager> {

    @property([cc.AudioClip])
    acs:cc.AudioClip[]=[];

    aS:cc.AudioSource

     onLoad () {
         AudioManager.Instance= this;


     }

    start () {
        this.aS=this.node.getComponent(cc.AudioSource);
    }

    public play(i:number)
    {
        if (i > -1 && i < this.acs.length) {
            this.aS.clip = this.acs[i];
            this.aS.play();
        }
    }

    // update (dt) {}
}
