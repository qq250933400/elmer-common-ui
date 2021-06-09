import { autowired,Component, declareComponent, ElmerDOM, IElmerEvent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./index.less";

type MobileSelectProps = {
    cancelText: string;
    data: any[];
    defaultValue: any[];
    okText: string;
    onCancel: Function;
    onChange: Function;
    onClose: Function;
    onOk: Function;
    placeHolder: any;
    title: string;
    visible: boolean;
    zIndex: number;
    showSearch: boolean;
    searchPlaceHolder: string;
};
type MobileSelectPropsRule = {[P in keyof MobileSelectProps]:IPropCheckRule};
type TypeMouseEventObj = {
    x?: number;
    y?: number;
    obj?: HTMLElement;
    index?: number;
};

@declareComponent({
    selector: "MobileSelect"
})
export class MobileSelector extends Component<MobileSelectProps> {
    static propType:MobileSelectPropsRule ={
        cancelText: <IPropCheckRule>{
            defaultValue: "取消",
            description: "取消按钮文本",
            rule: propTypes.string.isRequired
        },
        data: <IPropCheckRule>{
            defaultValue: [],
            description: "数据源",
            rule: propTypes.array.isRequired
        },
        defaultValue: <IPropCheckRule>{
            defaultValue: [0],
            description: "默认选择的值",
            rule: propTypes.array
        },
        okText: <IPropCheckRule>{
            defaultValue: "确定",
            description: "确定按钮文本",
            rule: propTypes.string.isRequired
        },
        onCancel: <IPropCheckRule>{
            description: "取消事件",
            rule: propTypes.func
        },
        onChange: <IPropCheckRule> {
            description: "选择变化触发事件",
            rule: propTypes.func
        },
        onClose: <IPropCheckRule>{
            description: "关闭事件",
            rule: propTypes.func
        },
        onOk: <IPropCheckRule>{
            description: "确定事件",
            rule: propTypes.func
        },
        // tslint:disable-next-line:no-object-literal-type-assertion
        placeHolder: <IPropCheckRule>{
            defaultValue: "请选择",
            description: "没有值时的选择",
            rule: propTypes.oneOf([propTypes.string, propTypes.array])
        },
        title: <IPropCheckRule>{
            defaultValue: "请选择",
            description: "标题",
            rule: propTypes.string.isRequired
        },
        visible: <IPropCheckRule>{
            defaultValue: false,
            description: "是否显示",
            rule: propTypes.bool.isRequired
        },
        // tslint:disable-next-line:no-object-literal-type-assertion
        zIndex: (<IPropCheckRule>{
            defaultValue: 1000,
            description: "显示位置",
            rule: propTypes.number
        }),
        showSearch:<IPropCheckRule>{
            defaultValue: false,
            description: "显示搜索框",
            rule: propTypes.bool.isRequired
        },
        searchPlaceHolder: <IPropCheckRule>{
            defaultValue: "请输入搜索内容",
            description: "输入框placeholder",
            rule: propTypes.string.isRequired
        }
    };
    searchPlaceHolder: string;
    title: string;
    cancelText: string = "取消";
    okText: string = "确定";
    private visible: boolean = false;
    private isFirstRender: boolean = false;
    private domID: string = this.getRandomID();
    private contentID: string = this.getRandomID();
    private listID: string = this.getRandomID();
    private focustID: string = this.getRandomID();
    private maskShowAnimation: string = "euiMobileSelectMaskShowAni";
    private contentShowAnimation: string = "euiMobileSelectShowAni";
    private maskHiddenAnimation: string = "euiMobileSelectMaskHiddenAni";
    private contentHiddenAnimation: string = "euiMobileSelectHiddenAni";
    private onClose:Function;
    private data: any[] = [];
    private sourceData: any[] = [];
    private contentHeight: number = 0;
    private itemHeight: number = 0;
    private selectedIndexs: number[] = [];
    private displayIndexs: number[] = [];
    private isPressed: boolean = false;
    private listWidth: string = "100%";
    private showSearch: boolean = true;
    private mouseEventObj: TypeMouseEventObj;
    private mouseEventElement:HTMLElement;
    private onChangeData: any = {};
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props: any) {
        super(props);
        this.cancelText = props.cancelText;
        this.visible = props.visible;
        this.onClose = props.onClose;
        this.data = props.data || [];
        this.okText = props.okText;
        this.showSearch = props.showSearch;
        this.searchPlaceHolder = props.searchPlaceHolder;
        this.selectedIndexs = props.defaultValue || [0];
        this.displayIndexs = props.defaultValue || [0];
        this.listWidth = (this.data.length>0 ? (1/this.data.length*100) : 100) + "%";
        this.sourceData = this.data;
        this.title = props.title || "";
    }
    $willReceiveProps(newProps: any): void {
        if(newProps.visible !== this.visible) {
            this.visible = newProps.visible;
            this.setVisible();
        }
        if (JSON.stringify(newProps.data) !== JSON.stringify(this.sourceData)) {
            const newData =  newProps.data || [];
            const selectedIndexData = [];
            for(let i=0;i<newData.length;i++) {
                if(JSON.stringify(newData[i]) !== JSON.stringify(this.sourceData[i])) {
                    selectedIndexData[i] = 0;
                } else {
                    selectedIndexData[i] = this.displayIndexs[i] || 0;
                }
            }
            this.displayIndexs = selectedIndexData;
            this.sourceData = newData;
            this.setData({
                data: newData
            });
        }
    }
    $didUpdate():void {
        if(!this.isFirstRender) {
            if(this.visible) {
                this.setVisible();
            }
        }
    }
    $didMount(): void {
        this.$.on(document.body, "mousedown", this.handleOnBodyMouseDown.bind(this));
        this.$.on(document.body, "touchstart", this.handleOnBodyTouchStart.bind(this));
        this.$.on(document.body, "mouseup", this.handleOnBodyMouseUp.bind(this));
        this.$.on(document.body, "touchend", this.handleOnBodyTouchEnd.bind(this));
        this.$.on(document.body, "mousemove", this.handleOnBodyMouseMove.bind(this));
        this.$.on(document.body, "touchmove", this.handleOnBodyTouchMove.bind(this));
    }
    $dispose(): void {
        this.$.removeEvent(document.body, "mousedown", this.handleOnBodyMouseDown.bind(this));
        this.$.removeEvent(document.body, "touchstart", this.handleOnBodyTouchStart.bind(this));
        this.$.removeEvent(document.body, "mouseup", this.handleOnBodyMouseUp.bind(this));
        this.$.removeEvent(document.body, "touchend", this.handleOnBodyTouchEnd.bind(this));
        this.$.removeEvent(document.body, "mousemove", this.handleOnBodyMouseMove.bind(this));
        this.$.removeEvent(document.body, "touchmove", this.handleOnBodyTouchMove.bind(this));
    }
    render(): string {
        return require("./index.html");
    }
    handleOnListMouseDown(evt:IElmerEvent): void {
        this.isPressed = true;
        this.mouseEventElement = evt.target;
    }
    handleOnSearchTouch(event:IElmerEvent): void {
        (<HTMLElement>event.target.firstChild).focus();
    }
    handleOnSearchClick(event:Event): void {
        (<any>event.target).focus();
    }
    handleSearch(event:IElmerEvent): void {
        let sourceData = JSON.parse(JSON.stringify(this.sourceData[0] || []));
        let searchValue = (<any>event.target).value || "";
        let result = [];
        if (!this.isEmpty(searchValue)) {
            // tslint:disable-next-line:forin
            for (const key in sourceData) {
                const tmpData = sourceData[key];
                if ((tmpData.title || "").indexOf(searchValue) >= 0) {
                    result.push(tmpData);
                }
            }
            if (result.length <= 0) {
                const placeHolder = this.props.placeHolder;
                const placeHolderText = this.isArray(placeHolder) ? placeHolder[0] : placeHolder;
                result.push({
                    title: placeHolderText,
                    value: -1
                });
            }
            this.setData({
                data: [result],
                displayIndexs: [0],
                selectedIndexs: [0]
            });
        } else {
            this.setData({
                data: [sourceData],
                displayIndexs: [0],
                selectedIndexs: [0]
            });
        }
        result = null;
        searchValue = null;
        sourceData = null;
    }
    handleOnSearchKeyPress(event:IElmerEvent): void {
        if((<KeyboardEvent>event.nativeEvent).keyCode === 13 && this.showSearch) {
            this.handleSearch(event);
        }
    }
    handleOnCancelClick(): void {
        this.visible = false;
        this.setVisible();
        typeof this.props.onCancel === "function" && this.props.onCancel();
    }
    handleOnOkClick(): void {
        this.visible = false;
        this.selectedIndexs = this.displayIndexs || [];
        this.setVisible();
        const checkedData = [];
        for(let i=0;i<this.displayIndexs.length;i++) {
            if(this.data[i]) {
                checkedData.push(this.data[i][this.displayIndexs[i]]);
            }
        }
        typeof this.props.onOk === "function" && this.props.onOk({
            selectedIndex: this.displayIndexs,
            selectedItems: checkedData
        });
    }
    handleOnMaskClick(): void {
        this.visible = false;
        this.setVisible();
    }
    handleOnContentClick(event:IElmerEvent): void {
        (<MouseEvent>event.nativeEvent).cancelBubble = true;
        (<MouseEvent>event.nativeEvent).stopPropagation();
        (<MouseEvent>event.nativeEvent).stopImmediatePropagation();
    }
    handleOnMaskAnimationEnd(event:AnimationEvent): void {
        let dom = this.dom[this.domID];
        if(!this.visible && event.target === dom) {
            this.$.attr(dom,"style", `display:none;z-index:${this.props.zIndex};`);
            this.isFunction(this.onClose) && this.onClose();
        }
        dom = null;
    }
    handleOnBodyMouseDown(event:MouseEvent): void {
        this.mouseEventElement && this.visible && this.handleOnPressEvent(event.clientX, event.clientY, this.mouseEventElement);
    }
    handleOnBodyTouchStart(event:TouchEvent): void {
        this.mouseEventElement && this.visible && this.handleOnPressEvent(event.touches[0].clientX, event.touches[0].clientY, this.mouseEventElement);
    }
    handleOnBodyMouseMove(event:MouseEvent): void {
        this.mouseEventElement && this.visible && this.handleOnMoveEvent(event.clientX, event.clientY, this.mouseEventElement);
    }
    handleOnBodyTouchMove(event:TouchEvent): void {
        this.mouseEventElement && this.visible && this.handleOnMoveEvent(event.touches[0].clientX, event.touches[0].clientY, this.mouseEventElement);
    }
    handleOnBodyMouseUp(event:MouseEvent,{}:any,target:any): void {
        this.mouseEventElement && this.visible &&  this.handleOnMoveEndEvent(target);
    }
    handleOnBodyTouchEnd(event:IElmerEvent): void {
        this.mouseEventElement && this.visible && this.handleOnMoveEndEvent(event.target);
    }
    private handleOnMoveEndEvent(target:HTMLElement): void {
        this.isPressed = false;
        if(this.mouseEventObj.obj) {
            let offsetY = this.$.attr(this.mouseEventObj.obj, "offsety");
            let offsetTop = (this.contentHeight - this.itemHeight) / 2;
            let scrollHeight = this.mouseEventObj.obj.clientHeight;
            let key = this.$.attr(this.mouseEventObj.obj, "data-key");
            offsetY = !isNaN(offsetY) ? parseFloat(offsetY) : 0;
            key = !isNaN(key) ? parseInt(key, 10) : 0;
            if(offsetY>offsetTop) {
                // 当拖动距离小于第一项顶端，反弹到第一项
                this.scrollTo(this.mouseEventObj.obj, offsetTop);
                this.displayIndexs[key] = 0;
            } else if(Math.abs(offsetY-offsetTop)>=scrollHeight) {
                // 当拖动到 最底部设置显示最后一项
                this.scrollTo(this.mouseEventObj.obj, offsetTop-(scrollHeight-this.itemHeight));
                this.displayIndexs[key] = this.mouseEventObj.obj.children.length - 1;
            } else {
                // 在显示区域计算滚动到哪一项目
                let offsetLen = parseInt(((offsetY-offsetTop)/this.itemHeight).toString(),10);
                offsetLen = Math.abs(offsetLen);
                if(offsetLen*this.itemHeight>Math.abs(offsetY-offsetTop)) {
                    offsetLen = offsetLen-1>=0 ? offsetLen-1 : 0;
                } else {
                    offsetLen = offsetLen + 1 < this.mouseEventObj.obj.children.length ? offsetLen+1 : this.mouseEventObj.obj.children.length -1;
                }
                // 滚动到指定项目
                this.scrollTo(this.mouseEventObj.obj, offsetTop - offsetLen*this.itemHeight);
                this.displayIndexs[key] = offsetLen;
            }
            const checkedData = [];
            for(let i=0;i<this.displayIndexs.length;i++) {
                if(this.data[i]) {
                    checkedData.push(this.data[i][this.displayIndexs[i]]);
                }
            }
            this.onChangeData = {
                selectedIndex: this.displayIndexs,
                selectedItems: checkedData
            };
            typeof this.props.onChange === "function" && this.props.onChange(this.onChangeData);
            offsetTop = null;
            scrollHeight = null;
        }
    }
    private handleOnMoveEvent(x:number,y:number, target:HTMLElement): void {
         if(this.isPressed) {
            let mouseY = this.mouseEventObj.y;
            let offsetY = this.$.attr(this.mouseEventObj.obj, "offsety");
            offsetY = !isNaN(offsetY) ? parseFloat(offsetY) : 0;
            let lastY = offsetY + (y-mouseY);
            this.scrollTo(this.mouseEventObj.obj, lastY);
            this.mouseEventObj.x = x;
            this.mouseEventObj.y = y;
            lastY = null;
            mouseY = null;
            offsetY = null;
         }
    }
    private handleOnPressEvent(x:number,y:number, target:HTMLElement): void {
        const cLen = target.children.length;
        if(cLen > 0) {
            const itemWidth = Math.ceil(target.clientWidth / cLen);
            let itemIndex = 0;
            for(let i=0;i<cLen;i++) {
                if(i*itemWidth <= x && x < (i+1)*itemWidth) {
                    itemIndex = i;
                    break;
                }
            }
            this.isPressed = true;
            this.mouseEventObj = {
                x,
                y,
                obj: target.children[itemIndex] as any,
                index: itemIndex
            };
        }
    }
    private scrollTo(dom:HTMLElement, offsetY: number): void {
        let oldOffsetY = this.$.attr(dom, "offsety");
        let offsetCode = this.$.getCss3("transform", `translate3d(0,${offsetY}px,0)`);
        offsetCode += "width:" + this.listWidth + ";";
        oldOffsetY = this.isNumeric(oldOffsetY) && /^[0-9]*$/.test(oldOffsetY) ? parseInt(oldOffsetY, 10) : 0;
        this.$.attr(dom, "style", offsetCode);
        this.$.attr(dom, "offsety", offsetY);
        offsetCode = null;
    }
    private setVisible(): void {
        let dom = this.dom[this.domID];
        let content = this.dom[this.contentID];
        let listDom:HTMLElement = this.dom[this.listID];
        let focustDom:HTMLElement = this.dom[this.focustID];
        let $ = this.$;
        if(dom && content) {
            if(this.visible) {
                $.attr(dom,"style",`display:block;z-index:${this.props.zIndex};`);
                $.addClass(dom, this.maskShowAnimation);
                $.addClass(content, this.contentShowAnimation);
                $.removeClass(dom, this.maskHiddenAnimation);
                $.removeClass(content, this.contentHiddenAnimation);
                if(listDom) {
                    const itemHeight = focustDom.offsetHeight;
                    const offsetTop = (listDom.clientHeight - itemHeight) / 2;
                    const itemLen = this.sourceData.length>0 ? this.sourceData.length : 1;
                    this.contentHeight = listDom.clientHeight;
                    this.itemHeight = itemHeight;
                    let index = 0;
                    this.listWidth = parseInt((1/itemLen*100).toString(),10)+"%";
                    for(let i=0;i<listDom.children.length;i++) {
                        const tmpUl = listDom.children[i];
                        if(tmpUl.tagName === "UL") {
                            const selectedIndex = this.displayIndexs[index] || 0;
                            this.scrollTo(<HTMLElement>tmpUl, offsetTop - itemHeight*selectedIndex);
                            this.$.css(<HTMLElement>tmpUl, {
                                width: this.listWidth
                            });
                            index += 1;
                        }
                    }
                }
            } else {
                $.addClass(dom, this.maskHiddenAnimation);
                $.addClass(content, this.contentHiddenAnimation);
                $.removeClass(dom, this.maskShowAnimation);
                $.removeClass(content, this.contentShowAnimation);
            }
        }
        $ = null;
        dom = null;
        content = null;
        listDom = null;
        focustDom = null;
    }
}
