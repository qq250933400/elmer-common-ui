import { autowired, Component, declareComponent, ElmerServiceRequest, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { showToast, eAlert } from "../../../components";
import { createOfficeDataViewHeader, TypeOfficeDataViewHeaderItem } from "../../../components/office/widget/dataView";

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
        pager: {
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
    columns: TypeOfficeDataViewHeaderItem[][] = createOfficeDataViewHeader([
        [
            {
                title: "分组ID",
                dataKey: "id",
                style: "width:60px;"
            }, {
                title: "分组名称",
                dataKey: "name"
            }, {
                title: "是否超级管理员",
                dataKey: "isSuper",
                render: (isSuper) => {
                    return `<span>${isSuper ? "是": "否"}</span>`;
                }
            }, {
                title: "创建人",
                dataKey: "createUser"
            }, {
                title: "创建时间",
                dataKey: "createTime",
                style: "width:140px;padding: 5px;"
            }, {
                title: "操作",
                dataKey: "id",
                events: {
                    onSetRights: (evt:any) => {
                        this.setState({
                            choseGroup: evt.data,
                            groupName: "(" + evt.data.name + ")",
                            tabIndex: 1,
                            timestamp: (new Date()).getTime()
                        });
                    }
                },
                render: (id: any, data:any) => {
                    return `<eui-button data="{{props.data}}" et:onClick="props.events.onSetRights" theme="eui-button-primary" title="授权"/><eui-button style="margin-left: 5px;" title="删除"/>`;
                }
            }
        ]
    ]);
    constructor(props:any) {
        super(props);
        this.state.data = props.data;
        this.state.groupData = this.getValue(props, "usersGroup.data") || [];
        this.state.pager.totalNums = this.state.groupData.length;
    }
    handleOnTabChange(tabIndex: number): void {
        this.state.tabIndex = tabIndex;
        console.log("onTabChange", tabIndex);
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
