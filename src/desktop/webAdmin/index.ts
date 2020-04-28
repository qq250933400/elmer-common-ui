import { Component, declareComponent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import WebAdminTop from "./top";
import WebLeftMenu from "./leftMenu";
// tslint:disable-next-line: ordered-imports
import "./css/css.css";
// import "./css/main.css";

type TypeWebAdminPropRule = {
    menuList: IPropCheckRule;
};

type TypeWebAdminProps = {[P in keyof TypeWebAdminPropRule]: any};

type TypeWebAdminState = {
    hideMenu?: boolean;
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
                menuList: state.desktop.mainMenuList
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
    state: TypeWebAdminState = {};
    constructor(props:TypeWebAdminProps) {
        super(props);
        console.log(props);
    }
    handleOnMenuSwitchClick(hideMenu: boolean): void {
        this.setState({
            hideMenu
        });
    }
}
