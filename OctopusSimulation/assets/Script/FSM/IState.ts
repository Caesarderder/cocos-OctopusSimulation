
export interface IState{
    onEnter();
    tick(dt:number);
    onExit();
    onClick();
}