import { autowired,Component, declareComponent,ElmerDOM, IElmerEvent, IElmerMouseEvent } from "elmer-ui-core";
import StatusBar from "./statusBar";
import { createOfficeFormTabMenu, definePropType, TypeOfficeFormProps, TypeOfficeFormState, createOfficeQuickButtons } from "./TypeFormAttr";
// tslint:disable-next-line: ordered-imports
import "./index.less";

type TypeMousePoint = {
    x?: number;
    y?: number;
};

@declareComponent({
    selector: "OfficeForm",
    components: [{
        selector: "StatusBar",
        component: StatusBar
    }]
})
export default class Form extends Component {
    static propType:any = definePropType;
    state: TypeOfficeFormState = {
        tabMenu: [],
        choseTabMenu: {},
        choseTabIndex: 0
    };
    tabMenuId: string;
    isTabMenuPress?: boolean;
    mousePoint: TypeMousePoint;
    tabMenuParent:HTMLUListElement;
    tabScrollLeft: number = 0;
    tabScrollWidth: number = 0;

    props: TypeOfficeFormProps;

    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:TypeOfficeFormProps) {
        super(props);
        this.tabMenuId = this.guid();
        this.state.tabMenu = props.tabMenu;
        this.state.quickApps = props.quickApps;
        this.state.choseTabMenu = this.state.tabMenu[0];
    }
    handleOnMenuButtonMouseDown(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
    }
    handleOnQuickAppClick(evt:IElmerEvent): void {
        typeof this.props.onClick === "function" && this.props.onClick({
            type: "QuickAppButton",
            data: evt.data.app,
            event:evt
        });
    }
    handleOnHeaderButtonClick(evt:IElmerMouseEvent): void {
        typeof this.props.onClick === "function" && this.props.onClick({
            type: evt.dataSet.type,
            event:evt
        });
    }
    handleOnStartClick(evt:IElmerMouseEvent): void {
        typeof this.props.onClick === "function" && this.props.onClick({
            type: "StartButton",
            event:evt
        });
    }
    handleOnTabMenuButtonClick(evt:IElmerEvent): void {
        typeof this.props.onClick === "function" && this.props.onClick({
            type: "MenuButton",
            data: evt.data.buttonItem,
            event:evt
        });
    }
    handleOnTabMenuMouseDown(evt:IElmerMouseEvent): void {
        if(this.tabMenuParent.scrollWidth > this.tabMenuParent.clientWidth || this.tabScrollLeft < 0) {
            this.isTabMenuPress = true;
            this.tabScrollWidth = this.tabMenuParent.scrollWidth;
            this.mousePoint = {
                x: evt.nativeEvent.clientX,
                y: evt.nativeEvent.clientY
            };
        } else {
            if(this.tabMenuParent.firstChild) {
                this.$.css(<any>this.tabMenuParent.firstChild, "margin-left", "0px");
            }
        }
    }
    handleOnTabMenuMouseMove(evt:IElmerMouseEvent): void {
        if(this.isTabMenuPress) {
            const posX = evt.nativeEvent.clientX;
            const offsetX = posX - this.mousePoint.x + this.tabScrollLeft;
            const clientWidth = this.tabMenuParent.clientWidth;
            if(offsetX<=0 && (this.tabScrollWidth + offsetX >= clientWidth || this.tabScrollLeft<offsetX)) {
                this.$.css(<any>this.tabMenuParent.firstChild, "margin-left", offsetX + "px");
                this.tabScrollLeft = offsetX;
            }
            this.mousePoint.x = posX;
        }
    }
    handleOnBodyMouseUp(): void {
        this.isTabMenuPress = false;
    }
    handleOnTabClick(evt:IElmerEvent​​): void {
        if(evt.data.index !== this.state.choseTabIndex) {
            this.tabScrollLeft = 0;
            this.setState({
                choseTabIndex: evt.data.index,
                choseTabMenu: evt.data.tabItem
            });
            if(this.tabMenuParent.firstChild) {
                this.$.css(<any>this.tabMenuParent.firstChild, "margin-left", "0px");
            }
        }
    }
    $didMount(): void {
        this.addEvent(this, document.body, "selectstart",(evt:IElmerEvent): boolean => {
            evt.nativeEvent.preventDefault();
            return false;
        });
        this.addEvent(this, document.body, "contextmenu", (evt:IElmerEvent): boolean => {
            evt.nativeEvent.preventDefault();
            return false;
        });
        this.tabMenuParent = this.dom[this.tabMenuId];
    }
    render():any {
        return require("./index.html");
    }
}
