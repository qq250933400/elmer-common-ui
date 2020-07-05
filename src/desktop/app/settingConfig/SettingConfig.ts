import { autowired, Component, declareComponent, ElmerServiceRequest, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { showToast } from "../../../components";
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
    ajaxUrl: string = "";
    @autowired(ElmerServiceRequest)
    private http:ElmerServiceRequest;
    constructor(props:{[P in keyof TypeSettingConfigProps]: any}) {
        super(props);
        this.state.data = props.data;
        this.http.init();
        this.ajaxUrl = this.http.getUrl("updateWebsiteSetting", "admin");
    }
    handleOnResponse(resp:any): void {
        if(resp.success) {
            showToast("提交成功");
        } else {
            showToast​​(resp.info || resp.message || "提交失败");
        }
    }
    handleOnTabChange(index:number): void {
        this.setState({
            tabIndex:index
        });
    }
}
