import FishBase from "../Entity/NPC/FishBase";

//抓鱼
export class TryCatchingFish
{
    callback:any;
    fish:FishBase;
    constructor(fishBase,callback)
    {
        this.callback=callback;
        this.fish=fishBase;
    }

}