import { autowired, Component, declareComponent, ElmerServiceRequest, IPropCheckRule, PropTypes } from "elmer-ui-core";
import { eAlert, showLoading, showToast } from "../../../components";
import { commonHandler } from "../../MCommon";
import { actionUpdateUserGroup } from "../../state/action";
import "./style.less";
import { createModuleConfig, createUserGroupColumns } from "./tableConfig";

@declareComponent({
    selector: "adminUserGroup",
    connect: {
        mapStateToProps: (state:any) => {
            return {
                ...state.usersGroup
            };
        },
        mapDispatchToProps: (dispatch:Function) => ({
            actionUpdateGroupList: (data:any) => (dispatch(actionUpdateUserGroup(data)))
        })
    }
})
export default class UserGroup extends Component {
    state:any = {
        data: {},
        groupData: [],
        groupRight: [],
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
        page: 0,
        tabIndex: 0,
        choseIndex: 0,
        choseGroup: null,
        timestamp: "",
        groupName: ""
    };
    columns: any[][] = [];
    moduleColumns: any[][] = [];
    moduleTableId: string;
    tabId: string;
    @autowired(ElmerServiceRequest)
    private http:ElmerServiceRequest;
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
        this.tabId = this.guid();
        this.http.init(true);
    }
    handleOnAddGroup(groupData:any): void {
        let isSupper = groupData && groupData.isSuper === 1;
        let groupName = groupData ? groupData.name : "";
        const isSupperDefault = groupData && groupData.isSuper === 1 ? "true" : "false";
        const dResult = eAlert({
            content: `<div class="user-group-input-layout">
                <label class="layout-form-item">
                    <span>分组名称</span>
                    <input bind="state.groupName" value="${groupName}" class='eui-input' type='text' placeholder='分组名称不能为空'/>
                </label>
                <label class="layout-form-item" style="margin-top: 15px;">
                    <span></span>
                    <eui-checkbox title="超级管理员" checked="{{${isSupperDefault}}}" et:onChange="options.events.onCheckChange"/>
                </label>
            </div>`,
            title: "新增用户组",
            msgType: "OkCancel",
            isMobile: false,
            events: {
                onCheckChange: (evt:any): void => {
                    isSupper = evt.checked;
                }
            },
            onBefore: (res) => {
                if(res.button === "Ok") {
                    const bindValue = this.getValue(dResult.component, "state.groupName");
                    groupName = !this.isEmpty(bindValue) ? bindValue : groupName;
                    if(this.isEmpty(groupName)) {
                        res.cancel = true;
                        eAlert({
                            title: "错误",
                            msgType: "OKOnly",
                            iconType: "Error",
                            message: "分组名称不能为空！"
                        });
                    }
                }
            },
            onOk: () => {
                let loading = showLoading({
                    title: "提交数据",
                    visible: true
                });
                this.http.sendRequest({
                    namespace: "admin",
                    endPoint: "editGroupInfo",
                    data: {
                        groupName,
                        isSuper: isSupper ? 1 : 0,
                        id: this.getValue(groupData, "id")
                    },
                    complete: () => {
                        loading.dispose();
                        loading = null;
                    }
                }).then((resp) => {
                    if(!commonHandler(resp)) {
                        this.loadGroupList();
                    }
                }).catch((err) => {
                    commonHandler(err);
                });
            }
        });
    }
    loadGroupList(): void {
        let loading = showLoading({title: "正在加载"});
        this.http.sendRequest({
            namespace: "admin",
            endPoint: "groupList",
            data: {
                page: this.state.page
            },
            complete: () => {
                loading.dispose();
                loading = null;
            }
        }).then((resp) => {
            if(!commonHandler(resp)) {
                const groupList = resp.data || [];
                (<any>this.props).actionUpdateGroupList(resp);
                this.setState({
                    groupData: groupList,
                    groupTime: (new Date()).getTime()
                });
            }
        }).catch((error):void => {
            commonHandler(error);
        });
    }
    setGroupRight(data:any, isAdd?: boolean): void {
        const bodyData = {
            groupId: this.state.choseGroup.id,
            module: data.module,
            moduleData: [data.id]
        };
        const loading = showLoading({title: "授权设置"});
        this.http.sendRequest({
            namespace: "admin",
            endPoint: isAdd ? "addGroupRight" : "delGroupRight",
            data: bodyData,
            complete: () => {
                loading.dispose();
            }
        }).then((resp) => {
            if(!commonHandler(resp)) {
                // tslint:disable-next-line: no-floating-promises
                this.getGroupModule(this.state.choseGroup.id);
            }
        }).catch((error) => {
            commonHandler(error);
        });
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
        const groupData = this.getValue(props, "usersGroup.data");
        const moduleData = this.getValue(props, "adminMudule.data");
        if(groupData) {
            this.setState({
                groupData,
                moduleData
            });
        }
    }
    render(): any {
        return require("./index.html");
    }
    async getGroupModule(groupId: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.http.sendRequest({
                namespace: "admin",
                endPoint: "getGroupRight",
                data: {
                    groupId
                },
            }).then((resp) => {
                if(!commonHandler(resp)) {
                    this.state.groupRight = resp.data || [];
                    resolve({});
                } else {
                    reject({});
                }
            }).catch((error) => {
                commonHandler(error);
                reject({});
            });
        });
    }
    delUserGroup(groupId: number): void {
        const loading = showLoading({title: "删除分组"});
        this.http.sendRequest({
            namespace: "admin",
            endPoint: "deleteUserGroup",
            data: {
                id: groupId
            },
            complete: () => {
                loading.dispose();
            }
        }).then((resp) => {
            if(!commonHandler(resp)) {
                this.loadGroupList();
            }
        }).catch((error) => {
            commonHandler(error);
        });
    }
}
