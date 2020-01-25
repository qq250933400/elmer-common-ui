import { Component, declareComponent, IElmerEvent } from "elmer-ui-core";
import { IAdminMenuData, eAlert } from "../components";

@declareComponent({
    selector: "admin"
})
export class AdminComponent extends Component {
    allCount: number = 1500;
    page: number = 1;
    data: any[] = [
        {
            title: "首页",
            icon: "fa-home",
            url: "#",
            hasIcon: true,
            dataKey: "title",
            width: "60",
            items: [
                {
                    title: "测试菜单1",
                    icon: "fa-gear",
                    url: "#"
                },{
                    title: "测试菜单2",
                    icon: "fa-gear",
                    url: "#"
                },{
                    title: "测试菜单3",
                    icon: "fa-gear",
                    url: "#"
                }
            ]
        },{
            title: "用户管理",
            icon: "fa-home",
            url: "#",
            hasIcon: true,
            dataKey: "index",
            props:{
                testData:[
                    {title: "hahah1", value: 0},
                    {title: "hahah2", value: 1},
                    {title: "hahah3", value: 2},
                    {title: "hahah4", value: 3},
                    {title: "hahah5", value: 4},
                ]
            },
            render: (data:any, index:string) => {
                const checkIndex = data.checkedIndex || 0;
                const code = `<eui-drop-down style="z-index:${index};" em:data='this.props.testData' tabIndex='{{${index}}}' value='{{${checkIndex}}}'/>`;
                return code;
            }
        },{
            title: "菜单管理",
            icon: "fa-home",
            url: "#",
            hasIcon: true,
            dataKey: "action",
            items: [
                {
                    title: "测试菜单1",
                    icon: "fa-gear",
                    url: "#"
                },{
                    title: "测试菜单2",
                    icon: "fa-gear",
                    url: "#"
                },{
                    title: "测试菜单3",
                    icon: "fa-gear",
                    url: "#"
                }
            ]
        },{
            title: "操作",
            dataKey: "items",
            props: {
                onClick: ()=>{
                    const newData = JSON.parse(JSON.stringify(this.tableData));
                    newData[0].title = "修改内容" + (new Date()).getTime();
                    newData[0].desc  = "修改Desc" + (new Date()).getTime();
                    newData[0].checkedIndex = 2;
                    this.setData({
                        tableData: newData
                    });
                }
            },
            render: () => {
                return "<button et:click='props.onClick'>哈哈哈</button>";
            }
        }
    ];
    tableData:any = [

    ];
    region: string[] = ["340000","340200","340202"];
    menuWidth: number = 60;
    tableColumns: any[] = [
        { title: "<input type='checkbox' et:change='props.onAllChange'>", dataKey: "index", codeTitle: true,
            props: {
                onAllChange: (evt:IElmerEvent) => {
                    const checked = (<HTMLInputElement>evt.target).checked;
                    const data:any[] = JSON.parse(JSON.stringify(this.tableData || []));
                    data.map((tmpData: any) => {
                        tmpData.checked = checked;
                    });
                    this.setData({
                        tableData: data
                    });
                }
            },
            render: (data, index) => {
            const checked = data.checked ? "checked='checked'" : "";
            return `<input id='${index}' type='checkbox' ${checked}/>`;
        }},
        { title: "title", dataKey: "title"},
        { title: "desc", dataKey: "desc"},
        { title: "action", dataKey: "action"}
    ];
    bottomHtml: string = `<button class='eui-button eui-button-primary' data-value="dataSet testting" et:click="props.exprops.onClick">BtnTestting</button>`;
    bottomProps:any = {
        onClick: (evt) => {
            console.log(evt);
        },
        handleOnSetValue:(evt) => {
            this.state.dataLength = evt.value;
            return evt.value;
        }
    };
    calendarData: any = {
        showTimePicker: true
    };
    constructor(props:any) {
        super(props);
        for(let i=0;i<20;i++) {
            this.tableData.push({
                title: "测试项目" + i,
                desc: "描述2" + i,
                action: "++52",
                index: i + 1,
                items: []
            });
        }
    }
    handleUpdateData():void {
        const val = this.state.dataLength || 0;
        const maxLen = parseInt(val, 10);
        if(maxLen > 0) {
            const newData = [];
            for(let i=0;i<maxLen;i++) {
                const tmpTime = (new Date()).getTime();
                newData.push({
                    title: "测试项目" + i,
                    desc: "描述2" + tmpTime,
                    action: "++52",
                    index: i + 1,
                    items: []
                });
            }
            console.time("DataRenderTest");
            this.setData({
                tableData: newData
            });
            console.timeEnd("DataRenderTest");
        } else {
            this.setData({
                tableData: []
            });
            console.log(maxLen, "NoneData");
        }
    }
    onBottomClick(): void {
        console.log("--------------");
    }
    onModeChange(evt:IElmerEvent): void {
        if(evt.data) {
            this.setData({
                menuWidth: 200
            });
        } else {
            this.setData({
                menuWidth: 60
            });
        }
    }
    render(): string {
        return require("./views/admin.html");
    }
}
