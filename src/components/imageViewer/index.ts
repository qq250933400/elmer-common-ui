import { Component, declareComponent, IElmerMouseEvent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import "./index.less";

export type TypeImageViewerData = {
    title?: string;
    url: string;
};

export type TypeImageViewerState = {
    data?: TypeImageViewerData[];
    index?: number;
    nextIndex?: number;
    currentData?: TypeImageViewerData;
    nextData?: TypeImageViewerData;
    style?: string;
    currentStyle?: string;
    currentClassName?: string;
    currentTitle?: string;
    nextStyle?: string;
    nextClassName?: string;
    showCurrent?: boolean;
    visible?: boolean;
};

type TypeImageViewerProps = {
    data?: TypeImageViewerData[];
    width?: string;
    height?: string;
    style?: string;
    zIndex?: number;
    title?: string;
    visible?: boolean;
    onClose?: Function;
    className?: string;
};

type TypeMousePoint = {
    x: number;
    y: number;
};

type TypeImageViewerPropRules = {[P in keyof TypeImageViewerProps]: IPropCheckRule};

@declareComponent({
    selector: "ImageViewer",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export default class ImageViewer extends Component {
    static propType:TypeImageViewerPropRules = {
        data: {
            description: "图片数据",
            rule: PropTypes.array.isRequired
        },
        width: {
            description: "宽度",
            defaultValue: "100%",
            rule: PropTypes.string
        },
        height: {
            description: "高度",
            defaultValue: "100%",
            rule: PropTypes.string
        },
        style: {
            description: "样式",
            defaultValue: "position:fixed;left:0;top:0;",
            rule: PropTypes.string
        },
        zIndex: {
            description: "zIndex",
            defaultValue: 10001,
            rule: PropTypes.number
        },
        title: {
            description: "标题",
            defaultValue: "Image Viewer",
            rule: PropTypes.string
        },
        visible: {
            description: "显示隐藏",
            defaultValue: true,
            rule: PropTypes.bool.isRequired
        },
        onClose: {
            description: "关闭按钮事件",
            rule: PropTypes.func
        },
        className: {
            description: "样式",
            defaultValue: "AniZoomIn",
            rule: PropTypes.string
        }
    };
    state: TypeImageViewerState = {
        data: [],
        style: "",
        currentStyle: "",
        nextStyle: "opacity:0;",
        showCurrent: true,
        index: 0,
        nextIndex: 1,
        visible: true
    };
    props: TypeImageViewerProps;
    containerId: string;
    currentId?: string;
    nextId?: string;
    currentDom?: HTMLImageElement;
    nextDom?: HTMLImageElement;
    private routateLevel: number = 0;
    private zoomLevel: number = 0;
    private isGoNext:boolean = true;
    private isAnimationStart: boolean = false;
    private canChangeSize: boolean = true;
    private mousePoint: TypeMousePoint = {
        x: 0,
        y: 0
    };
    private movePoint: TypeMousePoint = {
        x: 0,
        y: 0
    };
    private isMouseDown: boolean = false;
    constructor(props:TypeImageViewerProps) {
        super(props);
        const data = props.data || [];
        if(data.length < 2 && data.length > 0) {
            data.push(data[0]);
        } else {
            if(data.length <=0) {
                // tslint:disable-next-line: no-console
                console.error("Please set image datas");
            }
        }
        this.currentId = this.guid();
        this.nextId = this.guid();
        this.containerId = this.guid();
        this.state.index = 0;
        this.state.data = data;
        this.state.currentData = data[0];
        this.state.nextData = data[1];
        this.state.style = (props.style || "") + this.sizeStyle(props.width, props.height, props.zIndex);
        this.state.visible = props.visible;
        if(this.state.currentData) {
            this.state.currentTitle = this.state.currentData.title;
        }
    }
    handleOnContainerMouseDown(evt:IElmerMouseEvent): void {
        evt.nativeEvent.preventDefault();
        this.isMouseDown = true;
        this.mousePoint = {
            x: evt.nativeEvent.clientX,
            y: evt.nativeEvent.clientY
        };
    }
    handleOnContainerMouseMove(evt:IElmerMouseEvent): void {
        evt.nativeEvent.preventDefault();
        if(this.isMouseDown) {
            const posX: number = evt.nativeEvent.clientX, posY: number = evt.nativeEvent.clientY;
            this.movePoint = {
                x: posX - this.mousePoint.x + this.movePoint.x,
                y: posY - this.mousePoint.y + this.movePoint.y
            };
            const transValue = `translate3d(${this.movePoint.x}px, ${this.movePoint.y}px, 0)`;
            if(this.state.showCurrent) {
                const mcStyle: string = this.updateStyle(this.state.currentStyle, `transform: ${transValue};-webkit-transform: ${transValue};`);
                this.setState({
                    currentStyle: mcStyle
                });
            } else {
                const mcStyle: string = this.updateStyle(this.state.nextStyle, `transform: ${transValue};-webkit-transform: ${transValue};`);
                this.setState({
                    nextStyle: mcStyle
                });
            }
            this.mousePoint = {
                x: posX,
                y: posY
            };
        }
    }
    handleOnContainerMouseUp(evt:IElmerMouseEvent): void {
        evt.nativeEvent.preventDefault();
        this.isMouseDown = false;
    }
    $onPropsChanged(newProps:TypeImageViewerProps): void {
        const updateState:TypeImageViewerState = {};
        if(newProps.visible !== this.state.visible) {
            updateState.visible = newProps.visible;
        }
        if(!this.isEqual(newProps.data, this.state.data)) {
            if(newProps.data) {
                if(newProps.data.length === 1) {
                    updateState.data = newProps.data;
                    updateState.data.push(newProps.data[0]);
                } else {
                    updateState.data = newProps.data;
                }
                updateState.currentData = newProps.data[0];
                updateState.nextData = newProps.data[1];
            } else {
                updateState.data = [];
            }
        }
        if(Object.keys(updateState).length>0) {
            this.setState(updateState);
        }
    }
    $after(): void {
        this.addEvent(this, this.dom[this.containerId], "dragstart", () => {
            return false;
        }, {
            passive: false
        });
        this.addEvent(this, document.body, "resize", () => {
            this.resetStyle();
        });
    }
    $didMount(): void {
        this.currentDom = this.dom[this.currentId];
        this.nextDom = this.dom[this.nextId];
        this.resetStyle();
    }
    $resize(): any {
        if(this.currentDom && this.nextDom) {
            return this.resetStyle;
        }
    }
    onGoPrev(): void {
        if(!this.isAnimationStart) {
            this.isGoNext = true;
            this.isAnimationStart = true;
            if(this.state.showCurrent) {
                this.setState({
                    currentClassName: "animationToLeftHide",
                    nextClassName: "animationToLeftShow",
                    showCurrent: false
                });
            } else {
                this.setState({
                    currentClassName: "animationToLeftShow",
                    nextClassName: "animationToLeftHide",
                    showCurrent: true
                });
            }
        }
    }
    onGoNext(): void {
        if(!this.isAnimationStart) {
            this.isGoNext = false;
            this.isAnimationStart = true;
            if(this.state.showCurrent) {
                this.setState({
                    currentClassName: "animationToRightHide",
                    nextClassName: "animationToRightShow",
                    showCurrent: false
                });
            } else {
                this.setState({
                    nextClassName: "animationToRightHide",
                    currentClassName: "animationToRightShow",
                    showCurrent: true
                });
            }
        }
    }
    onImageAnimationEnd(): void {
        this.isAnimationStart = false;
        if(this.state.data.length>2) {
            let nextData:TypeImageViewerData;
            let offsetIndex = 1;
            if(!this.state.showCurrent) {
                offsetIndex = this.state.nextIndex;
            } else {
                offsetIndex = this.state.index;
            }
            if(this.isGoNext) {
                if(offsetIndex + 1 < this.state.data.length) {
                    nextData = this.state.data[offsetIndex + 1];
                    offsetIndex = offsetIndex + 1;
                } else {
                    nextData = this.state.data[0];
                    offsetIndex = 0;
                }
            } else {
                if(offsetIndex - 1 >= 0) {
                    nextData = this.state.data[offsetIndex - 1];
                    offsetIndex -= 1;
                } else {
                    nextData = this.state.data[this.state.data.length - 1];
                    offsetIndex = this.state.data.length - 1;
                }
            }
            this.canChangeSize = true;
            this.zoomLevel = 0;
            if(this.state.showCurrent) {
                this.setState({
                    currentTitle: this.state.currentData.title,
                    nextData,
                    nextIndex: offsetIndex,
                    currentClassName: "",
                    nextClassName: "",
                    currentStyle: this.updateStyle(this.state.currentStyle, this.getDefaultStyle(true) + "opacity:1;"),
                    nextStyle: this.updateStyle(this.state.nextStyle, this.getDefaultStyle(false) + "opacity:0;")
                });
            } else {
                this.setState({
                    currentData: nextData,
                    currentTitle: this.state.nextData.title,
                    index: offsetIndex,
                    currentClassName: "",
                    nextClassName: "",
                    currentStyle: this.updateStyle(this.state.currentStyle, this.getDefaultStyle(false) + "opacity:0;"),
                    nextStyle: this.updateStyle(this.state.nextStyle, this.getDefaultStyle(true) + "opacity:1;")
                });
            }
        }
    }
    onloadImageComplete(): void {
        if(this.canChangeSize) {
            this.resetStyle();
            this.canChangeSize = false;
        }
    }
    onZoomIn(): void {
        this.zoomLevel += 1;
        const scaleValue = 1 + this.zoomLevel * 0.1;
        const zoomStyle = `transform: scale(${scaleValue},${scaleValue});-webkit-transform: scale(${scaleValue},${scaleValue});`;
        if(this.state.showCurrent) {
            const style = this.updateStyle(this.state.currentStyle, zoomStyle);
            this.setState({
                currentStyle: style
            });
        } else {
            const style = this.updateStyle(this.state.nextStyle, zoomStyle);
            this.setState({
                nextStyle: style
            });
        }
    }
    onZoomOut(): void {
        this.zoomLevel -= 1;
        let scaleValue = 1 + this.zoomLevel * 0.1;
        scaleValue = scaleValue > 0 ? scaleValue : 0.1;
        const zoomStyle = `transform: scale(${scaleValue},${scaleValue});-webkit-transform: scale(${scaleValue},${scaleValue});`;
        if(this.state.showCurrent) {
            const style = this.updateStyle(this.state.currentStyle, zoomStyle);
            this.setState({
                currentStyle: style
            });
        } else {
            const style = this.updateStyle(this.state.nextStyle, zoomStyle);
            this.setState({
                nextStyle: style
            });
        }
    }
    onReset(): void {
        this.resetStyle();
    }
    onRoutateLeft(): void {
        this.routateLevel -= 90;
        const rotateStyle = `transform: rotateZ(${this.routateLevel}deg);-webkit-transform: rotateZ(${this.routateLevel}deg);`;
        if(this.state.showCurrent) {
            const tStyle = this.updateStyle(this.state.currentStyle, rotateStyle);
            this.setState({
                currentStyle: this.updateStyle(this.state.currentStyle, rotateStyle)
            });
        } else {
            this.setState({
                nextStyle: this.updateStyle(this.state.nextStyle, rotateStyle)
            });
        }
    }
    onRoutateRight(): void {
        this.routateLevel += 90;
        const rotateStyle = `transform: rotateZ(${this.routateLevel}deg);-webkit-transform: rotateZ(${this.routateLevel}deg);`;
        if(this.state.showCurrent) {
            const tStyle = this.updateStyle(this.state.currentStyle, rotateStyle);
            this.setState({
                currentStyle: tStyle
            });
        } else {
            this.setState({
                nextStyle: this.updateStyle(this.state.nextStyle, rotateStyle)
            });
        }
    }
    onClose(): void {
        typeof this.props.onClose === "function" && this.props.onClose();
    }
    private sizeStyle(width: string, height: string, zIndex: number): string {
        let result = "";
        if(!this.isEmpty(width)) {
            if(this.isNumeric(width)) {
                result += `width:${width}px;`;
            } else {
                result += `width:${width};`;
            }
        }
        if(!this.isEmpty(height)) {
            if(this.isNumeric(height)) {
                result += `height:${height}px;`;
            } else {
                result += `height:${height};`;
            }
        }
        if(this.isNumeric(zIndex)) {
            result += `z-index: ${zIndex};`;
        }
        return result;
    }
    private resetStyle(): void {
        const marginLeft = -this.currentDom.clientWidth / 2;
        const marginTop = -this.currentDom.clientHeight / 2;
        const nextLeft = -this.nextDom.clientWidth / 2;
        const nextTop = -this.nextDom.clientHeight / 2;
        const currentStyle = `margin-left: ${marginLeft}px;margin-top:${marginTop}px;z-index: 1;` + (this.state.showCurrent ? this.getDefaultStyle(true) + "opacity:1;" : this.getDefaultStyle(false) + "opacity:0;");
        const nextStyle = `margin-left: ${nextLeft}px;margin-top:${nextTop}px;z-index: 0;` + (this.state.showCurrent ? this.getDefaultStyle(false) + "opacity:0;" : this.getDefaultStyle(true) + "opacity:1");
        this.setState({
            currentStyle,
            nextStyle
        });
    }
    private updateStyle(styleValue: string, newStyle: string): string {
        const obj = this.convertStyleToObj(styleValue);
        const newObj = this.convertStyleToObj(newStyle);
        let result = "";
        // tslint:disable-next-line: forin
        for(const key in newObj) {
            if(["transform", "-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform"].indexOf(key)<0) {
                // result += `${key}:${updateObj[key]};`;
                obj[key] = newObj[key];
            } else {
                if(!this.isEmpty(newObj[key])) {
                    if(this.isEmpty(obj[key])) {
                        obj[key] = newObj[key];
                    } else {
                        obj[key] = this.updateTransformStyle(obj[key], newObj[key], false);
                    }
                }
            }
        }
        // tslint:disable-next-line: forin
        for(const strKey in obj) {
            result += `${strKey}:${obj[strKey]};`;
        }
        return result;
    }
    private updateTransformStyle(oldValueStr: string, newValueStr: string, isRemove?: boolean): string {
        const attrValReg = /\s*([a-z0-9]*\([a-z0-9\-,\s\.]*\))/ig;
        const oldValueArr = oldValueStr.match(attrValReg);
        const newValueArr = newValueStr.match(attrValReg);
        if(oldValueArr && newValueArr) {
            for(let i=0;i<newValueArr.length;i++) {
                const newValue = newValueArr[i].replace(/^\s*/, "").replace(/\s*$/, "");
                const newKey = newValue.substr(0, newValue.indexOf("("));
                let isFindOldKey = false;
                for(let j=0;j<oldValueArr.length;j++) {
                    const oldValue = oldValueArr[j].replace(/^\s*/, "").replace(/\s*$/, "");
                    const oldKey = oldValue.substr(0, oldValue.indexOf("("));
                    if(newKey === oldKey) {
                        isFindOldKey = true;
                        if(!isRemove) {
                            oldValueArr[j] =  newValue;
                        } else {
                            delete oldValueArr[j];
                        }
                        break;
                    }
                }
                if(!isFindOldKey) {
                    if(!isRemove) {
                        oldValueArr.push(newValue);
                    }
                }
            }
            return oldValueArr.join(" ");
        } else if(!oldValueArr && newValueArr) {
            return newValueArr.join(" ");
        } else if(oldValueArr && !newValueArr) {
            return oldValueArr.join(" ");
        } else {
            return "";
        }
    }
    private convertStyleToObj(str: string): any {
        if(!this.isEmpty(str)) {
            const strArr = str.split(";");
            const strResult = {};
            for(const strItem of strArr) {
                const lMatch = strItem.match(/^\s*([a-z0-9\-]*)\s*\:/i);
                if(lMatch) {
                    const key = lMatch[1];
                    const value = strItem.replace(/^\s*([a-z0-9\-]*)\s*\:/i, "").replace(/^\s*/,"").replace(/\s*$/,"");
                    strResult[key] = value;
                }
            }
            return strResult;
        } else {
            return {};
        }
    }
    private getDefaultStyle(show: boolean): string {
        let initValue = "scale(1,1) rotateZ(0deg)";
        if(show) {
            initValue += " translate3d(0,0,0)";
        } else {
            initValue += " translate3d(100%,0,0)";
        }
        return `transform: ${initValue};-webkit-transform: ${initValue};`;
    }
}
