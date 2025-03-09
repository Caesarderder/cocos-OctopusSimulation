import Utils from "../Util/Utils";

const { ccclass, property, executeInEditMode } = cc._decorator;
@ccclass
@executeInEditMode
export default class SpriteMeshProcessor extends cc.Component {
    @property(cc.Node)
    startPivot: cc.Node=null;
    @property(cc.Node)
    targetPivot: cc.Node=null;

    @property
    delta: number=10;
    @property
    width: number=40;

    @property
    A: number=1;
    @property
    K: number=1;
    @property
    W: number=1;
    @property
    color1: cc.Color=cc.Color.RED;
    @property
    color2: cc.Color=cc.Color.RED;

    density: number=1;
    verticesCount: number;
    indicesCount: number;
    step: number;

    renderData: any;

    start() {
        this.step=5;
        this.PreProcessData();

        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
            // let assembler = this.node.getComponent(cc.Sprite)['_assembler'];
            // let renderData = assembler._renderData;
            // let vDatas = renderData.vDatas[0];
            // let iDatas = renderData.iDatas[0];
            // cc.log("vDatas1:",vDatas);
            // cc.log("iDatas1:",iDatas);
        });
    }

    PreProcessData()
    {
        //获取cc.Sprite对象ymSpt
        let ymSpt = this.node.getComponent(cc.Sprite);

        //构造一个cc.Assembler对象，替换掉ymSpt原先4个顶点的那个_assembler
        let assembler = ymSpt['_assembler'] = new cc['Assembler']();

        //设置assembler的渲染对象是ymSpt，完成assembler和cc.Sprite双向绑定
        assembler.init(ymSpt);
        //构造一个this.renderData，用来存放顶点数据
        this.renderData = new cc['RenderData']();
        //把assembler绑定到this.renderData，原生平台必须绑，Web平台绑不绑都行
        this.renderData.init(assembler);
        //根据顶点格式，创建this.renderData里的数组
        //step = 每个顶点占用长度，由顶点格式决定，cc.Sprite默认长度是5（x,y,u,v,color）
        //verticesCount = 顶点数量
        //indicesCount = 三角形数量 * 3

        let vertices = new Float32Array(this.verticesCount * this.step);
        let indices = new Uint16Array(this.indicesCount);
        this.renderData.updateMesh(0, vertices, indices);
        //原生平台可以用这个函数修改顶点格式，Web平台不需要
        cc.sys.isNative && assembler['setVertexFormat'](cc['gfx'].VertexFormat.XY_UV_Color);
        //通过assembler将this.renderData里的顶点数据提交给GPU渲染
        //原生平台并不会执行这个函数，因为原生平台引擎重载了fillBuffers
        assembler.fillBuffers = () => {
            let vData = this.renderData.vDatas[0];
            let iData = this.renderData.iDatas[0];
            let buffer = cc.renderer['_handle']._meshBuffer;
            let offsetInfo = buffer.request(this.verticesCount, this.indicesCount);
            let vertexOffset = offsetInfo.byteOffset >> 2;
            let vbuf = buffer._vData;
            if (vData.length + vertexOffset > vbuf.length) {
                vbuf.set(vData.subarray(0, vbuf.length - vertexOffset), vertexOffset);
            } else {
                vbuf.set(vData, vertexOffset);
            }
            let ibuf = buffer._iData;
            let indiceOffset = offsetInfo.indiceOffset;
            let vertexId = offsetInfo.vertexOffset;
            for (let i = 0, len = iData.length; i < len; ibuf[indiceOffset++] = vertexId + iData[i++]);
        }

        //更新this.renderData里的顶点数据
        assembler.updateRenderData = () => this._UpdateRenderdata();
    }

    _UpdateRenderdata() {
        this._CaculateVerticesCount();
        let startPivot = this.startPivot;
        let targetPivot = this.targetPivot;
        let startPivotPos:cc.Vec2 = cc.v2(startPivot.position);
        let targetPivotPos:cc.Vec2 = cc.v2(targetPivot.position);

        let vData = this.renderData.vDatas[0]=new Float32Array(this.verticesCount * this.step);
        let iData = this.renderData.iDatas[0]=new Uint16Array(this.indicesCount);
        this.renderData.updateMesh(0, vData, iData);
        let len=cc.Vec2.distance(startPivotPos,targetPivotPos);
        let deltaLen=len/this.density;
        let dirY:cc.Vec2=cc.Vec2.ZERO;
        let dirX:cc.Vec2=cc.Vec2.ZERO;


        this.A = 2 - 1 * len / 1000;
        if(this.A<0.4)
            this.A=0.4;
        
        dirY=targetPivotPos.subtract(startPivotPos).normalize();
        dirX=cc.v2(-dirY.y,dirY.x).normalize();

        for (let i = 0; i <= this.density; i++) 
        {
            let index = i * 2;
            let curReferencePos = startPivotPos.add(cc.v2(dirY.x*deltaLen*i,dirY.y*deltaLen*i));

            //设置顶点XY
            let localPos = curReferencePos.add(cc.v2(dirX.x*this.width,dirX.y*this.width));
            let pos = Utils.GetWorldPostitionsByOffset(startPivot, localPos);
            this._VertexTransformSelf(deltaLen*i,pos);
            vData[index * this.step] = pos.x;
            vData[index * this.step + 1] = pos.y;

            let localPos1 = curReferencePos.subtract(cc.v2(dirX.x*this.width,dirX.y*this.width));
            let pos1 = Utils.GetWorldPostitionsByOffset(startPivot, localPos1);
            this._VertexTransformSelf(deltaLen*i,pos1);
            vData[(index + 1) * this.step] = pos1.x;
            vData[(index + 1) * this.step + 1] = pos1.y;       

            //设置顶点UV
            vData[index * this.step + 2] = 0;
            vData[index * this.step + 3] = i/this.density;
            vData[(index + 1) * this.step + 2] = 1;
            vData[(index + 1) * this.step + 3] = i/this.density;

            let uintVData = this.renderData.uintVDatas[0];
            if(i%2==0)
            {
                uintVData[index * this.step + 4] = this.color1['_val'];
                uintVData[index * this.step + 9] = this.color2['_val'];
            }
            else
            {
                uintVData[index * this.step + 4] = this.color2['_val'];
                uintVData[index * this.step + 9] = this.color1['_val'];
            }

            //设置三角形顶点索引
            if(i==this.density)
                break;

            iData[index*3] = index;
            iData[index*3+1] = index+1;
            iData[index*3+2] = index+2;

            iData[index*3+3] = index+1;
            iData[index*3+4] = index+3;
            iData[index*3+5] = index+2;
        }
    }

    _CaculateVerticesCount()
    {
        this.density=Math.round(cc.Vec2.distance(this.startPivot.position,this.targetPivot.position)/this.delta);
        this.verticesCount=2*this.density+2;
        this.indicesCount=this.density*6;
    }

    _VertexTransformSelf(x:number,pos:cc.Vec2)
    {
        let dirX:cc.Vec2=cc.v2(this.targetPivot.position.subtract(this.startPivot.position).normalize());
        var dir=cc.v2(dirX.y,-dirX.x);
        var offset=this.A*Math.sin(this.K*x+this.W*cc.director.getTotalTime());
        pos.addSelf(dir.mul(offset));
    }


    protected update(dt: number): void {
        // // 移动节点
        // let position = this.node.position;
        // let dis = cc.v3(this.width * dt, 0, 0);
        // let dis1 = cc.v3(0,this.width *10* dt , 0);
        // this.node.setPosition(position.add(dis));
        // this.targetPivot.setPosition(this.targetPivot.position.add(dis1));
        // cc.log("update:", this.node.getPosition());

        // 确保调用 assembler 的 fillBuffers 方法
        // this.PreProcessData();
        let ymSpt = this.node.getComponent(cc.Sprite);
        let assembler = ymSpt['_assembler'];
        if (assembler) {
            assembler.fillBuffers();
            assembler.updateRenderData();
        }
    }

    public SetAnimationInfo(info:MeshAnimationInfo )
    {
        this.A=info.A;
        this.K=info.K;
        this.W=info.W;
    }

    public Move(dis:cc.Vec2)
    {
        Utils.MoveByWroldDir(this.targetPivot,dis);
    }
}

export class MeshAnimationInfo
{
    public A: number=1;
    public K: number=1;
    public W: number=1;

    constructor(a?: number, k?: number, w?: number) {
        // 如果提供了所有参数，则使用它们
        if (a !== undefined && k !== undefined && w !== undefined) {
            this.A = a;
            this.K = k;
            this.W = w;
        } else {
            // 如果没有提供参数，或者只提供了部分参数，则使用默认值
            this.A = a !== undefined ? a : 10;
            this.K = k !== undefined ? k : 10;
            this.W = w !== undefined ? w : 10;
        }
    }
}