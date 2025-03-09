// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

import FishBase from "../Entity/NPC/FishBase";
import Octopus from "../Entity/Octopus/Octopus";
import Utils from "../Util/Utils";

const {ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
export default class FishSpawnSystem extends cc.Component {

    @property(cc.Node)
    height:cc.Node=null;
    @property(cc.Node)
    bottom:cc.Node=null;
    @property(Octopus)
    octopus:Octopus=null;

    curInterval:number=0;
    minInterval:number=1;
    startInterval:number=0.1;
    maxInterval:number=10;

    @property([cc.Prefab])
    fishs:cc.Prefab[]=[];

    protected onLoad(): void {
    this.startInterval=this.minInterval;
        
    }

    protected start(): void {
        
    }

    protected update(dt: number): void {
        this.curInterval+=dt;
        if(this.startInterval<this.curInterval)
        {
            this.spwan();
            this.curInterval=0;
            this.startInterval*=Utils.Random(5,10);
            if(this.startInterval>this.maxInterval)
                this.startInterval=this.minInterval;
        }
        
    }

    spwan()
    {
        let prefab=this.fishs[Utils.RandomInt(0,this.fishs.length)];
        if(prefab)
        {
            let instance = cc.instantiate(prefab);
            let fish=instance.getComponent(FishBase) ;
            this.node.addChild(instance); 
            let pos=cc.v2(0, Utils.Random(this.bottom.position.y,this.height.y));
            fish.node.setPosition(pos);
            let body = 0;
            if(Utils.Random(0,1)<0.6)
            {
                body = Octopus.body + Utils.Random(-0.5, 0.2);
            }
            else{
                body=Utils.Random(-0.4, Octopus.body+5);
            }
            if(body<0.2)
                body=0.2;

            if(this.node.scaleX>0)
            {
                fish.init(1,body);
            }
            else
            {
                fish.init(-1,body);
            }
        }
        

    }
}
