import { autowired, Component, declareComponent, ElmerDOM, ElmerServiceRequest, IElmerEvent } from "elmer-ui-core";
import { createRegionPicker, showLoading, showToast, TypeRegionPicker } from "../components";
import dialog, { TypeCreateDialogResult } from "../components/dialog/dialog";
import "./admin";
import "./demo";
import "./style/index.less";
import "./test.js";

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
    data: any[] = [];
    index: number = 0;
    onActionAdd():void{
        const mData = JSON.parse(JSON.stringify(this.data));
        mData.push({
            title: "Demo Item",
            index: this.index
        });
        this.index += 1;
        this.setData({
            data: mData
        });
    }
    onDel(evt:IElmerEvent):void {
        const myData = JSON.parse(JSON.stringify(this.data));
        const newData = [];
        for(let i=0;i<myData.length;i++) {
            if(myData[i].index !== evt.data.item.index) {
                newData.push(myData[i]);
            }
        }

        this.setData({
            data: newData
        });
    }
    render():any {
        return require("./views/test.html");
    }
}
