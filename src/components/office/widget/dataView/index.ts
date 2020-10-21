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
    isCodeTitle?: boolean;
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
export type TypeOfficeDataViewPager = {
    position?: string;
    page: number;
    pageSize: number;
    totalPage: number;
    totalNums: number;
};

type TypeOfficeDataViewProps = {
    data: any[];
    defineIndex: number;
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
    data?: any[],
    className?: string;
    outStyle: string;
    tableStyle: string;
    pager?: TypeOfficeDataViewPager;
    tBodyStyle?: string;
    columnSizeData: any[],
    bodyData?: TypeOfficeDataViewBodyItem[],
    headerData?: TypeOfficeDataViewHeaderItem[],
    jumpNums?: string;
    updateTime?: string;
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
            rule: PropTypes.array.isRequired
        },
        defineIndex: {
            description: "Set the header mapping index",
            defaultValue: 0,
            rule: PropTypes.number.isRequired
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
    private bodyHeight: number = 0;
    private isInitSize: boolean = false;
    private defaultPagerPosition: string = "页码 {{page}}/{{totalPage}} 每页 {{pageSize}} 共 {{totalNums}} 条数据";

    constructor(props:TypeOfficeDataViewProps) {
        super(props);
        this.state.className = props.className;
        this.state.tableStyle = !this.isEmpty(props.tableWidth) ? "min-width:" + props.tableWidth +";": "width:100%;";
        this.state.outStyle = this.getOutStyle();
        this.tableId = this.getRandomID();
        this.tableViewId = this.getRandomID();
        this.tablePagerId = this.getRandomID();
        this.tableHeaderId = this.getRandomID();
        this.tableBodyId = this.getRandomID();
        this.state.bodyData = this.getBodyData(props.data);
        this.state.headerData = <any>props.columns;
        this.state.data = props.data;
        this.state.updateTime = (new Date()).getTime().toString();
        if(props.pager) {
            this.state.pager = props.pager;
            if(!this.isEmpty(props.pager.position)) {
                this.defaultPagerPosition = props.pager.position;
            }
            const sourceLength:number = props.pager.totalNums;
            this.state.pager.pageSize = props.pager.pageSize > 0 ? props.pager.pageSize : 20;
            this.state.pager.page = props.pager.page > 0 ? props.pager.page : 1;
            if(props.pager.totalNums <= sourceLength) {
                this.state.pager.totalNums = sourceLength;
                this.state.pager.totalPage = this.state.pager.totalPage > 0 ? this.state.pager.totalPage : Math.ceil(sourceLength / this.state.pager.pageSize);
            }
            this.state.pager.position = this.getPagerPosition(this.state.pager);
        } else {
            const dPageSize = 10;
            const totalNums:number = props.data.length;
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
        this.initColumnData();
    }
    onFirstClick(): void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        if(myPager.page !== 1) {
            myPager.page = 1;
            myPager.position = this.getPagerPosition(myPager);
            const evtData = {
                pagination: myPager,
                update: true
            };
            typeof this.props.onPageChange === "function" && this.props.onPageChange(evtData);
            if(evtData.update) {
                this.setState({
                    pager: myPager,
                    bodyData: [],
                    data: []
                });
            }
        }
    }
    onPrevClick():void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        const savePage = myPager.page;
        myPager.page = myPager.page - 1 > 0 ? myPager.page - 1 : 1;
        if(myPager.page !== savePage) {
            myPager.position = this.getPagerPosition(myPager);
            const evtData = {
                pagination: myPager,
                update: true
            };
            typeof this.props.onPageChange === "function" && this.props.onPageChange(evtData);
            if(evtData.update) {
                this.setState({
                    pager: myPager,
                    bodyData: [],
                    data: []
                });
            }
        }
    }
    onNextClick():void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        const savePage = myPager.page;
        myPager.page = myPager.page + 1 <= myPager.totalPage ? myPager.page + 1 : myPager.totalPage;
        if(myPager.page !== savePage) {
            myPager.position = this.getPagerPosition(myPager);
            const evtData = {
                pagination: myPager,
                update: true
            };
            typeof this.props.onPageChange === "function" && this.props.onPageChange(evtData);
            if(evtData.update) {
                this.setState({
                    pager: myPager,
                    bodyData: [],
                    data: []
                });
            }
        }
    }
    onLastClick(): void {
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        const savePage = myPager.page;
        if(savePage !== myPager.totalPage) {
            myPager.page = myPager.totalPage;
            myPager.position = this.getPagerPosition(myPager);
            const evtData = {
                pagination: myPager,
                update: true
            };
            typeof this.props.onPageChange === "function" && this.props.onPageChange(evtData);
            if(evtData.update) {
                this.setState({
                    pager: myPager,
                    bodyData: [],
                    data: []
                });
            }
        }
    }
    OnGotoClick(): void {
        const jump = this.isNumeric(this.state.jumpNums) ? parseInt(this.state.jumpNums, 10) : 1;
        const myPager:TypeOfficeDataViewPager = JSON.parse(JSON.stringify(this.state.pager));
        if(myPager.page !== jump) {
            myPager.page = jump;
            myPager.position = this.getPagerPosition(myPager);
            const evtData = {
                pagination: myPager,
                update: true
            };
            typeof this.props.onPageChange === "function" && this.props.onPageChange(evtData);
            if(evtData.update) {
                this.setState({
                    pager: myPager,
                    bodyData: [],
                    data: []
                });
            }
        }
    }
    $didMount(): void {
        const outDom:HTMLDivElement = this.dom[this.tableViewId];
        const tableHeadDom:HTMLElement = this.dom[this.tableHeaderId];
        const pagerDom: HTMLDivElement = this.dom[this.tablePagerId];
        const tableWidthStyle = !this.isEmpty(this.props.tableWidth) ? "min-width:" + this.props.tableWidth +";": "width:100%;";
        const outHeight = outDom.clientHeight;
        const pagerHeight = pagerDom.clientHeight;
        const tableHeight = outHeight - pagerHeight;
        const tableHeaderHeight = tableHeadDom.clientHeight;
        const tableHeightStyle = "";// "height:" + tableHeight + "px;";
        const updateState:any = {};
        this.bodyHeight = tableHeight - tableHeaderHeight;
        updateState.tableStyle = tableWidthStyle + tableHeightStyle;
        updateState.tBodyStyle = "height:" + (tableHeight - tableHeaderHeight) + "px;overflow-y: auto;";
        if(this.props.data && tableHeight - tableHeaderHeight > this.props.data.length * 30) {
            updateState.bodyData = this.getBodyData(this.props.data);
        }
        this.setState(updateState);
    }
    $willReceiveProps(props:TypeOfficeDataViewProps): void {
        const bodyData = this.getBodyData(props.data);
        const updateState = {
            bodyData,
            data: props.data,
            updateTime: (new Date()).getTime()
        };
        if(props.pager && props.pager.pageSize > 0) {
            this.state.pager = createOfficeDataViewPager({
                position: this.getPagerPosition({
                    page: props.pager.page,
                    pageSize: props.pager.pageSize,
                    totalNums: props.pager.totalNums,
                    totalPage: props.pager.totalPage,
                }),
                page: props.pager.page,
                pageSize: props.pager.pageSize,
                totalNums: props.pager.totalNums,
                totalPage: props.pager.totalPage,
            });
        }
        this.setState(updateState);
    }
    private getBodyData(bodyData: any[]):any {
        if(this.props.data && this.props.columns) {
            const defineIndex = this.props.defineIndex;
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
                                        events: defineHeaderCol.events,
                                        style: defineHeaderCol.style,
                                        rowspan: 1,
                                        colspan: 1,
                                        data: rowData
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
                                            events: defineHeaderCol.events,
                                            style: defineHeaderCol.style,
                                            rowspan: 1,
                                            colspan: 1,
                                            data: rowData
                                        });
                                    } else if(defineHeaderCol.type === "CheckBox") {
                                        const checkValue = colValue ? "true" : "false";
                                        bodyLineData.push({
                                            type: "Code",
                                            value: `<eui-checkbox checked="{{${checkValue}}}"/>`,
                                            events: defineHeaderCol.events,
                                            style: defineHeaderCol.style,
                                            rowspan: 1,
                                            colspan: 1,
                                            data: rowData
                                        });
                                    } else {
                                        bodyLineData.push({
                                            type: "Text",
                                            value: colValue,
                                            rowspan: 1,
                                            colspan: 1,
                                            style: defineHeaderCol.style
                                        });
                                    }
                                }
                            }
                        }
                        updateBodyData.push(bodyLineData);
                    }
                    if(bodyData.length * 30 < this.bodyHeight) {
                        const maxLen = Math.ceil((this.bodyHeight - bodyData.length * 30) / 30) + 1;
                        for(let i=0;i<maxLen;i++) {
                            const bodyLine = [];
                            for(let col = 0; col < defineHeader.length; col++) {
                                bodyLine.push({
                                    type: "Code",
                                    colspan: 1,
                                    rowspan: 1,
                                    style: defineHeader[col].style,
                                    value: "<span data-type='html'>&nbsp;&nbsp;</span>"
                                });
                            }
                            updateBodyData.push(bodyLine);
                        }
                    }
                } else {
                    updateBodyData.push([{
                        type: "Code",
                        colspan: defineHeader.length,
                        rowspan: 1,
                        style: "height: 100px;",
                        className: "dataViewEmptyLine",
                        value: "<label><eui-icon type='fa-trash-o'/><span>没有更多数据了</span></label>"
                    }]);
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
        const bodyData = this.state.data;
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
    private getPagerPosition(pagerData: TypeOfficeDataViewPager):string {
        let pStr = this.defaultPagerPosition || "";
        pStr = pStr.replace(/\{\{page\}\}/g, this.getValue(pagerData, "page") || "");
        pStr = pStr.replace(/\{\{pageSize\}\}/g, this.getValue(pagerData, "pageSize") || "");
        pStr = pStr.replace(/\{\{totalNums\}\}/g, this.getValue(pagerData, "totalNums") || "");
        pStr = pStr.replace(/\{\{totalPage\}\}/g, this.getValue(pagerData, "totalPage") || "");

        return pStr;
    }
    private getOutStyle():string {
        const mStyles = [];
        !this.isEmpty(this.props.width) && mStyles.push("width:" + this.props.width);
        !this.isEmpty(this.props.height) && mStyles.push("height:" + this.props.height);
        return mStyles.join(";") + ";";
    }

}
