import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";
import "./index.less";

type TableProps = {
    theme: string;
    columns: any[];
    data: any;
    startIndex: number;
    noDataText: string;
    owner: any;
}

@declareComponent({
    selector: "table"
})
export class TableComponent extends Component<TableProps> {
    static propType: any = {
        theme: <IPropCheckRule> {
            defaultValue: "",
            description: "样式类名",
            rule: propTypes.string.isRequired
        },
        columns: <IPropCheckRule> {
            description: "显示字段",
            rule: propTypes.array.isRequired
        },
        data:<IPropCheckRule> {
            description: "数据源",
            rule: propTypes.array.isRequired
        },
        startIndex: <IPropCheckRule> {
            defaultValue: 0,
            description: "开始需要",
            rule: propTypes.number.isRequired
        },
        noDataText: <IPropCheckRule> {
            defaultValue: "没有更多数据",
            description: "没有数据的提示文本",
            rule: propTypes.string.isRequired
        },
        owner: <IPropCheckRule> {
            description: "自定义元素事件执行对象",
            rule: propTypes.any
        }
    };
    state:any = {
        theme: "",
        columns: {
            header: [],
            colsGroup: [],
            dataKeys: []
        },
        columnsData: [],
        bodyData: [],
        resourceData: [],
        columnsLength: 0,
        exProps: {},
        allCount: 0
    };
    constructor(props: any) {
        super(props);
        this.state.theme = !this.isEmpty(props.theme) ? props.theme : "";
        this.state.columns = this.formatColumns(props.columns);
        this.state.columnsData = props.columns;
        this.state.bodyData = this.formatRows(props.data, this.state.columns.header);
        this.state.resourceData = props.data;
        this.state.columnsLength = this.state.columns.header.length;
        this.state.allCount = (props.data ||[]).length;
    }
    $onPropsChanged(props:any): void {
        const updateState:any = {};
        if(JSON.stringify(props.columns) !== JSON.stringify(this.state.columnsData)) {
            updateState.columns = this.formatColumns(props.columns);
            updateState.columnsData = props.columns;
            updateState.bodyData = this.formatRows(props.data, updateState.columns.header);
            updateState.columnsLength = updateState.columns.header.length;
            updateState.allCount = updateState.bodyData.length;
            updateState.resourceData = props.data;
        } else {
            if(JSON.stringify(props.data) !== JSON.stringify(this.state.resourceData)) {
                updateState.bodyData = this.formatRows(props.data, this.state.columns.header);
                updateState.allCount = updateState.bodyData.length;
                updateState.resourceData = props.data;
            }
        }
        if(Object.keys(updateState).length>0) {
            this.setState(updateState);
        }
    }
    render(): string {
        return require("./views/index.html");
    }
    private formatRows(data:any[], dataHeader:any[]):any[] {
        const bodyData = data || [];
        const resultData = [];
        const keysLen = dataHeader.length;
        const startIndex = this.props.startIndex > 0 ? this.props.startIndex : 0;
        for(let i=0,cLen=bodyData.length;i<cLen;i++) {
            const tmpRowData = {
                index: i + startIndex,
                items: []
            };
            const tmpData = bodyData[i];
            for(let j=0;j<keysLen;j++) {
                const tmpHeader = dataHeader[j];
                const tmpKey = tmpHeader.dataKey;
                tmpRowData.items.push({
                    dataType: typeof tmpHeader.render === "function" ? "code" : tmpHeader.dataType,
                    data: tmpData[tmpKey],
                    dataSource: tmpData,
                    code: typeof tmpHeader.render === "function" ? tmpHeader.render(tmpData, tmpData[tmpKey]) : "",
                    props: tmpHeader.props,
                    style: tmpHeader.style || "",
                    className: tmpHeader.className,
                    propsType: this.getType(tmpHeader.props)
                });
            }
            resultData.push(tmpRowData);
        }

        return resultData;
    }
    private formatColumns(columnsData:any[]): object {
        const columns = columnsData || [];
        const columnColGroups = [];
        const columnHeader = [];
        const columnDataKeys = [];
        for(let i=0,cLen=columns.length;i<cLen;i++) {
            const tmpColumnData = columns[i];
            if(this.isEmpty(tmpColumnData.dataKey)) {
                // tslint:disable-next-line:no-console
                console.error("Columns必须设置dataKey字段，指定显示数据", tmpColumnData);
            }
            columnHeader.push({
                autoDefined: tmpColumnData.codeTitle,
                title: tmpColumnData.title,
                dataKey: tmpColumnData.dataKey,
                dataType: tmpColumnData.dataType,
                render: tmpColumnData.render,
                props: tmpColumnData.props,
                style: tmpColumnData.style || "",
                className: tmpColumnData.className || "",
                width: !this.isEmpty(tmpColumnData.width) ? tmpColumnData.width : "auto"
            });
            columnColGroups.push({
                width: !this.isEmpty(tmpColumnData.width) ? tmpColumnData.width : "auto"
            });
        }
        return {
            header: columnHeader,
            colsGroup: columnColGroups,
            dataKeys: columnDataKeys
        };
    }
}
