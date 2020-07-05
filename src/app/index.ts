import { autowired, Component, declareComponent, ElmerDOM, ElmerServiceRequest, IElmerEvent } from "elmer-ui-core";
import { createOfficeDataViewHeader } from "../components/office/widget/dataView";

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
    // tslint:disable-next-line: typedef
    dataColumns = createOfficeDataViewHeader( [
        [
            {title: "表格标题", colspan: 3}
        ],
        [
            {title: "<eui-checkbox help='{{true}}' et:onChange='props.onTitleCheckBoxChange'/>", render: ()=>{
                return "<eui-checkbox />";
            },
            isCodeTitle: true,
            events: {
                showProps: true,
                onTitleCheckBoxChange: (checked) => {
                    console.log(checked);
                }
            }
        },
            { title: "标题", dataKey: "title" },
            { title: "进度", dataKey: "value", type: "Progress" }
        ]]
    );
    constructor(props:any) {
        super(props);
    }
    render():any {
        // return require("./views/router.html");
        return "<span>aaa</span>";
    }
}
