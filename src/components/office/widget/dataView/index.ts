import {
    Component,
    declareComponent,
    IPropCheckRule,
    PropTypes
} from "elmer-ui-core";
import "./index.less";

type TypeOfficeDataViewColumnType = "Text" | "Progress" | "CheckBox" | "FromRender";

export type TypeOfficeDataViewHeaderItem = {
    title?: string;
    dataKey?: string;
    colspan?: number;
    rowspan?: number;
    className?: string;
    style?: string;
    type?: TypeOfficeDataViewColumnType;
    render?: Function;
    minKey?: string;
    maxKey?: string;
    max?: number;
    min?: number;
    events?: any;
};

export type TypeOfficeDataViewBodyItem = {
    title?: string;
    data?: any;
    style?: string;
    className?: string;
    min?: number;
    max?: number;
    value?: any;
};

type TypeOfficeDataViewData = {
    header: {
        rows?: number;
        defineIndex?: number;
        overrideBody?: boolean;
    },
    body: {
        pageSize?: number;
        page?: number;
        totalNums?: number;
        data: any[];
    }
};
type TypeOfficeDataViewPager = {
    position?: string;
    page: number;
    pageSize: number;
    totalPage: number;
    totalNums: number;
};

type TypeOfficeDataViewProps = {
    data: TypeOfficeDataViewData;
    className: string;
    columns: TypeOfficeDataViewHeaderItem[][];
    width: string;
    height: string;
    tableWidth: string;
    pager: TypeOfficeDataViewPager;
    onPageChange: Function;
};

type TypeOfficeDataViewPropsRule = {[P in keyof TypeOfficeDataViewProps]: IPropCheckRule};

type TypeOfficeDataViewState = {
    data?: TypeOfficeDataViewData,
    className?: string;
    outStyle: string;
    tableStyle: string;
    pager?: TypeOfficeDataViewPager;
    tBodyStyle?: string;
    columnSizeData: any[],
    bodyData?: TypeOfficeDataViewBodyItem[],
    headerData?: TypeOfficeDataViewHeaderItem​​[],
    jumpNums?: string;
};

export const createOfficeDataViewSource = (data: TypeOfficeDataViewData) => {
    return data;
};

export const createOfficeDataViewPager = (data:TypeOfficeDataViewPager) => (data);

export const createOfficeDataViewHeader = (data: TypeOfficeDataViewHeaderItem[][]) => data;

