// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    menu: cc.Node;
    @property
    sceneName: string = "GameScene";


    @property(cc.Button)
    btn_pause: cc.Button;
    @property(cc.Button)
    btn_continue: cc.Button;
    @property(cc.Button)
    btn_restart: cc.Button;
    @property(cc.Button)
    btn_exit: cc.Button;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.menu.active = false;

        this.btn_pause.node.on('click', this.onPuase, this);
        this.btn_continue.node.on('click', this.onContinue, this);
        this.btn_restart.node.on('click', this.onRestart, this);
        this.btn_exit.node.on('click', this.onExit, this);
    }

    protected onDestroy(): void {
        //this.btn_pause.node.off('click',this.onPuase,this);
        //this.btn_continue.node.off('click',this.onContinue,this);
        //this.btn_restart.node.off('click',this.onRestart,this);
        //this.btn_exit.node.off('click',this.onExit,this);
    }

    onPuase() {
        cc.director.pause();
        this.menu.active = true;
    }
    onContinue() {
        this.menu.active = false;
        cc.director.resume();
    }

    onRestart() {
        this.onContinue();
        let currentSceneName = cc.director.getScene().name;

        cc.director.loadScene(currentSceneName, function () {
        });
    }

    onExit() {
        cc.game.end();
    }

    // update (dt) {}
}
