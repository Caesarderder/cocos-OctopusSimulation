import FishBase from "../../../Entity/NPC/FishBase";
import { IState } from "../../IState";

export class FishStateBase implements IState{
    entity:FishBase

    constructor(entity)
    {
        this.entity=entity;
    }

    onEnter() {
    }

    tick(dt:number) {
    }

    onExit() {
    }

    onClick() {
        
    }

}