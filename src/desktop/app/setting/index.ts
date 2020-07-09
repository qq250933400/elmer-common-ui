import { autowired, Component, declareComponent, IElmerEvent,IPropCheckRule, PropTypes } from "elmer-ui-core";
import { IAdminMenuData } from "../../../components/adminMenu/IAdminMenuData";
import "../settingConfig/SettingConfig";
import SettingUserList from "../userList";

const menuData:IAdminMenuData[] = [
    // { title: "系统设置", id: "1", icon: "fa-cog", url: "<eui-setting-config data='{{props.data}}'/>" },
    { title: "用户分组", id: "2", icon: "fa-vcard", url: "<eui-admin-user-group data='{{props.data}}'/>" },
    { title: "用户管理", id: "3", icon: "fa-user-circle", url: "<SettingUserList data='{{props.data}}'/>" },
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
    },
    components: [
        {
            selector: "SettingUserList",
            component: SettingUserList
        }
    ]
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
