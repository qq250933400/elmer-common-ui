import { Common } from "elmer-common";
import { IBackgroundPlugin } from "../IBackgroundPlugin";

export class PictureBackground extends Common implements IBackgroundPlugin {
    canvas: HTMLCanvasElement;
    cvt: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private imageLink: string = "";
    private image:HTMLImageElement;
    private blur: number = 10;
    private fillBackColor: string = "rgb(235, 235, 235)";
    constructor(cav:HTMLCanvasElement, props:any) {
        super();
        this.canvas = cav;
        this.cvt = cav.getContext("2d");
        this.imageLink = this.getValue(props, "backgroundConfig.image");
        this.blur = this.getValue(props, "backgroundConfig.blur");
        this.fillBackColor = this.getValue(props, "backgroundConfig.backgroundColor") || "rgb(235, 235, 235)";
    }
    init(): void {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.fillBack();
        this.downloadImage();
    }
    dispose(): void {
        this.cvt = null;
        this.canvas = null;
    }
    onPropsChange(props: any): void {
        const img:any = this.getValue(props, "backgroundConfig.image");
        const blur:number = this.getValue(props, "backgroundConfig.blur");
        if((!this.isEmpty(img) && img !== this.imageLink) || blur !== this.blur) {
            if(blur !== this.blur) {
                this.blur = blur >= 0 ? blur : 0;
            }
            if((!this.isEmpty(img) && img !== this.imageLink)) {
                this.imageLink = img;
                this.downloadImage();
            } else {
                this.draw();
            }
        }
    }
    draw(tim?: number): void {
        if(this.image) {
            this.fillBack();
            this.cvt.drawImage(this.image, 0, 0, this.width, this.height);
            this.drawBlur();
        }
    }
    resize(wWidth?: number, wHeight?: number): void {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.draw();
    }
    private fillBack():void {
        this.cvt.fillStyle = this.fillBackColor;
        this.cvt.fillRect(0,0,this.width, this.height);
        this.cvt.fill();
        this.cvt.save();
    }
    private downloadImage(): void {
        if(!this.isEmpty(this.imageLink)) {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.draw();
            };
            img.src = this.imageLink;
        }
    }
    private drawBlur(): void {
        if(this.height) {
            const imgData:ImageData = this.cvt.getImageData(0,0, this.width, this.height);
            const blurData = this.gaussBlur(imgData);
            this.cvt.putImageData(blurData, 0, 0);
        }
    }
    private gaussBlur(imgData:ImageData):ImageData {
        const pixes = imgData.data;
        const width = imgData.width;
        const height = imgData.height;
        // tslint:disable-next-line: prefer-const
        let gaussMatrix = [],
            gaussSum = 0,
            x, y,
            r, g, b, a,
            i, j, k;

        const radius = 10;
        const sigma = 5;

        a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
        b = -1 / (2 * sigma * sigma);
        // 生成高斯矩阵
        // tslint:disable-next-line: no-shadowed-variable
        for (let i = 0, x = -radius; x <= radius; x++, i++) {
            g = a * Math.exp(b * x * x);
            gaussMatrix[i] = g;
            gaussSum += g;

        }

        // 归一化, 保证高斯矩阵的值在[0,1]之间
        // tslint:disable-next-line: no-shadowed-variable
        for (let i = 0, len = gaussMatrix.length; i < len; i++) {
            gaussMatrix[i] /= gaussSum;
        }
        // x 方向一维高斯运算
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = x + j;
                    if (k >= 0 && k < width) {// 确保 k 没超出 x 的范围
                        // r,g,b,a 四个一组
                        i = (y * width + k) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
                // console.log(gaussSum)
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
                // pixes[i + 3] = a ;
            }
        }
        // y 方向一维高斯运算
        for (x = 0; x < width; x++) {
            for (y = 0; y < height; y++) {
                r = g = b = a = 0;
                gaussSum = 0;
                for (j = -radius; j <= radius; j++) {
                    k = y + j;
                    if (k >= 0 && k < height) {// 确保 k 没超出 y 的范围
                        i = (k * width + x) * 4;
                        r += pixes[i] * gaussMatrix[j + radius];
                        g += pixes[i + 1] * gaussMatrix[j + radius];
                        b += pixes[i + 2] * gaussMatrix[j + radius];
                        // a += pixes[i + 3] * gaussMatrix[j];
                        gaussSum += gaussMatrix[j + radius];
                    }
                }
                i = (y * width + x) * 4;
                pixes[i] = r / gaussSum;
                pixes[i + 1] = g / gaussSum;
                pixes[i + 2] = b / gaussSum;
            }
        }
        return imgData;
    }
}
