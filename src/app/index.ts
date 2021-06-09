import { autowired, Component, declareComponent, ElmerDOM, ElmerServiceRequest, IElmerEvent } from "elmer-ui-core";
import { createRegionPicker, TypeRegionPicker } from "../components/mobile/mobileSelect/RegionPicker";
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
    showSelect: boolean = false;
    listData:any[] = [];
    constructor(props:any) {
        super(props);
        const listData = [];
        const sData = [];
        for(let i=0;i<50;i++) {
            listData.push({
                title: "测试项目" + i,
                value: "for test item" + i
            });
        }
        this.listData.push(listData);
        // this.listData.push(sData);
    }
    onMobileSelectClick(): void {
        this.setData({
            showSelect: true
        });
    }
    onSelectClose(): void {
        this.setData({
            showSelect: false
        });
    }
    onSelectChange(evt:any): void {
        console.log(evt);
        this.setState({
            selectedItems: evt.selectedItems
        });
    }
    onCheck(): void {
        console.log("Haha");
    }
    render():any {
        return  require("./views/index.html");
    }
}
