import { autowired, Component, ElmerDOM,IElmerEvent, IPropCheckRule, PropTypes } from "elmer-ui-core";

type TypeWebAdminTopPropRule = {
    menuList: IPropCheckRule;
    onChange: IPropCheckRule;
    companyName: IPropCheckRule;
    systemName: IPropCheckRule;
    onLoginout: IPropCheckRule;
    loginoutName: IPropCheckRule;
    adminHome: IPropCheckRule;
    onAdminHome: IPropCheckRule;
    systemHome: IPropCheckRule;
    selectedMenu: IPropCheckRule;
    onSystemHome: IPropCheckRule;
    onClose: IPropCheckRule;
};
type TypeWebAdminTopProps = {[P in keyof TypeWebAdminTopPropRule]: any};
type TypeWebAdminTopState = {[P in keyof TypeWebAdminTopPropRule]?: any;} & {
    selectedMenu: any;
};

export default class WebAdminTop extends Component {
    static propType: TypeWebAdminTopPropRule = {
        menuList: {
            defaultValue: [],
            rule: PropTypes.array.isRequired
        },
        onChange: {
            description: "菜单切换事件",
            rule: PropTypes.func
        },
        companyName: {
            defaultValue: "江涛工作室",
            description: "公司名称",
            rule: PropTypes.string.isRequired
        },
        systemName: {
            defaultValue: "后台管理系统",
            description: "系统名称",
            rule: PropTypes.string.isRequired
        },
        selectedMenu: {
            description: "默认菜单",
            rule: PropTypes.any
        },
        onLoginout: {
            description: "点击注销按钮事件",
            rule: PropTypes.func
        },
        loginoutName: {
            defaultValue: "注销",
            description: "注销按钮名称",
            rule: PropTypes.string.isRequired
        },
        adminHome: {
            defaultValue: "管理首页",
            description: "管理系统首页名称",
            rule: PropTypes.string.isRequired
        },
        onAdminHome: {
            description: "点击管理首页事件",
            rule: PropTypes.func
        },
        systemHome: {
            defaultValue: "网站首页",
            description: "系统首页名称",
            rule: PropTypes.string
        },
        onSystemHome: {
            description: "点击系统首页事件",
            rule: PropTypes.func
        },
        onClose: {
            rule: PropTypes.func
        }
    };
    props: TypeWebAdminTopProps;
    state: TypeWebAdminTopState = {
        menuList: [],
        selectedMenu: {}
    };
    scrollIndex: number = 0;
    position: number = 0;
    private sessionDataID: string = "b0f0038c-99c5-f04a-337e-c1cd55d2";
    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:TypeWebAdminTopProps) {
        super(props);
        this.state.menuList = props.menuList || [];
        if(props.selectedMenu) {
            this.state.selectedMenu = props.selectedMenu;
        } else {
            this.state.selectedMenu = this.state.menuList[0];
        }
    }
    handleOnCloseClick(): void {
        typeof this.props.onClose === "function" && this.props.onClose(this.state.selectedMenu);
    }
    $onPropsChanged(props: TypeWebAdminTopProps): void {
        if(!this.isEqual(props.menuList, this.state.menuList)) {
            this.setState({
                menuList: props.menuList,
                selectedMenu: props.selectedMenu
            });
        } else {
            if(!this.isEqual(props.selectedMenu, this.state.selectedMenu)) {
                this.setState({
                    selectedMenu: props.selectedMenu
                });
            }
        }
    }
    handleOnMenuItemClick(evt:IElmerEvent): void {
        const menuData = evt.data.item;
        if(menuData.id !== this.state.selectedMenu.id) {
            this.setState({
                selectedMenu: menuData
            });
            typeof this.props.onChange === "function" && this.props.onChange(menuData);
            const saveValue = sessionStorage.getItem(this.sessionDataID);
            if(!this.isEmpty(saveValue)) {
                const saveData:any = JSON.parse(saveValue);
                if(menuData.id === this.state.menuList[0].id) {
                    saveData.selectSubMenu = menuData;
                    saveData.selectMenu = {};
                }
                sessionStorage.setItem(this.sessionDataID, JSON.stringify(saveData));
            } else {
                sessionStorage.setItem(this.sessionDataID, JSON.stringify({
                    selectSubMenu: menuData,
                    selectMenu: {}
                }));
            }
        }
    }
    handleOnScollTopClick(): void {
        const itemHeight = this.getMenuItemHeight();
        const scrollParent:HTMLElement = this.dom["topMenuCT"];
        if(scrollParent && this.scrollIndex > 0) {
            const toIndex = this.scrollIndex - 1;
            const toTop = toIndex * itemHeight;
            this.scrollIndex = toIndex;
            this.$.css(scrollParent, "margin-top", -toTop);
        }
    }
    handleOnScollBottomClick(): void {
        const itemHeight = this.getMenuItemHeight();
        const scrollParent:HTMLElement = this.dom["topMenuCT"];
        const maxIndex = this.getScrollMaxLine();
        if(scrollParent && this.scrollIndex < maxIndex - 1) {
            const toIndex = this.scrollIndex + 1;
            const toTop = toIndex * itemHeight;
            this.scrollIndex = toIndex;
            this.$.css(scrollParent, "margin-top", -toTop);
        }
    }
    render():any {
        return require("./views/top.html");
    }
    private getScrollMaxLine(): number {
        const itemHeight = this.getMenuItemHeight();
        const listHeight = this.getScrollHeight();
        let maxLine = Math.ceil(listHeight / itemHeight);
        if(maxLine === 2 && listHeight < itemHeight*2) {
            maxLine = 1;
        }
        return maxLine;
    }
    private getMenuItemHeight(): number {
        const scrollDom:HTMLElement = this.dom["topMenuCT"];
        const firstDom: HTMLElement = <any>scrollDom.firstChild;
        return firstDom ? firstDom.clientHeight : 37;
    }
    private getScrollHeight():number {
        const scrollDom:HTMLElement = this.dom["topMenuCT"];
        return scrollDom.clientHeight;
    }
}
