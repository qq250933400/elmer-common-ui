import {
    Component,
    declareComponent,
    getUI,
    IElmerEvent,
    IElmerMouseEvent,
    IElmerTouchEvent,
    IPropCheckRule,
    PropTypes
} from "elmer-ui-core";
import "./index.less";

type TypeColorPickerProps = {
    style: string;
    className: string;
    confirmText: string;
    cancelText: string;
    onConfirm: Function;
    onCancel:Function;
};
type TypeColorPickerPropsRule = {[P in keyof TypeColorPickerProps]:IPropCheckRule};

type TypeColorPickerState = {
    color: string;
    choseColor: string;
    choseColorData: TypePointColor;
    indicatorBarTop: string;
    opacity: string|number;
    showRgb: boolean;
    choseResultStyle?: string;
};
type TypePoint = {
    x: number;
    y: number;
};
type TypePointColor = {
    r: number;
    g: number;
    b: number;
    a: number;
    rgba: string;
    rgb: string;
    hex: string;
};

@declareComponent({
    selector: "color-picker",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export default class ColorPicker extends Component {
    static propType:TypeColorPickerPropsRule = {
        style: {
            description: "内联样式",
            defaultValue: "",
            rule: PropTypes.string
        },
        confirmText: {
            description: "确定按钮文本",
            defaultValue: "确定",
            rule: PropTypes.string
        },
        cancelText: {
            description: "取消按钮文本",
            defaultValue: "取消",
            rule: PropTypes.string
        },
        className: {
            description: "自定义样式",
            defaultValue: "AniZoomIn",
            rule: PropTypes.string
        },
        onConfirm: {
            description: "确定事件回调",
            rule: PropTypes.func
        },
        onCancel: {
            description: "取消事件回调",
            rule: PropTypes.func
        }
    };
    // 定义组件id, 通过dom[id]获取真是元素
    opacityId: string;
    opacityBarId: string;
    pickerId: string;
    indicatorId: string;
    indicatorBarId: string;
    containerId: string;
    choseColorId: string;
    choseResultBackId: string;
    selectAreaId: string;
    selectAreaFocusId: string;
    inputResultId: string;
    inputRId: string;
    inputGId: string;
    inputBId: string;
    inputAId: string;
    state: TypeColorPickerState = {
        color: "#f6000c",
        choseColor: "#fff",
        choseColorData: {
            r: 245,
            g: 0,
            b: 35,
            a: 1,
            rgba: "rgba(245,0,35,1)",
            rgb: "rgb(245,0,35)",
            hex: "#f6000c"
        },
        indicatorBarTop: "0px",
        opacity: 1,
        showRgb: false,
        choseResultStyle: ""
    };
    props: TypeColorPickerProps;
    private rect:DOMRect|ClientRect;
    private selectRect:DOMRect|ClientRect;
    private pickerCanvas: HTMLCanvasElement;
    private pickerCtv:CanvasRenderingContext2D;
    private pickerWidth: number;
    private pickerHeight: number;
    private indicatorCanvas: HTMLCanvasElement;
    private indicatorCtv: CanvasRenderingContext2D;
    private indicatorWidth: number;
    private indicatorHeight: number;
    private indicatorBar:HTMLLinkElement;
    // indicator events
    private isIndicatorCanMoved: boolean = false;
    private indicatorY:number = 0;
    private indicatorTop: number = 0;
    // select area event
    private isSelectAreaCanMoved: boolean = false;
    private selectAreaPoint:TypePoint = {
        x: 0,
        y: 0
    };
    // opacity slider
    private opacityCanvas:HTMLCanvasElement;
    private opacityCvt: CanvasRenderingContext2D;
    private opacityBar: HTMLLinkElement;
    private isOpacityCanMoved: boolean = false;
    private opacityY: number = 0;
    private opacityTop: number = 0;
    private opacityHeight: number;
    constructor(props: any) {
        super(props);
        this.pickerId = this.guid();
        this.indicatorId = this.guid();
        this.indicatorBarId = this.guid();
        this.containerId = this.guid();
        this.inputRId = this.guid();
        this.inputGId = this.guid();
        this.inputBId = this.guid();
        this.inputAId = this.guid();
        this.choseColorId = this.guid();
        this.selectAreaId = this.guid();
        this.selectAreaFocusId = this.guid();
        this.inputResultId = this.guid();
        this.opacityId = this.guid();
        this.opacityBarId = this.guid();
        this.choseResultBackId = this.guid();
    }
    onConfirmClick(): void {
        typeof this.props.onConfirm === "function" && this.props.onConfirm(this.state.choseColorData);
    }
    onCancelClick(): void {
        typeof this.props.onCancel === "function" && this.props.onCancel();
    }
    handleOnChangeDisplay(): void {
        this.state.showRgb = !this.state.showRgb;
        this.choseColor(this.getIndicatorPixelColor(this.pickerCtv, this.selectAreaPoint.x, this.selectAreaPoint.y));
    }
    /**
     * 显示选择颜色框点击事件，切换显示颜色值模式
     * @param evt IElmerEvent
     */
    handleOnInputResultClick(evt:IElmerEvent): void {
        const target:HTMLInputElement = <HTMLInputElement>evt.target;
        target.setSelectionRange(0, target.value.length);
    }
    onOpacityTouchStart(evt:IElmerTouchEvent|IElmerMouseEvent): void {
        if(this.isTouchEvent(evt)) {
            this.opacityY = evt.nativeEvent.touches[0].clientY;
        } else {
            this.opacityY = evt.nativeEvent.clientY;
        }
        this.isOpacityCanMoved = true;
    }
    onselectAreaStart(evt:IElmerTouchEvent|IElmerMouseEvent): void {
        let point:TypePoint;
        // evt.nativeEvent.cancelBubble = true;
        if(this.isTouchEvent(evt)) {
            point = {
                x: evt.nativeEvent.touches[0].clientX,
                y: evt.nativeEvent.touches[0].clientY
            };
        } else {
            point = {
                x: evt.nativeEvent.clientX,
                y: evt.nativeEvent.clientY
            };
        }
        if(this.isInSelectArea(point.x, point.y)) {
            const rect = this.getAreaRect();
            const offsetSize = this.getSelectOffset();
            this.selectAreaPoint = {
                x: point.x - rect.left - offsetSize.offsetLeft,
                y: point.y - rect.top - offsetSize.offsetTop
            };
            this.isSelectAreaCanMoved = true;
            this.choseColor(this.getIndicatorPixelColor(this.pickerCtv, this.selectAreaPoint.x, this.selectAreaPoint.y));
            this.drawColorArea();
        }
    }
    onIndicatorTouchEnd(): void {
        this.isIndicatorCanMoved = false;
        this.isSelectAreaCanMoved = false;
        this.isOpacityCanMoved = false;
    }
    onIndicatorMove(evt:IElmerTouchEvent|IElmerMouseEvent):void {
        let posY = 0;
        if(this.isTouchEvent(evt)) {
            posY = evt.nativeEvent.touches[0].clientY;
        } else {
            posY = evt.nativeEvent.clientY;
        }
        evt.nativeEvent.cancelBubble = true;
        // 选择颜色滑块
        if(this.isIndicatorCanMoved) {
            const offsetY = posY - this.indicatorY;
            const offsetTop = this.indicatorTop + offsetY;
            if(offsetTop>=0 && offsetTop < this.indicatorHeight) {
                this.indicatorBar.style.top = offsetTop + "px";
                this.indicatorTop = offsetTop;
                this.indicatorY = posY;
                this.state.color = this.getIndicatorPixelColor(this.indicatorCtv,2,offsetTop).rgb;
                this.drawColorArea();
                this.choseColor(this.getIndicatorPixelColor(this.pickerCtv, this.selectAreaPoint.x, this.selectAreaPoint.y));
            }
        }
        // 透明度滑块
        if(this.isOpacityCanMoved) {
            const offsetY = posY - this.opacityY;
            const offsetTop = this.opacityTop + offsetY;
            if(offsetTop>=0 && offsetTop < this.opacityHeight) {
                this.opacityBar.style.top = offsetTop + "px";
                this.opacityTop = offsetTop;
                this.opacityY = posY;
                this.state.opacity = (1 - parseFloat((offsetTop / this.opacityHeight).toFixed(2))).toFixed(2);
                this.choseColor(this.getIndicatorPixelColor(this.pickerCtv, this.selectAreaPoint.x, this.selectAreaPoint.y));
            }
        }
        // 最左侧选择颜色区域拖动
        if(this.isSelectAreaCanMoved) {
            let pos2X = 0, pos2Y = 0;
            if(this.isTouchEvent(evt)) {
                pos2X = evt.nativeEvent.touches[0].clientX;
                pos2Y = evt.nativeEvent.touches[0].clientY;
            } else {
                pos2X = evt.nativeEvent.clientX;
                pos2Y = evt.nativeEvent.clientY;
            }
            if(this.isInSelectArea(pos2X, pos2Y)) {
                const rect = this.getAreaRect();
                const offsetSize = this.getSelectOffset();
                this.selectAreaPoint = {
                    x: pos2X- rect.left - offsetSize.offsetLeft,
                    y: pos2Y - rect.top - offsetSize.offsetTop
                };
                this.choseColor(this.getIndicatorPixelColor(this.pickerCtv, this.selectAreaPoint.x, this.selectAreaPoint.y));
                this.drawColorArea();
            }
        }
    }
    onIndicatorTouchStart(evt:IElmerTouchEvent|IElmerMouseEvent):void {
        if(this.isTouchEvent(evt)) {
            this.indicatorY = evt.nativeEvent.touches[0].clientY;
        } else {
            this.indicatorY = evt.nativeEvent.clientY;
        }
        this.isIndicatorCanMoved = true;
    }
    onDragstart(evt:IElmerEvent): any {
        evt.nativeEvent.preventDefault();
        return false;
    }
    onStopReturnValue(evt:IElmerEvent): any {
        evt.nativeEvent.returnValue = false;
        evt.nativeEvent.preventDefault();
        return false;
    }
    /**
     * 组件首次挂载事件
     */
    $didMount(): void {
        const outDiv:HTMLDivElement = this.dom[this.containerId];
        const focusDiv:HTMLDivElement = this.dom[this.selectAreaFocusId];

        this.rect = outDiv.getBoundingClientRect();
        this.pickerCanvas = this.dom[this.pickerId];
        this.pickerCtv = this.pickerCanvas.getContext("2d");
        this.pickerWidth = this.pickerCanvas.clientWidth;
        this.pickerHeight = this.pickerCanvas.clientHeight;
        this.pickerCanvas.width = this.pickerWidth;
        this.pickerCanvas.height = this.pickerHeight;
        this.selectRect = this.dom[this.selectAreaId].getBoundingClientRect();
        // indicator
        this.indicatorCanvas = this.dom[this.indicatorId];
        this.indicatorCtv = this.indicatorCanvas.getContext("2d");
        this.indicatorWidth = this.indicatorCanvas.clientWidth;
        this.indicatorHeight = this.indicatorCanvas.clientHeight;
        this.indicatorCanvas.width = this.indicatorWidth;
        this.indicatorCanvas.height = this.indicatorHeight;
        // find dom
        this.indicatorBar = this.dom[this.indicatorBarId];
        // opacity dom
        this.opacityCanvas = this.dom[this.opacityId];
        this.opacityCvt = this.opacityCanvas.getContext("2d");
        this.opacityBar = this.dom[this.opacityBarId];
        this.opacityHeight = this.opacityCanvas.clientHeight;
        this.opacityCanvas.width = this.opacityCanvas.clientWidth;
        this.opacityCanvas.height = this.opacityCanvas.clientHeight;
        this.selectAreaPoint = {
            x: this.selectRect.width - 2 - focusDiv.clientWidth / 2,
            y: 2 + focusDiv.clientHeight / 2
        };
        // display chose color dom
        const dCanvas:HTMLCanvasElement = this.dom[this.choseResultBackId];
        const cvt = dCanvas.getContext("2d");
        dCanvas.width = dCanvas.clientWidth;
        dCanvas.height = dCanvas.clientHeight;
        this.drawGridBk(cvt, dCanvas.clientWidth, dCanvas.clientHeight);

        this.drawColorArea();
        this.drawIndicatorArea();
        this.drawOpacityBar();
    }
    $after(): void {
        this.addEvent(this, document.body, "touchend", this.onIndicatorTouchEnd.bind(this),{
            passive: false
        });
        this.addEvent(this, document.body, "mouseup", this.onIndicatorTouchEnd.bind(this),{
            passive: false
        });
    }
    private getAreaRect():DOMRect {
        return this.dom[this.containerId].getBoundingClientRect();
    }
    private getSelectArea():DOMRect {
        return this.dom[this.selectAreaId].getBoundingClientRect();
    }
    private isInSelectArea(x:number, y:number): boolean {
        this.selectRect = this.getSelectArea();
        return x >= this.selectRect.left && x < this.selectRect.right && y >= this.selectRect.top && y < this.selectRect.bottom;
    }
    // tslint:disable-next-line: typedef
    private getSelectOffset() {
        const outDiv:HTMLDivElement = this.dom[this.containerId];
        const selectDiv:HTMLDivElement = this.dom[this.selectAreaId];
        const outOffsetWidth = outDiv.offsetWidth - outDiv.clientWidth;
        const outOffsetHeight = outDiv.offsetHeight - outDiv.clientHeight;
        const offsetLeft = (<HTMLDivElement>outDiv.children[0]).offsetLeft;
        const offsetTop = (<HTMLDivElement>outDiv.children[0]).offsetTop;
        const borderWidth = outOffsetWidth / 2;
        return {
            offsetLeft: borderWidth + offsetLeft,
            offsetTop: outOffsetHeight / 2 + offsetTop
        };
    }
    private hexify(color: string): string {
        const values = color
            .replace(/rgba?\(/, "")
            .replace(/\)/, "")
            .replace(/[\s+]/g, "")
            .split(",");
        const a = parseFloat(values[3] || "1"),
            r = Math.floor(a * parseInt(values[0], 10) + (1 - a) * 255),
            g = Math.floor(a * parseInt(values[1], 10) + (1 - a) * 255),
            b = Math.floor(a * parseInt(values[2], 10) + (1 - a) * 255);
        return "#" +
            ("0" + r.toString(16)).slice(-2) +
            ("0" + g.toString(16)).slice(-2) +
            ("0" + b.toString(16)).slice(-2);
    }
    private choseColor(colorResult:TypePointColor): void {
        const choseOffset = this.dom[this.selectAreaFocusId].offsetWidth / 2 + 1;
        const focusPositionStyle = `left: ${this.selectAreaPoint.x - choseOffset}px;top:${this.selectAreaPoint.y - choseOffset}px;`;
        colorResult.a = parseFloat(this.state.opacity.toString());
        colorResult.rgba = `rgba(${colorResult.r}, ${colorResult.g}, ${colorResult.b}, ${this.state.opacity})`;
        if(colorResult.a !== 1) {
            colorResult.hex = this.hexify(colorResult.rgba);
        }
        this.state.choseColor = colorResult.rgba;
        this.state.choseColorData = colorResult;
        this.dom[this.choseColorId].style.background = colorResult.rgba;
        this.dom[this.inputRId].value = colorResult.r;
        this.dom[this.inputGId].value = colorResult.g;
        this.dom[this.inputBId].value = colorResult.b;
        this.dom[this.inputAId].value = colorResult.a;
        this.dom[this.selectAreaFocusId].style = focusPositionStyle;
        this.dom[this.inputResultId].value = this.state.showRgb ? (this.state.opacity <1 ? colorResult.rgba : colorResult.rgb) : colorResult.hex;
    }
    // tslint:disable-next-line: typedef
    private getSelectAreaPoint(srcX:number, srcY:number) {
        return {
            x: srcX - this.selectRect.left,
            y: srcY - this.selectRect.top
        };
    }
    private isTouchEvent(evt:any):evt is IElmerTouchEvent {
        return evt.nativeEvent.touches;
    }
    private drawColorArea(): void {
        const cvt = this.pickerCtv;
        cvt.clearRect(0,0, this.pickerWidth, this.pickerHeight);
        cvt.fillStyle = this.state.color;
        cvt.fillRect(0,0, this.pickerWidth, this.pickerHeight);
        cvt.fill();
        cvt.save();
        // -- white to transparent
        const linearWhite = cvt.createLinearGradient(0,0, this.pickerWidth, 0);
        linearWhite.addColorStop(0, "rgba(255,255,255,1)");
        linearWhite.addColorStop(1, "transparent");
        cvt.fillStyle = linearWhite;
        cvt.fillRect(0,0, this.pickerWidth, this.pickerHeight);
        cvt.fill();
        cvt.save();
        // -- black to transparent;
        const linearBlack = cvt.createLinearGradient(0,this.pickerHeight, 0, 0);
        linearBlack.addColorStop(0, "#000");
        linearBlack.addColorStop(1, "transparent");
        cvt.fillStyle = linearBlack;
        cvt.fillRect(0,0, this.pickerWidth, this.pickerHeight);
        cvt.fill();
        cvt.save();
    }
    private drawIndicatorArea(): void {
        // #ff0108
        const cvt = this.indicatorCtv;
        const linearGradient = cvt.createLinearGradient(0,0, 0, this.indicatorHeight);
        linearGradient.addColorStop(0, "#ff0108");
        linearGradient.addColorStop(0.125, "#ee02fa");
        linearGradient.addColorStop(0.125 * 2, "purple");
        linearGradient.addColorStop(0.125 * 3, "blue");
        linearGradient.addColorStop(0.125 * 4, "#02faee");
        linearGradient.addColorStop(0.125 * 5, "#02fa13");
        linearGradient.addColorStop(0.125 * 6, "yellow");
        linearGradient.addColorStop(1, "#fa0202");
        cvt.fillStyle = linearGradient;
        cvt.fillRect(0,0, this.indicatorWidth, this.indicatorHeight);
        cvt.fill();
    }
    private getIndicatorPixelColor(cvt:CanvasRenderingContext2D,x: number, y: number):TypePointColor {
        const imageData = cvt.getImageData(x, y, 1, 1);
        const pixel = imageData.data;
        const r = pixel[0];
        const g = pixel[1];
        const b = pixel[2];
        let a = pixel[3] / 255;
        a = Math.round(a * 100) / 100;
        let rHex = r.toString(16);
        r < 16 && (rHex = "0" + rHex);
        let gHex = g.toString(16);
        g < 16 && (gHex = "0" + gHex);
        let bHex = b.toString(16);
        b < 16 && (bHex = "0" + bHex);
        const rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
        const rgbColor = "rgb(" + r + "," + g + "," + b + ")";
        const hexColor = "#" + rHex + gHex + bHex;
        return {
            rgba: rgbaColor,
            rgb: rgbColor,
            hex: hexColor,
            r,
            g,
            b,
            a
        };
    }
    private drawOpacityBar():void {
        const width = this.opacityCanvas.clientWidth;
        const height = this.opacityHeight;
        const cvt = this.opacityCvt;
        const linearGradient = cvt.createLinearGradient(0,0, 0, this.opacityHeight);
        linearGradient.addColorStop(0.2, "#fff");
        linearGradient.addColorStop(1, "rgba(255,255,255,0");
        this.drawGridBk(cvt, width, height); // draw background image
        cvt.restore();
        cvt.fillStyle = linearGradient;
        cvt.fillRect(0,0, width, height);
        cvt.fill();
    }
    private drawGridBk(cvt:CanvasRenderingContext2D, width: number, height: number): void {
        const size = 5;
        const rows = Math.ceil(height / size);
        const cols = Math.ceil(width / size);
        for(let i=0;i<rows;i++) {
            // mode == 0, 01010101
            // mode == 1, 10101010
            const isMode1 = i % 2 === 0;
            for(let j=0;j<cols;j++) {
                cvt.beginPath();
                cvt.fillRect(j*size, i*size, size, size);
                if(isMode1) {
                    if(j % 2 === 0) {
                        cvt.fillStyle = "#fff";
                        cvt.fill();
                    } else {
                        cvt.fillStyle = "gray";
                        cvt.fill();
                    }
                } else {
                    if(j % 2 !== 0) {
                        cvt.fillStyle = "#fff";
                        cvt.fill();
                    } else {
                        cvt.fillStyle = "gray";
                        cvt.fill();
                    }
                }
                cvt.closePath();
                cvt.save();
            }
        }
    }
}
