import { Component, declareComponent, IElmerEvent,IPropCheckRule, propTypes } from "elmer-ui-core";
import "./index.less";

type PagerProps = {
    onChange: Function;
    theme: string;
    totalCount: number;
    page: number;
    pageSize: number;
    summeryVisible: boolean;
};

@declareComponent({
    selector: "pager"
})
export class PagerComponent extends Component<PagerProps> {
    static propType:any = {
        onChange: <IPropCheckRule>{
            description: "切换页面事件",
            rule: propTypes.func
        },
        theme: <IPropCheckRule>{
            defaultValue: "",
            description: "样式",
            rule: propTypes.string.isRequired
        },
        totalCount: <IPropCheckRule>{
            defaultValue: 0,
            description: "所有记录数量",
            rule: propTypes.number.isRequired
        },
        page:<IPropCheckRule>{
            defaultValue: 0,
            description: "当前页码",
            rule: propTypes.number.isRequired
        },
        pageSize:<IPropCheckRule>{
            defaultValue: 20,
            description: "当前页码",
            rule: propTypes.number.isRequired
        },
        summeryVisible: <IPropCheckRule>{
            defaultValue: true,
            description: "记录显示",
            rule: propTypes.bool.isRequired
        }
    };
    nextPage:number;
    prevPage:number;
    pageList:any[];
    pageCount: number = 0;
    allCount:number = 0;
    page: number = 0;
    theme: string = "";
    private pageSize:number = 20;
    constructor(props:any) {
        super(props);
        this.pageSize = props.pageSize;
        this.allCount = props.totalCount;
        this.page = props.page;
        this.initData();
    }
    $onPropsChanged(props:any): void {
        this.pageSize = props.pageSize;
        this.allCount = props.totalCount;
        this.page = props.page;
        this.initData(true);
    }
    initData(updateData?: boolean): void {
        const allCount = this.allCount > 0 ? this.allCount : 1;
        const pageSize = this.pageSize > 0 ? this.pageSize : 10;
        const pageCount = Math.ceil(allCount / pageSize);
        const page = this.page > 0 && this.page < pageCount ? this.page : (pageCount <= 0 ? 1 : pageCount);
        let $btnStartPage = Math.floor(page / 10) * 10;
        const pageList = [];
        let prevPage = -1;
        let nextPage = -1;
        if (page > 5 && page % 10 === 0) { $btnStartPage = $btnStartPage - 1; }
        for (let i = $btnStartPage; i < $btnStartPage + 10; i++) {
            if (i + 1 <= pageCount) {
                if($btnStartPage + 10 < pageCount && i === $btnStartPage + 10 - 2) {
                    pageList.push({
                        value: "...",
                        theme: "disabledItem"
                    });
                } else {
                    pageList.push({
                        value: i + 1,
                        theme: ""
                    });
                }
            }
        }
        if (page > 1) {
            prevPage = page - 1;
        }
        if (page < pageCount) {
            nextPage = page + 1;
        }
        if(updateData) {
            this.setData({
                nextPage,
                prevPage,
                pageList,
                pageCount
            },true);
        } else {
            this.nextPage =  nextPage;
            this.prevPage =  prevPage;
            this.pageList =  pageList;
            this.pageCount =  pageCount;
        }
    }
    onChangeItem(evt:IElmerEvent): void {
        const data = evt.data.item;
        if (!isNaN(data.value) && this.page !== data.value) {
            this.page = data.value;
            this.initData(true);
            typeof this.props.onChange === "function" && this.props.onChange(this.page, this.pageSize);
        }
    }
    onGotoNextPage(evt:IElmerEvent): void {
        const toPage:number = parseInt(evt.target.getAttribute("data-page"),10);
        const dataTag = evt.target.getAttribute("data-tag");
        if (toPage > 0 && toPage <= this.pageCount) {
            this.page = toPage;
            this[dataTag] = toPage;
            this.initData(true);
            typeof this.props.onChange === "function" && this.props.onChange(this.page, this.pageSize);
        }
    }
    render(): string {
        return require("./index.html");
    }

}
