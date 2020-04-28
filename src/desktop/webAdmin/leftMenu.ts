import { autowired,Component,ElmerDOM, IElmerEvent,IPropCheckRule​​, PropTypes } from "elmer-ui-core";

type TypeWebAdminLeftMenuPropRule = {
    data: IPropCheckRule;
    onSwitchClick: IPropCheckRule;
};
type TypeWebAdminLeftMenuProps = {[P in keyof TypeWebAdminLeftMenuPropRule]: any};
type TypeWebAdminLeftMenuState = {
    hideMenu: boolean;
    menuData: any[];
};

export default class WebAdminLeftMenu extends Component {
    static propType:TypeWebAdminLeftMenuPropRule = {
        data: {
            defaultValue: [],
            rule: PropTypes.array.isRequired
        },
        onSwitchClick: {
            rule: PropTypes.func
        }
    };
    props: TypeWebAdminLeftMenuProps;
    state:TypeWebAdminLeftMenuState = {
        hideMenu: false,
        menuData: []
    };
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:TypeWebAdminLeftMenuProps) {
        super(props);
        this.state.menuData = props.data || [];
    }
    handleOnMenuClick(evt:IElmerEvent​​): void {
        const menuData = evt.data.item;
        const nextAction = !menuData.isExpand;
        if(nextAction) {
            this.$.animation({
                dom: evt.target.parentElement,
                type: "SineEaseIn",
                duration: 300,
                to: {
                    height: 35 * (menuData.data.length + 1)
                },
                onFinish: () => {
                    this.showHideMenu(menuData, nextAction);
                    this.$.css(evt.target.parentElement, "height", "");
                }
            });
        } else {
            this.$.animation({
                dom: evt.target.parentElement,
                type: "SineEaseIn",
                duration: 300,
                to: {
                    height: 35
                },
                onFinish: () => {
                    this.$.css(evt.target.parentElement, "height", "");
                    this.showHideMenu(menuData, nextAction);
                }
            });
        }
    }
    handleOnSwitchBarClick(): void {
        const hideMenu = !this.state.hideMenu;
        this.setState({
            hideMenu,
        });
        typeof this.props.onSwitchClick === "function" && this.props.onSwitchClick(hideMenu);
    }
    render():any {
        return require("./views/left.html");
    }
    private showHideMenu(menuData:any, isExpand: boolean): void {
        const sourceData = JSON.parse(JSON.stringify(this.state.menuData));
        for (const key in sourceData) {
            if (parseInt(key, 10) === menuData.key) {
                sourceData[key].isExpand = isExpand;
                break;
            }
        }
        this.setState({
            menuData: sourceData
        });
    }
}
