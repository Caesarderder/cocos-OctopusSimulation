import { IState } from "./IState";

export class StateMachine 
{
    public curState:IState;
    private states:Map<string,IState>=new Map();
    public curStateName:string;

    constructor() {}

    public addState(name:string,state:IState)
    {
        this.states.set(name,state);
    }

    public changeState(name: string): void {
        if(!this.states.has(name))
        {
            cc.error("StateMachine does not register state:",name);
            return;
        }
        if(this.curStateName==name)
            return;

        if (this.curState) {
            this.curState.onExit();
        }
        this.curState = this.states.get(name);
        if (this.curState) {
            this.curStateName=name;
            this.curState.onEnter();
        }
    }

    public tick(dt:number): void {
        if (this.curState) {
            this.curState.tick(dt);
        }
    }


}