import { IBackgroundPlugin } from "./IBackgroundPlugin";

type TypeDrawObject = {
    x: number;
    y: number;
    speed: number;
    text: string;
    duration: number;
};

export class MatrixCharacterEffects implements IBackgroundPlugin {
    canvas: HTMLCanvasElement;
    cvt: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private objects: TypeDrawObject[] = [];
    private wordColor: string = "#33ff33";
    private fontSize: number = 16;
    private time:number = 0;
    constructor(cav:HTMLCanvasElement) {
        this.canvas = cav;
        this.cvt = cav.getContext("2d");
    }
    init(): void {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.cvt.fillStyle = "#000";
        this.cvt.fillRect(0,0,this.width, this.height);
        this.cvt.fill();
        this.cvt.save();
        this.refreshObjects();
    }
    dispose(): void {
        this.cvt = null;
        this.canvas = null;
    }
    onPropsChange(props: any): void {
        throw new Error("Method not implemented.");
    }
    resize(): void {
        this.init();
    }
    draw(): void {
        if(this.time % 6 === 0) {
            let cvt = this.cvt;
            cvt.fillStyle = "rgba(0,0,0,0.4)";
            cvt.fillRect(0,0, this.width, this.height);
            cvt.fill();
            cvt.save();
            cvt.beginPath();
            cvt.fillStyle = this.wordColor;
            cvt.font = `${this.fontSize}px Courier New`;
            // cvt.translate(this.width, 0);
            // cvt.scale(-1,1);
            // ----------------
            for(let i=0,mLen=this.objects.length;i<mLen; i++) {
                let tmpObj = this.objects[i];
                let dStr = tmpObj.text;
                for(let j=0,xLen = dStr.length; j<xLen;j++) {
                    cvt.fillText(dStr.substr(j,1), tmpObj.x, tmpObj.y + j*this.fontSize+2);
                }
                if(this.objects[i].y + tmpObj.speed < this.height ) {
                    this.objects[i].y = this.objects[i].y + tmpObj.speed + 1;
                } else {
                    this.objects[i].y = parseInt((-Math.random()*this.height/2).toString(),10)+1;
                    this.objects[i].text = this.getSupportStr();
                }
                dStr = null;
                tmpObj = null;
            }
            // ----------------
            cvt.fill();
            cvt.save();
            cvt.restore();
            cvt = null;
            this.time = 0;
        }
        this.time += 1;
    }
    private refreshObjects(): void {
        const columnLen = this.width / (this.fontSize/2);
        this.objects = [];
        for(let i=0;i<columnLen;i++) {
            this.objects.push({
                x: i * this.fontSize,
                y: parseInt((Math.random()*this.height).toString(),10)+1,
                speed: Math.random() + 50,
                text: this.getSupportStr(),
                duration: 3
            });
        }
    }
    private getSupportStr(): string {
        let baseStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789アイウエオカキクケコトテツタソセシササナニヌノヒヘホマミメヤヨラルロヲㅥㅧㅧㄆㄈㄓㄥㄣㄢㄠㄝㄧㄩ";
        let len = baseStr.length;
        let dataLen = parseInt((Math.random()*20 + 5).toString(),10);
        let result = "";
        for(let i=0;i<dataLen;i++) {
            let index = parseInt((Math.random()*len).toString(), 10);
            result += baseStr.substr(index, 1);
            index = null;
        }
        dataLen = null;
        len = null;
        baseStr = null;
        return result;
    }
}
