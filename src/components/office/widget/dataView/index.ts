import {
    Component,
    declareComponent,
    IPropCheckRule,
    PropTypes
} from "elmer-ui-core";
import "./index.less";

type TypeOfficeDataViewColumnType = "Text" | "Progress" | "CheckBox" | "FromRender";

type TypeOfficeDataViewHeaderItem = {
    title?: string;
    dataKey?: string;
    colspan?: number;
    rowspan?: number;
    className?: string;
    style?: string;
    type?: TypeOfficeDataViewColumnType;
    render?: Function;
};

type TypeOfficeDataViewBodyItem = {
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
        data: TypeOfficeDataViewHeaderItem[][]
    },
    body: {
        pageSize?: number;
        page?: number;
        totalNums?: number;
        data: TypeOfficeDataViewBodyItem[][];
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
    jumpNums?: string;
};

export const createOfficeDataViewSource = (data: TypeOfficeDataViewData) => {
    return data;
};

export const createOfficeDataViewPager = (data:TypeOfficeDataViewPager) => (data);

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
            defaultValue: createOfficeDataViewSource({
                header: {
                    defineIndex: 1,
                    overrideBody: true,
                    data: [
                        [{
                            title: "序号",
                            colspan: 2,
                            className: "map"
                        }, {
                            title: "测试",
                            colspan: 2
                        }],
                        [
                            {
                                title: "AA",
                                render: () => {
                                    return "<input type='checkbox' />";
                                }
                            }, {
                                title: "BB"
                            }, {
                                title: "CC"
                            }, {
                                title: "DD",
                                type: "Progress"
                            }
                        ],
                    ]
                },
                body: {
                    data: [
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                        [{title: "A1"},{title: "A2"},{title: "A3"},{title: "A4"}],
                    ]
                }
            }),
            rule: PropTypes.object.isRequired
        },
        className: {
            description: "Dom style class name",
            defaultValue: "office_blue",
            rule: PropTypes.string.isRequired
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
        this.state.bodyData = this.getBodyData(props.data.body.data);
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
    private getBodyData(bodyData: TypeOfficeDataViewBodyItem[][]):any {
        const defineIndex = this.props.data.header.defineIndex;
        const defineHeader = this.props.data.header.data[defineIndex];
        let updateBodyData = [];
        if(defineHeader) {
            if(this.props.data.header.overrideBody) {
                for(let i=0,mLen=bodyData.length;i<mLen;i++) {
                    const bodyRowData = bodyData[i];
                    const updateBodyRow = [];
                    for(let j=0,rLen=bodyRowData.length;j<rLen;j++) {
                        const defineHeaderCol = defineHeader[j];
                        const dataKey = this.isEmpty(defineHeaderCol.dataKey) ? "title" : defineHeaderCol.dataKey;
                        if(typeof defineHeaderCol.render === "function") {
                            updateBodyRow.push({
                                title: defineHeaderCol.render(this.getValue(bodyRowData[j], dataKey)),
                                data: bodyRowData[j],
                                type: "FromRender"
                            });
                        } else {
                            updateBodyRow.push({
                                title: this.getValue(bodyRowData[j], dataKey),
                                data: bodyRowData[j],
                                type: "Text"
                            });
                        }
                    }
                    updateBodyData.push(updateBodyRow);
                }
            } else {
                updateBodyData = JSON.parse(JSON.stringify(bodyData));
            }
            return updateBodyData;
        } else {
            return JSON.parse(JSON.stringify(bodyData));
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
        const firstRow:HTMLTableRowElement = <any>bodyDom.firstChild;
        const colNums = firstRow.children.length;
        const headerData = this.state.data.header.data;
        for(let i=0,mLen=headerData.length;i < mLen; i++) {
            if(headerData[i].length === colNums) {
                for(let j=0;j<colNums - 1;j++) {
                    let colWidth = firstRow.children[j].clientWidth;
                    if(j>0) {
                        // colWidth += 1;
                    }
                    // if(!this.isEmpty(headerData[i][j].style)) {
                    //     headerData[i][j].style += "width:" + colWidth + "px";
                    // } else {
                    //     headerData[i][j].style = "width:" + colWidth + "px";
                    // }
                    this.state.columnSizeData[j].style="width:" + colWidth + "px";
                    this.state.columnSizeData[j].width=colWidth + "px";
                }
                break;
            }
        }
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
