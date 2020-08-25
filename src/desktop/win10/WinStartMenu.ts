import { autowired, Component,declareComponent, ElmerDOM, ElmerUI as UI, IElmerEvent, IPropCheckRule, propTypes  } from "elmer-ui-core";
import { DesktopApp, TypeStartMenu, winStartmenuSideButtons } from "../DesktopApp";

type TypeWinStartmenuProps = {
    data: any;
    onClick: Function;
    onOutClick: Function;
    theme: string;
    menuList: any[];
    quickStartList: any[];
    visible: boolean;
    showAnimation: boolean;
};
type TypeWinStartmenuPropsRule = {[P in keyof TypeWinStartmenuProps]?: IPropCheckRule};
type TypeWinStartmenuState = {
    data: DesktopApp[],
    leftSideData: DesktopApp[],
    menuList: TypeStartMenu[],
    activeGroupId: string|number;
    visible: boolean;
    showAnimation: string;
    theme: string;
    quickStartList: any;
};

@declareComponent({
    selector: "win10-startmenu"
})
export class WinStartmenuComponent extends Component<TypeWinStartmenuProps> {
    static propType: TypeWinStartmenuPropsRule = {
        data: {
            defaultValue: [],
            description: "All menu data",
            rule: propTypes.array.isRequired
        },
        onClick: {
            description: "Menu item click event",
            rule: propTypes.func
        },
        onOutClick: {
            description: "click not in menu area",
            rule: propTypes.func
        },
        theme: {
            defaultValue: "",
            description: "User define theme",
            rule: propTypes.string.isRequired
        },
        menuList: {
            defaultValue: [],
            description: "All application list",
            rule: propTypes.array.isRequired
        },
        visible: {
            defaultValue: false,
            description: "Show hiden menu",
            rule: propTypes.bool.isRequired
        },
        showAnimation: {
            defaultValue: "",
            description: "set animation to menu when it's visible equal true",
            rule: propTypes.string.isRequired
        },
        quickStartList: {
            defaultValue: [],
            description: "Quick start menu list",
            rule: propTypes.array.isRequired
        }
    };
    state: TypeWinStartmenuState = {
        data: [],
        leftSideData: winStartmenuSideButtons,
        menuList: [],
        quickStartList: [],
        activeGroupId: "",
        visible: false,
        showAnimation: "",
        theme: ""
    };
    constructor(props:{[P in keyof TypeWinStartmenuProps]: any}) {
        super(props);
        this.state.theme = !this.isEmpty(props.theme) ? props.theme : "";
        this.state.showAnimation = props.visible ? props.showAnimation : "";
        this.state.quickStartList = props.quickStartList;
        this.state.menuList = props.menuList || [];
    }
    $onPropsChanged(props:{[P in keyof TypeWinStartmenuProps]: any}): void {
        if(props.visible !== this.state.visible) {
            this.setState({
                visible: props.visible,
                showAnimation: props.visible ? props.showAnimation : ""
            });
        }
    }
    $after(): void {
        this.addEvent(this, document.body, "click",this.handleOnBodyClick);
    }
    handleOnMenuGroupClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        if(evt.dataSet.id !== this.state.activeGroupId) {
            this.setState({
                activeGroupId: evt.dataSet.id
            });
        } else {
            if(!this.isEmpty(this.state.activeGroupId)) {
                this.setState({
                    activeGroupId: ""
                });
            }
        }
    }
    handleOnMenuItemClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            visible: false,
            showAnimation: ""
        });
        typeof this.props.onClick === "function" && this.props.onClick(evt.data.subItem);
    }
    handleOnLeftSideClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            visible: false,
            showAnimation: ""
        });
        typeof this.props.onClick === "function" && this.props.onClick(evt.data.item);
    }
    handleOnMenuClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
    }
    handleOnBodyClick(): void {
        typeof this.props.onOutClick === "function" && this.props.onOutClick();
    }
    render(): any {
        return require("./views/startMenu.html");
    }
}
