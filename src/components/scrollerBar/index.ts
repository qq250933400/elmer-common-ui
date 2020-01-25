import { autowired, Component, declareComponent, ElmerDOM, IElmerEvent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import "./index.less";

type TypeScrollBarProps = {
    theme:IPropCheckRule;
    onChange:IPropCheckRule;
    style: IPropCheckRule;
    scrollSize: IPropCheckRule;
    scrollViewSize: IPropCheckRule;
    type: IPropCheckRule;
    top: IPropCheckRule;
    left: IPropCheckRule;
};
type TypeScrollBarStateKeys = Exclude<keyof TypeScrollBarProps, "onChange" | "type">;
type TypeScrollBarState = {
    [P in TypeScrollBarStateKeys]: any;
} & {
    type: "scrollX" | "scrollY";
    thumbId?: string;
    thumbTrackId?: string;
    thumbSize?: number;
};

@declareComponent({
    selector: "scrollbar",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export class ScrollBarComponent extends Component {
    static propType: TypeScrollBarProps = {
        theme: {
            defaultValue: "",
            description: "样式",
            rule: PropTypes.string
        },
        style: {
            defaultValue: "",
            description: "内联样式",
            rule: PropTypes.string
        },
        scrollSize: {
            description: "滚动内容高度",
            rule: PropTypes.number.isRequired
        },
        scrollViewSize: {
            description: "滚动条显示区域",
            rule: PropTypes.number.isRequired
        },
        type: {
            defaultValue: "scrollY",
            description: "滚动条类型",
            rule: PropTypes.oneValueOf(["scrollX", "scrollY"]).isRequired
        },
        onChange: {
            description: "滚动事件",
            rule: PropTypes.func
        },
        top: {
            defaultValue: 0,
            description: "垂直滚动条位置",
            rule: PropTypes.number
        },
        left: {
            defaultValue: 0,
            description: "水平滚动条位置",
            rule: PropTypes.number
        }
    };
    state: TypeScrollBarState = {
        theme: "",
        style: "position:absolute;right:0;top:0;",
        scrollSize: 0,
        scrollViewSize: 0,
        type: "scrollY",
        top: 0,
        left: 0,
        thumbSize: 0
    };
    private isPressed: boolean = false;
    private mouseX: number = 0;
    private mouseY: number = 0;
    private thumbLeft: number = 0;
    private thumbTop: number = 0;
    private isUpdateScrollSize: boolean = false;
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:{[P in keyof TypeScrollBarProps]: any}) {
        super(props);
        this.state.theme = props.theme || "";
        this.state.style = props.style || "position:absolute;right:0;top:0;";
        this.state.scrollSize = props.scrollSize || 0;
        this.state.scrollViewSize = props.scrollViewSize || 0;
        this.state.type = props.type || "scrollY";
        this.state.thumbId = this.getRandomID();
        this.state.thumbTrackId = this.getRandomID();
    }
    handleOnThumbPress(evt:IElmerEvent): void {
        const posX: number = (<any>evt.nativeEvent).touches ? (<TouchEvent>evt.nativeEvent).touches[0].clientX : (<MouseEvent>evt.nativeEvent).clientX;
        const posY: number = (<any>evt.nativeEvent).touches ? (<TouchEvent>evt.nativeEvent).touches[0].clientY : (<MouseEvent>evt.nativeEvent).clientY;
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.isPressed = true;
        this.mouseX = posX;
        this.mouseY = posY;
    }
    handleOnThumbTrackUp(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.isPressed = false;
    }
    handleOnThumbTrackMove(evt: IElmerEvent): void {
        const posX: number = (<any>evt.nativeEvent).touches ? (<TouchEvent>evt.nativeEvent).touches[0].clientX : (<MouseEvent>evt.nativeEvent).clientX;
        const posY: number = (<any>evt.nativeEvent).touches ? (<TouchEvent>evt.nativeEvent).touches[0].clientY : (<MouseEvent>evt.nativeEvent).clientY;
        let trackDom:HTMLDivElement = this.dom[this.state.thumbTrackId];
        let thumbDom:HTMLDivElement = this.dom[this.state.thumbId];
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        if(trackDom && thumbDom && this.isPressed) {
            if(this.state.type === "scrollY") {
                let offsetTop = posY - this.mouseY + this.thumbTop;
                let offsetHeight = trackDom.clientHeight - this.state.thumbSize;
                if(offsetTop >= 0 && offsetTop <= offsetHeight) {
                    this.$.css(thumbDom, {
                        top: offsetTop,
                        height: this.state.thumbSize
                    });
                    this.thumbTop = offsetTop;
                }
                offsetTop = null;
                offsetHeight = null;
            } else {
                let offsetLeft = posX - this.mouseX + this.thumbLeft;
                let offsetWidth = trackDom.clientWidth - this.state.thumbSize;
                if(offsetLeft >= 0 && offsetLeft <= offsetWidth) {
                    this.$.css(thumbDom, {
                        left: offsetLeft,
                        width: this.state.thumbSize
                    });
                    this.thumbLeft = offsetLeft;
                }
                offsetLeft = null;
                offsetWidth = null;
            }
            this.mouseX = posX;
            this.mouseY = posY;
        }
        thumbDom = null;
        trackDom = null;
    }
    $after(): void {
        this.addEvent(this, document.body, "mousemove", this.handleOnThumbTrackMove);
        this.addEvent(this, document.body, "touchmove", this.handleOnThumbTrackMove);
        this.addEvent(this, document.body, "mouseup", this.handleOnThumbTrackUp);
        this.addEvent(this, document.body, "touchend", this.handleOnThumbTrackUp);
        if(!this.isUpdateScrollSize) {
            this.isUpdateScrollSize = true;
            this.updateScrollSize();
        }
    }
    private updateScrollSize(): void {
        let trackDom:HTMLDivElement = this.dom[this.state.thumbTrackId];
        let thumbDom:HTMLDivElement = this.dom[this.state.thumbId];
        if(trackDom && thumbDom) {
            let bHeight = trackDom.clientHeight;
            let bWidth = trackDom.clientWidth;
            let scrollSize = this.isNumeric(this.state.scrollSize) ? (this.isString(this.state.scrollSize) ? parseInt(this.state.scrollSize, 10) : this.state.scrollSize) : 0;
            let scrollViewSize = this.isNumeric(this.state.scrollViewSize) ? (this.isString(this.state.scrollViewSize) ? parseInt(this.state.scrollViewSize, 10) : this.state.scrollViewSize) : 0;
            if(this.state.type === "scrollY") {
                if(scrollSize > scrollViewSize && scrollViewSize > 0) {
                    this.state.thumbSize = this.calcThumbSize(bHeight);
                    this.$.css(thumbDom, {
                        top: this.state.top,
                        height: this.state.thumbSize
                    });
                } else {
                    this.$.css(thumbDom, {
                        top: 0,
                        height: "100%"
                    });
                }
            } else {
                if(scrollSize > scrollViewSize && scrollViewSize > 0) {
                    this.state.thumbSize = this.calcThumbSize(bWidth);
                    this.$.css(thumbDom, {
                        left: this.state.left,
                        width: this.state.thumbSize
                    });
                } else {
                    this.$.css(thumbDom, {
                        left: 0,
                        width: "100%"
                    });
                }
            }
            bHeight = null;
            bWidth = null;
            scrollSize = null;
            scrollViewSize = null;
        }
        trackDom = null;
        thumbDom = null;
    }
    private calcThumbSize(thumbSize: number): number {
        const scrollSize = this.isNumeric(this.state.scrollSize) ? (this.isString(this.state.scrollSize) ? parseInt(this.state.scrollSize, 10) : this.state.scrollSize) : 0;
        const scrollViewSize = this.isNumeric(this.state.scrollViewSize) ? (this.isString(this.state.scrollViewSize) ? parseInt(this.state.scrollViewSize, 10) : this.state.scrollViewSize) : 0;
        const scrollEffect = scrollSize - scrollViewSize;
        const np = Math.exp(1 - thumbSize / scrollEffect) / 2;
        return np * thumbSize;

    }
}
