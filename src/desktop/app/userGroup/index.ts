import { autowired, Component, declareComponent, ElmerServiceRequest, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { eAlert, showToast } from "../../../components";
import "./style.less";
import { createModuleConfig, createUserGroupColumns } from "./tableConfig";

@declareComponent({
    selector: "adminUserGroup",
    connect: {
        mapStateToProps: (state:any) => {
            return {
                ...state.usersGroup
            };
        }
    }
})
export default class UserGroup extends Component {
    state:any = {
        data: {},
        groupData: [],
        moduleData: [],
        pager: {
            page: 1,
            totalNums: 0,
            pageSize: 20
        },
        mpager: {
            page: 1,
            totalNums: 0,
            pageSize: 20
        },
        tabIndex: 0,
        choseIndex: 0,
        choseGroup: null,
        timestamp: "",
        groupName: ""
    };
    columns: any[][] = [];
    moduleColumns: any[][] = [];
    moduleTableId: string;
    constructor(props:any) {
        super(props);
        this.state.data = props.data;
        this.state.groupData = this.getValue(props, "usersGroup.data") || [];
        this.state.pager.totalNums = this.state.groupData.length;
        this.state.moduleData = this.getValue(props, "adminMudule.data") || [];
        this.state.mpager.totalNums = this.state.moduleData.length;
        this.moduleColumns = createModuleConfig.call(this);
        this.columns = createUserGroupColumns.call(this);
        this.moduleTableId = this.guid();
    }
    handleOnAddGroup(): void {
        eAlert({
            message: "<div>show message<a href='javascript:alert(1111);' target='_blank'>hahah</a></div>",
            msgType: "OkCancel",
            isMobile: false,
            onOk: () => {
                console.log("click ok");
            }
        });
        console.log("show Add Group");
    }
    handleOnTabChange(tabIndex: number): void {
        this.state.tabIndex = tabIndex;
    }
    handleOnTabBeforeChange(): any {
        if(!this.state.choseGroup) {
            eAlert({
                title: "提示",
                message: "请点击授权进入模块页面。",
                msgType: "OKOnly",
                iconType: "Information"
            });
            return false;
        }
    }
    $onPropsChanged(props:any): void {
        const groupData = this.getValue(props, "usersGroup.data") || [];
        if(JSON.stringify(this.state.groupData) !== JSON.stringify(groupData)) {
            this.setState({
                groupData
            });
        }
    }
    render(): any {
        return require("./index.html");
    }
}
