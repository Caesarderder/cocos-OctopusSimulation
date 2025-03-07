const { ccclass } = cc._decorator;

@ccclass('Singleton')
export class SingletonBase<T> extends cc.Component{
    static _instance: any;

    public static get Instance() {
        if (this._instance == null) {
            return this._instance=new this();
        }
        return this._instance;
    }

    public static set Instance(ins:any)
    {
        this._instance=ins;
    }
}