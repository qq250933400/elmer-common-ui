import { Component, declareComponent, IPropCheckRule, PropTypes, IElmerEvent } from "elmer-ui-core";
import WebAdminTop from "./top";
// tslint:disable-next-line: ordered-imports
import WebLeftMenu from "./leftMenu";
// tslint:disable-next-line: ordered-imports
import "./css/css.css";
import "./css/index.less";
// import "./css/main.css";

type TypeWebAdminPropRule = {
    menuList: IPropCheckRule;
};

type TypeWebAdminProps = {[P in keyof TypeWebAdminPropRule]: any};

type TypeWebAdminState = {
    hideMenu?: boolean;
    openMenuList: any[];
    defaultOpenMenu?: any;
};

@declareComponent({
    selector: "WebAdmin",
    template: {
        url: "./views/index.html",
        fromLoader: true
    },
    connect: {
        mapStateToProps: (state) => {
            return {
                menuList: state.desktop.mainMenuList,
                webconfig: state.desktop.webconfig
            };
        }
    },
    components: [{
        selector: "WebAdminTop",
        component: WebAdminTop
    }, {
        selector: "WebLeftMenu",
        component: WebLeftMenu
    }]
})
export default class WebAdmin extends Component {
    static propType:TypeWebAdminPropRule = {
        menuList: {
            defaultValue: [],
            rule: PropTypes.array.isRequired
        }
    };
    state: TypeWebAdminState = {
        openMenuList: []
    };
    props: TypeWebAdminProps;
    private mainMenu:any = {
        id: "49c496d7-d291-f28f-bd26-3b2d0ce8",
        title: "网站首页",
        data: {
            type: "Route",
            component: "/"
        }
    };
    private sessionDataID: string = "b0f0038c-99c5-f04a-337e-c1cd55d2";
    constructor(props:TypeWebAdminProps) {
        super(props);
        const defaultMenuList = [this.mainMenu];
        const openMenu = this.getLastOpenMenu();
        if(openMenu) {
            if(openMenu.id !== this.mainMenu.id) {
                defaultMenuList.push(openMenu);
            }
            this.state.defaultOpenMenu = openMenu;
        }
        this.state.openMenuList = defaultMenuList;
        console.log(defaultMenuList);
    }
    handleOnCloseTab(data:any): void {
        const openList = this.state.openMenuList;
        const newOpenList = [];
        let closeIndex = -1;
        let activeIndex = 0;
        for(let i=0;i<openList.length;i++) {
            if(openList[i].id !== data.id || openList[i].id === this.mainMenu.id) {
                newOpenList.push(openList[i]);
            } else {
                closeIndex = i;
            }
        }
        if(closeIndex>0) {
            if(closeIndex<newOpenList.length) {
                activeIndex = closeIndex;
            } else {
                activeIndex = closeIndex - 1;
            }
        }
        this.setState({
            defaultOpenMenu: newOpenList[activeIndex],
            openMenuList: newOpenList
        });
    }
    handleOnTopMenuClick(data:any): void {
        this.openMenu(data);
    }
    handleOnLeftMenuClick(evt:IElmerEvent): void {
        const menuData = evt.data;
        if(menuData) {
            this.openMenu(menuData);
        }
    }
    handleOnMenuSwitchClick(hideMenu: boolean): void {
        this.setState({
            hideMenu
        });
    }
    private openMenu(menuData:any): void {
        if(this.props.menuList && this.props.menuList.length>0) {
            let isFindOpenItem = false;
            // tslint:disable-next-line: forin
            for(const key in this.state.openMenuList) {
                const openMenu = this.state.openMenuList[key];
                if(openMenu.id === menuData.id) {
                    this.setState({
                        defaultOpenMenu: menuData
                    });
                    isFindOpenItem = true;
                    break;
                }
            }
            if(!isFindOpenItem) {
                const openList = JSON.parse(JSON.stringify(this.state.openMenuList));
                openList.push(menuData);
                this.setState({
                    defaultOpenMenu: menuData,
                    openMenuList: openList
                });
            }
        }
    }
    private getLastOpenMenu():any {
        const ssStr = sessionStorage.getItem(this.sessionDataID);
        if(!this.isEmpty(ssStr)) {
            const sJson = JSON.parse(ssStr);
            return sJson.selectSubMenu;
        }
    }
}
