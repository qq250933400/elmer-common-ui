import { autowired, Component, declareComponent, ElmerDOM, ElmerServiceRequest, IElmerEvent } from "elmer-ui-core";
import { createOfficeDataViewHeader, createOfficeDataViewSource } from "../components/office/widget/dataView";

@declareComponent({
    selector: "index",
    withRouter: true,
    // template: {
    //     url: "./views/test.html",
    //     fromLoader: true
    // },
    connect: {
        mapStateToProps: (state:any) => {
            return {};
        }
    }
})
export class IndexComponent extends Component {
    dataSource = createOfficeDataViewSource({
        header: {
            defineIndex: 1
        },
        body: {
            data: []
        }
    });
    dataColumns = createOfficeDataViewHeader( [
        [
            {title: "表格标题", colspan: 3}
        ],
        [
            {title: "全选", render: ()=>{
                return "<eui-checkbox />";
            }},
            { title: "标题", dataKey: "title" },
            { title: "进度", dataKey: "value", type: "Progress" }
        ]]
    );
    constructor(props:any) {
        super(props);
        console.log(this.dataSource);
    }
    $init(): void {
        for(let i=0;i<100;i++) {
            this.dataSource.body.data.push({
                aaa: "ccc",
                title: "ccc" + i,
                value: i % 100
            });
        }
        console.log(this.dataSource.header);
    }
    render():any {
        return require("./views/test.html");
    }
}
