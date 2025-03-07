import SpriteMeshProcessor, { MeshAnimationInfo } from "../../MeshProcesser/SpriteMeshProcessor";

const { ccclass, property,executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export default class Tentacle extends cc.Component {

    meshProcessor: SpriteMeshProcessor=null;

    moveInfoList: number[];

    // onLoad () {}

    start () 
    {
        this.meshProcessor=this.getComponent(SpriteMeshProcessor);

        let info:TentacleMoveInfo=new TentacleMoveInfo();
        cc.log("??");
        info.callback=this.test;
        info.callback();
    }

    test(){
        cc.log("!!");
    }

    update (dt:number) {

    }
}

export enum ETentableState
{
    Move,
    Follow,
}

export class TentacleMoveInfo
{
    public animationInfo:MeshAnimationInfo;
    public targetNode:cc.Node;
    public moveSpeed:number;
    public stateToEnter:ETentableState;
    public callback:any;
}


