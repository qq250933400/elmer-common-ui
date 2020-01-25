import { autowired, Component, declareComponent, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { IAdminMenuData } from "../../../components/adminMenu/IAdminMenuData";

type TypeSettingConfigProps = {
    data: IPropCheckRule;
};

type TypeSettingConfigState = {
    data: IAdminMenuData;
    tabIndex: number;
};

@declareComponent({
    selector: "SettingConfig",
    template: {
        url: "./settingConfig.html",
        fromLoader: true
    }
})
export class SettingConfig extends Component {
    static propType:TypeSettingConfigProps = {
        data: {
            description: "Menu data",
            rule: PropTypes.any
        }
    };
    state: TypeSettingConfigState = {
        data: null,
        tabIndex: 0
    };
    constructor(props:{[P in keyof TypeSettingConfigProps]: any}) {
        super(props);
        this.state.data = props.data;
    }
    handleOnTabChange(index:number): void {
        this.setState({
            tabIndex:index
        });
    }
}
