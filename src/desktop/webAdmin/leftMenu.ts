import { autowired,Component,ElmerDOM, IElmerEvent,IPropCheckRule​​, PropTypes } from "elmer-ui-core";

type TypeWebAdminLeftMenuPropRule = {
    data: IPropCheckRule;
    onSwitchClick: IPropCheckRule;
    onClick: IPropCheckRule;
};
type TypeWebAdminLeftMenuProps = {[P in keyof TypeWebAdminLeftMenuPropRule]: any};
type TypeWebAdminLeftMenuState = {
    hideMenu: boolean;
    menuData: any[];
    selectMenu: any;
    selectSubMenu: any;
};

export default class WebAdminLeftMenu extends Component {
    static propType:TypeWebAdminLeftMenuPropRule = {
        data: {
            defaultValue: [],
            rule: PropTypes.array.isRequired
        },
        onSwitchClick: {
            rule: PropTypes.func
        },
        onClick: {
            rule: PropTypes.func
        }
    };
    props: TypeWebAdminLeftMenuProps;
    state:TypeWebAdminLeftMenuState = {
        hideMenu: false,
        menuData: [],
        selectMenu: {},
        selectSubMenu: {}
    };
    private sessionDataID: string = "b0f0038c-99c5-f04a-337e-c1cd55d2";
    private selectMenuChange: boolean = false;
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:TypeWebAdminLeftMenuProps) {
        super(props);
        this.state.menuData = props.data || [];
    }
    $after(): void {
        if(!this.selectMenuChange) {
            const saveDataStr = sessionStorage.getItem(this.sessionDataID);
            const saveData = !this.isEmpty(saveDataStr) ? JSON.parse(saveDataStr) : {};
            if(!this.isEmpty(saveData.selectMenu) && !this.isEmpty(saveData.selectSubMenu)) {
                this.showHideMenu(saveData.selectMenu, true);
                this.setState({
                    selectSubMenu: saveData.selectSubMenu
                });
                this.selectMenuChange = true;
            }
        }
    }
    handleOnMenuClick(evt:IElmerEvent​​): void {
        const menuData = evt.data.item;
        const nextAction = !menuData.isExpand;
        this.selectMenuChange = true;
        if(nextAction) {
            this.$.animation({
                dom: evt.target.parentElement,
                type: "SineEaseIn",
                duration: 300,
                to: {
                    height: 35 * (menuData.data.length + 1)
                },
                onFinish: () => {
                    this.showHideMenu(menuData, nextAction, true);
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
                    this.showHideMenu(menuData, nextAction, true);
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
    handleOnMenuItemClick(evt:IElmerEvent​​): void {
        const selectMenu = evt.data.item;
        const selectSubMenu = evt.data.subItem;
        const saveDataStr = sessionStorage.getItem(this.sessionDataID);
        const saveData = !this.isEmpty(saveDataStr) ? JSON.parse(saveDataStr) : {};
        this.selectMenuChange = true;
        this.setState({
            selectMenu,
            selectSubMenu
        });
        sessionStorage.setItem(this.sessionDataID, JSON.stringify({
            ...saveData,
            selectMenu,
            selectSubMenu
        }));
        typeof this.props.onClick === "function" && this.props.onClick({
            data: selectSubMenu
        });
    }
    render():any {
        return require("./views/left.html");
    }
    private showHideMenu(menuData:any, isExpand: boolean, updateState?: boolean): void {
        const sourceData = JSON.parse(JSON.stringify(this.state.menuData));
        for (const key in sourceData) {
            if (parseInt(key, 10) === menuData.key) {
                sourceData[key].isExpand = isExpand;
                break;
            }
        }
        if(updateState) {
            this.setState({
                menuData: sourceData
            });
        } else {
            this.state.menuData = sourceData;
        }
    }
}
