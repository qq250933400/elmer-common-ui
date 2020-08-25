import { Component, declareComponent, IElmerEvent, IPropCheckRule, propTypes} from "elmer-ui-core";

type ToolBarButton = {
    title: string;
    icon: string;
    id: string;
};
type ToolBarState = {
    tabs?: ToolBarButton[];
    activeId?: string;
};

type ToolBarProps = {
    activeId: string;
    data: any;
    onClick: Function;
};
type ToolBarPropsRule = {[P in keyof ToolBarProps]?: IPropCheckRule};

@declareComponent({
    selector: "win10-toolbar"
})
export class Win10ToolBarComponent extends Component<ToolBarProps, ToolBarState> {
    static propType:ToolBarPropsRule = {
        activeId: {
            description: "Current App ID",
            rule: <any>propTypes.string
        },
        data: {
            defaultValue: [],
            description: "Source data",
            rule: <any>propTypes.array.isRequired
        },
        onClick: {
            description: "Click Event",
            rule: propTypes.func
        }
    };
    state:ToolBarState = {
        tabs: [],
        activeId: ""
    };
    constructor(props:ToolBarProps) {
        super(props);
        if(this.isArray(props.data) && props.data.length>0) {
            this.state.tabs = props.data;
        }
        if(this.isString(props.activeId)) {
            this.state.activeId = props.activeId;
        }
    }
    $onPropsChanged(props:any): void {
        if(JSON.stringify(props.data) !== JSON.stringify(this.state.tabs)) {
            this.setState({
                tabs: props.data,
                activeId: props.activeId
            });
        } else {
            if(props.activeId !== this.state.activeId) {
                this.setState({
                    activeId: props.activeId
                });
            }
        }
    }
    handleOnTabClick(evt:IElmerEvent): void {
        let eventPath = typeof (<any>evt.nativeEvent).composedPath === "function" ? (<any>evt.nativeEvent).composedPath() : (<any>evt.nativeEvent).path;
        if(eventPath) {
            if(this.isArray(eventPath)) {
                let index = 0, maxLength = eventPath.length;
                let target:HTMLLIElement;
                while(index < maxLength && !target) {
                    if(eventPath[index].tagName === "LI") {
                        target = eventPath[index];
                        break;
                    }
                    index += 1;
                }
                maxLength = null;
                // find the event target is li element
                // get itemKey from target's data-key attribute
                if(!target) {
                    // tslint:disable-next-line:no-console
                    console.warn("Can not get the app Item,Maybe browser compatibility issues.");
                } else {
                    let dataKey = target.getAttribute("data-id");
                    this.setState({
                        activeId: dataKey
                    });
                    typeof this.props.onClick === "function" && this.props.onClick({
                        ...evt,
                        data: dataKey
                    });
                    dataKey = null;
                }
            }
        } else {
            // tslint:disable-next-line:no-console
            console.warn("Browser not support");
        }
        eventPath = null;
    }
    render(): string {
        return require("./views/toolBar.html");
    }
}
