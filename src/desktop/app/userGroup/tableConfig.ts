import { eAlert, showLoading } from "../../../components";
import { createOfficeDataViewHeader } from "../../../components/office/widget/dataView";

export const createUserGroupColumns = function(): any {
    return createOfficeDataViewHeader([
        [
            {
                title: `<div>
                    <eui-button theme='eui-button-primary' et:onClick='props.events.onAddGroup'>新增</eui-button>
                    <eui-button et:onClick='props.events.onRefresh' style="margin-left: 5px;">刷新</eui-button>
                </div>`,
                colspan: 6,
                isCodeTitle: true,
                className: "UserGroupOperation",
                events: {
                    onAddGroup: (): void => {
                        this.handleOnAddGroup();
                    },
                    onRefresh: this.loadGroupList.bind(this)
                }
            }
        ],
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
                style: "width: 200px;",
                events: {
                    onSetRights: (evt:any) => {
                        const choseGroupId = this.getValue(this.state, "choseGroup.id");
                        if(evt.data.id !== choseGroupId) {
                            const loading = showLoading({title: "获取权限"});
                            const handler = setTimeout(() => {
                                this.getGroupModule(evt.data.id).then(() => {
                                    this.setState({
                                        choseGroup: evt.data,
                                        groupName: "(" + evt.data.name + ")",
                                        tabIndex: 1,
                                        timestamp: (new Date()).getTime()
                                    });
                                    this.dom[this.tabId].switchTab(1);
                                    loading.dispose();
                                }).catch(() => {
                                    loading.dispose();
                                });
                            }, 200);
                        }
                    },
                    onEditGroup: (evt) => {
                        this.handleOnAddGroup(evt.data);
                    },
                    onDelGroup: (evt) => {
                        eAlert({
                            title: "提示",
                            message: `请注意删除分组【${evt.data.name}】已经设置好的权限将丢失无法恢复只能重新授权。`,
                            msgType: "OkCancel",
                            iconType: "Information",
                            onOk: () => {
                                this.delUserGroup(evt.data.id);
                            }
                        });
                    }
                },
                render: (id: any, data:any) => {
                    return `<eui-button data="{{props.data}}" et:onClick="props.events.onSetRights" theme="eui-button-primary" title="授权"/>
                        <eui-button style="margin-left: 5px;" title="删除" data="{{props.data}}" et:onClick="props.events.onDelGroup"/>
                        <eui-button style="margin-left: 5px;" title="修改" data="{{props.data}}" et:onClick="props.events.onEditGroup"/>`;
                }
            }
        ]
    ]);
};

export const createModuleConfig = function():any {
    const resultData = createOfficeDataViewHeader([[
        {
            title: "授权",
            dataKey: "id",
            style: "width: 60px;",
            events: {
                onAuthRightClick: (evt) => {
                    this.setGroupRight(evt.data.module, evt.checked);
                }
            },
            render: (id: any, data:any): any => {
                const groupRight = this.getValue(this, "state.groupRight");
                let hasRight = false;
                if(groupRight && groupRight.length>0) {
                    for(let i=0;i<groupRight.length;i++) {
                        const rightItem = groupRight[i];
                        if(rightItem.module === data.module && rightItem.moduleId === id) {
                            hasRight = true;
                            break;
                        }
                    }
                }
                const checked = hasRight ? "true" : "false";
                return `<eui-checkbox data-module="{{props.data}}" checked="{{${checked}}}" et:onChange="props.events.onAuthRightClick"/>`;
            }
        },
        {
            title: "模块名称",
            dataKey: "title",
            style: "text-align:left;",
            render: (title: string, data:any) => {
                return `<span data-type="html">${data.prefix}${title}</span>`;
            }
        }, {
            title: "路径",
            dataKey: "url",
            style: "text-align:left;",
        }, {
            title: "图标",
            dataKey: "icon"
        }
    ]]);
    return resultData;
};
