import { IElmerEvent } from "elmer-ui-core";
import { createOfficeDataViewHeader , createOfficeDataViewPager ,TypeOfficeDataViewHeaderItem } from "../../../components/office/widget/dataView";
import { eAlert } from "../../../components";

export const createUserColumns = function(): any {
    return createOfficeDataViewHeader([
        [
            {
                title: `<div>
                    <eui-button theme='eui-button-primary' et:onClick='props.events.onAddUser'>新增</eui-button>
                    <eui-button et:onClick='props.events.onRefresh' style="margin-left: 5px;">刷新</eui-button>
                </div>`,
                colspan: 6,
                isCodeTitle: true,
                className: "UserGroupOperation",
                events: {
                    onAddUser: (): void => {
                        this.handleOnAddUser();
                    },
                    onRefresh: this.loadUserList.bind(this)
                }
            }
        ],
        [
        { title: "用户ID", dataKey: "id", style:"width:50px;" },
        { title: "登录账号", dataKey: "userLogin" },
        { title: "昵称", dataKey: "userName" },
        { title: "头像", dataKey: "header", render:(header:string) => {
            return !this.isEmpty(header) ? `<img style="width:50px;height:50px;" src="${header}" />` : "<span>未上传头像</span>";
        }},
        { title: "状态", dataKey: "status",
            style: "width: 50px",
            render:(status:number) => {
                return status === 1 ? "<span>正常</span>" : "<span style='color: gray;'>已禁用</span>";
            }
        }, {
            title: "操作",
            dataKey: "id",
            events: {
                onDelete: (evt:IElmerEvent): void => {
                    const userData = evt.data;
                    if(userData.userLogin !== "admin") {
                        eAlert({
                            title: "提示",
                            message: `确定删除当前管理员？`,
                            msgType: "OkCancel",
                            iconType: "Question",
                            onOk: () => {
                                this.onDeleteUser(userData.id);
                            }
                        });
                    } else {
                        eAlert({
                            title: "提示",
                            message: `admin为系统默认管理员不能删除！`,
                            iconType: "Information"
                        });
                    }
                },
                onCheckGroup: (evt:IElmerEvent) => {
                    const oldId = this.getValue(this.state, "choseUser.id");
                    if(evt.data.id !== oldId) {
                        this.getUserGroupByUser(evt.data.id).then((groupList:any[]) => {
                            const userName = !this.isEmpty(evt.data.userName) ? evt.data.userName : evt.data.userLogin;
                            this.setState({
                                choseUser: evt.data,
                                choseUserName: ` (${userName})`,
                                choseUserGroup: groupList
                            });
                            this.dom[this.tabId].switchTab(1);
                        });
                    } else {
                        if(this.state.choseUser) {
                            this.dom[this.tabId].switchTab(1);
                        }
                    }
                },
                onEdit:(evt:IElmerEvent) => {
                    this.handleOnAddUser(evt.data);
                }
            },
            render:(id:number, data:any) => {
                return `<eui-button data="{{props.data}}" theme="eui-button-primary" et:onClick="props.events.onCheckGroup">用户组</eui-button>
                    <eui-button data="{{props.data}}" et:onClick="props.events.onEdit" style="margin-left: 5px;">修改</eui-button>
                    <eui-button data="{{props.data}}" et:onClick="props.events.onDelete" style="margin-left: 5px;">删除</eui-button>
                `;
            }
        }
    ]]);
};

// tslint:disable-next-line: only-arrow-functions
export const createUserGroupColumns = function(): any {
    return createOfficeDataViewHeader([[
        {
            title: "选择",
            style: "width: 50px;",
            dataKey: "id",
            events: {
                onChange: (evt:any) => {
                    this.updateUserForGroupDetail(evt.data.group.id, this.state.choseUser.id, evt.checked)
                        .then(() => {
                            this.getUserGroupByUser(this.state.choseUser.id).then((groupList:any[]) => {
                                this.setState({
                                    choseUserGroup: groupList
                                });
                            });
                        });
                }
            },
            render: (id: number, data:any) => {
                const userGroupList = this.state.choseUserGroup || [];
                let checked = "false";
                // tslint:disable-next-line: forin
                for(const key in userGroupList) {
                    const item = userGroupList[key];
                    if(item.groupId === id) {
                        checked = "true";
                        break;
                    }
                }
                return `<eui-checkbox data-group="{{props.data}}" et:onChange="props.events.onChange" checked='{{${checked}}}'/>`;
            }
        }, {
            title: "分组",
            dataKey: "name"
        }, {
            title: "是否超级管理员",
            dataKey: "isSuper",
            render: (isSuper: number) => {
                return isSuper === 1 ? "<span>是</span>" : "<span>否</span>";
            }
        }
    ]]);
};
