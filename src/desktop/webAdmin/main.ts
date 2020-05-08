import { Component, declareComponent, IPropCheckRule, PropTypes } from "elmer-ui-core";
// tslint:disable-next-line: ordered-imports

type TypeWebAdminMainPropRule = {
    menuList: IPropCheckRule;
};

type TypeWebAdminMainProps = {[P in keyof TypeWebAdminMainPropRule]: any};

type TypeWebAdminMainState = {
    hideMenu?: boolean;
};

export default class WebAdminMain extends Component {
    static propType:TypeWebAdminMainPropRule = {
        menuList: {
            defaultValue: [],
            rule: PropTypes.array.isRequired
        }
    };
    state: TypeWebAdminMainState = {};
    render(): any {
        return require("./views/main.html");
    }
}