@declareComponent({
    selector: "OfficeDataView",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export default class OfficeDataView extends Component {
    static propType:TypeOfficeDataViewPropsRule = {
        data: {
            description: "Data Source",
            rule: PropTypes.object.isRequired
        },
        className: {
            description: "Dom style class name",
            defaultValue: "office_blue",
            rule: PropTypes.string.isRequired
        },
        columns: {
            description: "标题",
            defaultValue: [],
            rule: PropTypes.array.isRequired
        },
        width: {
            description: "Widget width",
            defaultValue: "",
            rule: PropTypes.string.isRequired
        },
        height: {
            description: "Widget height",
            defaultValue: "250px",
            rule: PropTypes.string.isRequired
        },
        pager: {
            description: "分页数据",
            rule: PropTypes.object
        },
        tableWidth: {
            description: "Data table width",
            defaultValue: "",
            rule: PropTypes.string
        },
        onPageChange: {
            description: "切换页面事件",
            rule: PropTypes.func
        }
    };
    props: TypeOfficeDataViewProps;
    state: TypeOfficeDataViewState = {
        outStyle: "",
        tableStyle: "width: 100%;",
        columnSizeData: [],
        pager: createOfficeDataViewPager({
            position: "页码{{page}}/{{totalPage}} 每页{{pageSize}}共{{totalPage}}页",
            page: 1,
            pageSize: 20,
            totalNums: 1,
            totalPage: 1
        }),
        bodyData: []
    };
    tableId: string;
    tableViewId: string;
    tablePagerId: string;
    tableHeaderId: string;
    tableBodyId: string;
    private isInitSize: boolean = false;
    private defaultPagerPosition: string = "页码 {{page}}/{{totalPage}} 每页 {{pageSize}} 共 {{totalNums}} 条数据";

    constructor(props:TypeOfficeDataViewProps) {
        super(props);
        this.state.className = props.className;
        this.state.tableStyle = !this.isEmpty(props.tableWidth) ? "width:" + props.tableWidth +";": "width:100%;";
        this.state.outStyle = this.getOutStyle();
        this.tableId = this.getRandomID();
        this.tableViewId = this.getRandomID();
        this.tablePagerId = this.getRandomID();
        this.tableHeaderId = this.getRandomID();
        this.tableBodyId = this.getRandomID();
        this.state.bodyData = this.getBodyData(this.getValue(props, "data.body.data"));
        this.state.headerData = JSON.parse(JSON.stringify(props.columns));
        console.clear();
        console.log(props.columns);
        if(props.pager) {
            this.state.pager = props.pager;
            if(!this.isEmpty(props.pager.position)) {
                this.defaultPagerPosition = props.pager.position;
            }
            const sourceLength:number = this.getValue(props,"data.body.data.length");
            this.state.pager.pageSize = props.pager.pageSize > 0 ? props.pager.pageSize : 20;
            this.state.pager.page = props.pager.page > 0 ? props.pager.page : 1;
            if(props.pager.totalNums < sourceLength) {
                this.state.pager.totalNums = sourceLength;
                this.state.pager.totalPage = Math.ceil(sourceLength / this.state.pager.pageSize);
            }
            this.state.pager.position = this.getPagerPosition(this.state.pager);
        } else {
            const dPageSize = 10;
            const totalNums:number = this.getValue(props,"data.body.data.length");
            const totalPage = Math.ceil(totalNums/dPageSize);
            this.state.pager = createOfficeDataViewPager({
                position: this.getPagerPosition({
                    page: 1,
                    pageSize: dPageSize,
                    totalNums,
                    totalPage,
                }),
                page: 1,
                pageSize: dPageSize,
                totalNums,
                totalPage
            });
        }
        this.state.data = props.data;
        this.initColumnData();
    }
    onFirstClick(): void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        myPager.page = 1;
        myPager.position = this.getPagerPosition(myPager);
        this.setState({
            pager: myPager
        });
    }
    onPrevClick():void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        myPager.page = myPager.page - 1 > 0 ? myPager.page - 1 : 1;
        myPager.position = this.getPagerPosition(myPager);
        this.setState({
            pager: myPager
        });
    }
    onNextClick():void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        myPager.page = myPager.page + 1 <= myPager.totalPage ? myPager.page + 1 : myPager.totalPage;
        myPager.position = this.getPagerPosition(myPager);
        this.setState({
            pager: myPager
        });
    }
    onLastClick(): void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        myPager.page = myPager.totalPage;
        myPager.position = this.getPagerPosition(myPager);
        this.setState({
            pager: myPager
        });
    }
    OnGotoClick(): void {
        const jump = this.isNumeric(this.state.jumpNums) ? parseInt(this.state.jumpNums, 10) : 1;
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        myPager.page = jump;
        myPager.position = this.getPagerPosition(myPager);
        this.setState({
            pager: myPager
        });
    }
    $after(): void {
        if(!this.isInitSize) {
            const outDom:HTMLDivElement = this.dom[this.tableViewId];
            const tableHeadDom:HTMLElement = this.dom[this.tableHeaderId];
            const pagerDom: HTMLDivElement = this.dom[this.tablePagerId];
            const tableWidthStyle = !this.isEmpty(this.props.tableWidth) ? "width:" + this.props.tableWidth +";": "width:100%;";
            const outHeight = outDom.clientHeight;
            const pagerHeight = pagerDom.clientHeight;
            const tableHeight = outHeight - pagerHeight;
            const tableHeaderHeight = tableHeadDom.clientHeight;
            const tableHeightStyle = "height:" + tableHeight + "px;";
            this.isInitSize = true;
            this.initHeaderStyle();
            this.setState({
                tableStyle: tableWidthStyle + tableHeightStyle,
                tBodyStyle: "height:" + (tableHeight - tableHeaderHeight) + "px;overflow-y: auto;"
            });
        }
    }
    private getBodyData(bodyData: any[]):any {
        if(this.props.data && this.props.data.header) {
            const defineIndex = this.props.data.header.defineIndex || 0;
            const defineHeader = this.props.columns[defineIndex];
            const updateBodyData = [];
            if(defineHeader) {
                // console.log(defineHeader, "");
                // 解析body数据
                if(bodyData && bodyData.length>0) {
                    for(let row = 0;row < bodyData.length; row ++) {
                        const rowData = bodyData[row];
                        const bodyLineData = [];
                        for(let col = 0; col < defineHeader.length; col++) {
                            const defineHeaderCol = defineHeader[col];
                            if(defineHeaderCol) {
                                const colValue = this.getValue(rowData, defineHeaderCol.dataKey);
                                if(typeof defineHeaderCol.render === "function") {
                                    bodyLineData.push({
                                        type: "Code",
                                        value: defineHeaderCol.render(colValue, rowData),
                                        events: defineHeaderCol.events
                                    });
                                } else {
                                    if(defineHeaderCol.type === "Progress") {
                                        let min = !this.isEmpty(defineHeaderCol.minKey) ? this.getValue(rowData,defineHeaderCol.minKey) : 0;
                                        let max = !this.isEmpty(defineHeaderCol.maxKey) ? this.getValue(rowData,defineHeaderCol.maxKey) : 0;
                                        if(defineHeaderCol.max > 0) {
                                            min = defineHeaderCol.min;
                                            max = defineHeaderCol.max;
                                        }
                                        bodyLineData.push({
                                            type: "Code",
                                            value: `<eui-progress value="${colValue}" min="${min}" max="${max}"/>`,
                                            events: defineHeaderCol.events
                                        });
                                    } else if(defineHeaderCol.type === "CheckBox") {
                                        const checkValue = colValue ? "true" : "false";
                                        bodyLineData.push({
                                            type: "Code",
                                            value: `<eui-checkbox checked="{{${checkValue}}}"/>`,
                                            events: defineHeaderCol.events
                                        });
                                    } else {
                                        bodyLineData.push({
                                            type: "Text",
                                            value: colValue
                                        });
                                    }
                                }
                            }
                        }
                        updateBodyData.push(bodyLineData);
                    }
                }
                return updateBodyData;
            } else {
                return JSON.parse(JSON.stringify(bodyData));
            }
        } else {
            // tslint:disable-next-line: no-console
            console.error(`未设置数据表标题[${this["selector"]}]`);
        }
    }
    private initColumnData():void {
        const bodyData = this.state.data.body.data;
        const columNums = bodyData.length;
        const result = [];
        for(let i=0;i<columNums;i++) {
            result.push({
                style: "width:auto;",
                width: "auto"
            });
        }
        this.state.columnSizeData = result;
    }
    private initHeaderStyle():void {
        const bodyDom:HTMLElement = this.dom[this.tableBodyId];
        // const firstRow:HTMLTableRowElement = <any>bodyDom.firstChild;
        // const colNums = firstRow.children.length;
        // const headerData = this.state.data.header.data;
        // for(let i=0,mLen=headerData.length;i < mLen; i++) {
        //     if(headerData[i].length === colNums) {
        //         for(let j=0;j<colNums - 1;j++) {
        //             let colWidth = firstRow.children[j].clientWidth;
        //             if(j>0) {
                        // colWidth += 1;
                    // }
                    // if(!this.isEmpty(headerData[i][j].style)) {
                    //     headerData[i][j].style += "width:" + colWidth + "px";
                    // } else {
                    //     headerData[i][j].style = "width:" + colWidth + "px";
                    // }
        //             this.state.columnSizeData[j].style="width:" + colWidth + "px";
        //             this.state.columnSizeData[j].width=colWidth + "px";
        //         }
        //         break;
        //     }
        // }
        //this.state.data.header.data = headerData;
    }
    private getPagerPosition(pagerData: TypeOfficeDataViewPager):string {
        let pStr = this.defaultPagerPosition || "";
        pStr = pStr.replace(/\{\{page\}\}/g, this.getValue(pagerData, "page"));
        pStr = pStr.replace(/\{\{pageSize\}\}/g, this.getValue(pagerData, "pageSize"));
        pStr = pStr.replace(/\{\{totalNums\}\}/g, this.getValue(pagerData, "totalNums"));
        pStr = pStr.replace(/\{\{totalPage\}\}/g, this.getValue(pagerData, "totalPage"));

        return pStr;
    }
    private getOutStyle():string {
        const mStyles = [];
        !this.isEmpty(this.props.width) && mStyles.push("width:" + this.props.width);
        !this.isEmpty(this.props.height) && mStyles.push("height:" + this.props.height);
        return mStyles.join(";") + ";";
    }

}
