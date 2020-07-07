import { createOfficeDataViewHeader } from "../../../components/office/widget/dataView";

export const createUserGroupColumns = function(): any {
    return createOfficeDataViewHeader([
        [
            {
                title: "<div><eui-button theme='eui-button-primary' et:onClick='props.events.onAddGroup'>新增分组</button></div>",
                colspan: 6,
                isCodeTitle: true,
                className: "UserGroupOperation",
                events: {
                    onAddGroup: this.handleOnAddGroup.bind(this)
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
};

export const createModuleConfig = function():any {
    const resultData = createOfficeDataViewHeader([[
        {
            title: "<eui-button et:onClick='props.events.onAuthRightClick' theme='eui-button-primary'>授权</eui-button>",
            dataKey: "id",
            style: "width: 60px;",
            isCodeTitle: true,
            events: {
                onAuthRightClick: () => {
                    console.log("set Right");
                }
            },
            render: (id: any): any => {
                const groupModule = this.getValue(this, "state.groupModules");
                const checked = groupModule && groupModule.indexOf(id) > 0 ? "true" : "false";
                return `<eui-checkbox checked="{{${checked}}}"/>`;
            }
        },
        {
            title: "模块名称",
            dataKey: "title",
            render: (title: string, data:any) => {
                return `<span data-type="html">${data.prefix}${title}</span>`;
            }
        }, {
            title: "路径",
            dataKey: "url"
        }, {
            title: "图标",
            dataKey: "icon"
        }
    ]]);
    return resultData;
};
