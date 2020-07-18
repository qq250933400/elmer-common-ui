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
    region: TypeRegionPicker;
    constructor(props:any) {
        super(props);
        this.region = createRegionPicker({
            onSelected: (data) => {
                console.log(data);
            }
        });
    }
    onShowRegion(): void {
        this.region.show();
    }
    onRegionChange(evt): void {
        console.log(evt);
    }
    render():any {
        return  require("./views/index.html");
    }
}
