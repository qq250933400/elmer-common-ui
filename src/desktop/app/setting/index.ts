import { autowired, Component, declareComponent, IElmerEvent,IPropCheckRule, PropTypes } from "elmer-ui-core";
import { IAdminMenuData } from "../../../components/adminMenu/IAdminMenuData";
import "../settingConfig/SettingConfig";
const menuData:IAdminMenuData[] = [
    { title: "系统设置", id: "1", icon: "fa-cog", url: "<eui-setting-config data='{{props.data}}'/>" },
    { title: "用户管理", id: "2", icon: "fa-vcard", url: "<span>用户管理</span>" },
    { title: "个人中心", id: "3", icon: "fa-user-circle", url: "<span>个人中心</span>" },
    { title: "主题设置", id: "4", icon: "fa-dashboard", url: "<span>主题设置</span>" },
    { title: "壁纸设置", id: "5", icon: "fa-image", url: "<span>壁纸设置</span>" },
    { title: "关于作品", id: "6", icon: "fa-question-circle-o", url: "<span>关于作品</span>" }
];
type TypeSettingState = {
    menuList: IAdminMenuData[];
    menuWidth: number;
    menuExpand: boolean;
    defaultMenuItem: IAdminMenuData;
    selectedMenuData: IAdminMenuData;
};

@declareComponent({
    selector: "desktopSetting",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export class DesktopSetting extends Component {
    state: TypeSettingState = {
        menuList: menuData,
        menuWidth: 200,
        menuExpand: true,
        defaultMenuItem: menuData[0],
        selectedMenuData: menuData[0]
    };
    handleOnMenuChange(evt:IElmerEvent): void {
        this.setState({
            selectedMenuData: evt.data
        });
    }
    handleOnMenuExpandChange(evt:IElmerEvent): void {
        if(evt.data) {
            this.setState({
                menuExpand: true,
                menuWidth: 200
            });
        } else {
            this.setState({
                menuExpand: false,
                menuWidth: 60
            });
        }
    }
}
