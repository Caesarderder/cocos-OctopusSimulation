// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Utils {
    public static GetWorldPostitions(node:cc.Node):cc.Vec2{
        if(node.parent==null)return node.getPosition();
        return node.parent.convertToWorldSpaceAR(node.getPosition());
    }
    public static GetLocalPostitionsByOffset(node: cc.Node,offset:cc.Vec2): cc.Vec2 {
        if(node.parent==null)return offset;
        return node.parent.convertToNodeSpaceAR(offset);
    }

    public static GetWorldPostitionsByOffset(node: cc.Node, offset: cc.Vec2): cc.Vec2 {
        if(node.parent==null)return offset;
        return node.parent.convertToWorldSpaceAR(offset);
    }

    public static MoveByWroldDir(node:cc.Node,worldDir:cc.Vec2)
    {
        let worldPos=this.GetWorldPostitions(node).add(worldDir);

        if(node.parent==null)
        {
            node.setPosition(worldPos);
        }
        else
        {
            node.setPosition(node.parent.convertToNodeSpaceAR(worldPos));
        }
    }

    public static Random(min:number,max:number):number
    {
        return Math.random()*(max-min)+min;
    }

    public static RandomInt(min:number,max:number):number
    {
        return Math.floor(Math.random()*(max-min))+min;
    }

    public static BodyToScale(body:number):number
    {
        //0.1  
        //scale:0.4~5
        return 0.4+body*0.2;
    }
}
