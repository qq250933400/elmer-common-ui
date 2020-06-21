import { Component,declareComponent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { RouterService } from "elmer-ui-core/lib/widget/router/RouterService";
import WebAdminMain from "../../webAdmin/main";

type TypeWebAdminContainerPropRule = {
    data: IPropCheckRule;
    id: IPropCheckRule;
    visible: IPropCheckRule;
    className: IPropCheckRule;
    style: IPropCheckRule;
    prefixPath: IPropCheckRule;
};

type TypeWebAdminContainerProps = {[P in keyof TypeWebAdminContainerPropRule]?:any};

type TypeWebAdminContainerState = TypeWebAdminContainerProps & {
    visible?: boolean;
    data?: any;
    routeUrl?: string;
};

@declareComponent({
    selector: "WebadminContainer",
    components: [
        {
            selector: "WebAdminMain",
            component: WebAdminMain
        }
    ],
    model: {
        checkRoute: RouterService
    }
})
export default class WebAdminContainer extends Component {
    static propType:TypeWebAdminContainerPropRule = {
        data: {
            description: "定义的数据",
            rule: PropTypes.any.isRequired
        },
        id: {
            description: "定义绑定ID",
            rule: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired
        },
        visible: {
            defaultValue: true,
            description: "显示隐藏",
            rule: PropTypes.bool.isRequired
        },
        className: {
            defaultValue: "",
            rule: PropTypes.string
        },
        style: {
            defaultValue: "",
            rule: PropTypes.string
        },
        prefixPath: {
            defaultValue: "",
            rule: PropTypes.string
        }
    };
    state: TypeWebAdminContainerState = {
        visible: false,
        routeUrl: "/"
    };
    constructor(props:TypeWebAdminContainerProps) {
        super(props);
        this.state.visible = props.visible;
        this.state.data = props.data;
        this.state.routeUrl = this.getValue(this.props, "data.data.component");
        if(this.isEmpty(this.getValue(props.data, "data.hashRouter"))) {
            this.state.data.data.hashRouter = false;
        }
        if(props.data.type === "ElmerUI") {
            console.log(props.data.component);
        }

    }

    $onPropsChanged(props: TypeWebAdminContainerProps): void {
        const updateState:TypeWebAdminContainerState = {};
        if(this.state.visible !== props.visible) {
            updateState.visible = props.visible;
        }
        if(!this.isEqual(this.state.data, props.data)) {
            updateState.data = props.data;
        }
        this.setState(updateState);
    }
    render():any {
        return require("./container.html");
    }
}
