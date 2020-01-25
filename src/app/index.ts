import { autowired, Component, declareComponent, ElmerDOM, ElmerServiceRequest, IElmerEvent } from "elmer-ui-core";
import { showLoading, showToast } from "../components";
import dialog, { TypeCreateDialogResult } from "../components/dialog/dialog";
import "./admin";
import "./demo";
import "./style/index.less";
import "./test.js";

@declareComponent({
    selector: "index",
    withRouter: true,
    connect: {
        mapStateToProps: (state:any) => {
            console.log(state, "-----------------");
            return {
                ...state.home.news
            };
        }
    }
})
export class IndexComponent extends Component {
    monthText: string[] = ["一月", "二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
    weekendTitle: any[] = [
        {title: "日"},
        {title: "一"},
        {title: "二"},
        {title: "三"},
        {title: "四"},
        {title: "五"},
        {title: "六"},
        {title: "七"},
    ];
    bottom: string = "<eui-button title='testting' loading='{{true}}'/>";
    allCount: number = 1500;
    page: number = 1;
    dialog:TypeCreateDialogResult;
    listData: any[] = [];
    listShow: boolean = false;
    numCalc: number = 0;

    @autowired(ElmerDOM)
    private $:ElmerDOM;

    @autowired(ElmerServiceRequest)
    private http:ElmerServiceRequest;

    constructor() {
        super({});
        for(let i=0;i<50;i++) {
            this.listData.push({
                title:　"test list: " + i,
                id: "mapping_id: " + i
            });
        }
    }
    $init(): void {
        this.http.init(true);
    }
    $onPropsChanged(newProps:any):void {
        console.log("+++++++++OnPropsChanged++++++++++++", newProps);
    }
    handleOnServiceRequest(): void {
        this.http.sendRequest({
            namespace: "Blog",
            endPoint: "homeCategory"
        }).then((resp) => {
            console.log(resp);
        }).catch((err) => {
            console.error(err);
        });
    }
    getChildrenContext():any {
        return {
            appIndex: {
                title: "redefined",
                version: "1.0.0"
            }
        };
    }
    handleOnCalcClick(): void {
        this.setData({
            numCalc: this.numCalc + 1
        });
    }
    handleOnShowForm(): void {
      showToast("the retry button has been clicked", {
        autoClose: false
      });
    }
    handleOnInputDialog(): void {
        dialog.alert({
            message: "the retry button has been clicked,the retry button has been clicked",
            title: "New Question ",
            iconType: "Information",
            msgType: "OkCancelRetry",
            isMobile: false,
            onOk: () => {
                console.log("onOk")
            }
        });
    }
    handleOnOpenDialog():void {
        if(!this.dialog) {
            this.dialog = dialog.open({
                showMask: false,
                onClose: () => {
                    this.dialog.render = null;
                    this.dialog.component = null;
                    delete this.dialog.render;
                    delete this.dialog.component;
                    this.dialog = null;
                    console.log("remove dialog from dom");
                },
                onMax:(state:boolean) => {
                    console.log(state);
                },
                onMin:() => {
                    console.log("onMin");
                }
            });
        } else {
            this.dialog.show();
            console.log("Show Exists Object");
        }
    }
    render(): string {
        return require("./views/index.html");
    }
    handleOnAnimation(): void {
        const demoDom = this.dom["animation"];
        if(this.listShow) {
            this.listShow = false;
            this.$.slideOut(demoDom, {
                duration: 600,
                type: "Linear"
            });
        } else {
            this.listShow = true;
            //this.$.hide(this.dom["animation"]);
            this.$.slideIn(demoDom, {
                duration: 600,
                type: "Linear"
            });
        }
    }
    handleOnBackgroundAnimation(): void {
        const demoDom = this.dom["animation"];
        this.$.animations({
            duration: 2400,
            options: [
                {
                    dom: demoDom,
                    type: "Linear",
                    duration: 1000,
                    from: {
                        transformTranslateX: "0px",
                        borderLeftColor: "#ddd",
                        borderLeftWidth: 1
                    },
                    to: {
                        transformTranslateX: "150px",
                        borderLeftColor: "red",
                        borderLeftWidth: 10
                    },
                    onStart:() => {
                        console.log("animationBegin", (new Date()).getTime())
                    },
                    onFinish:()=>{
                        console.log("animationEnd", (new Date()).getTime())
                    }
                }, 
                // {
                //     dom: demoDom,
                //     type: "BackEaseIn",
                //     duration: 1400,
                //     beginTime: 1200,
                //     from: {
                //         transformRotateZ: "0deg"
                //     },
                //     to: {
                //         transformRotateZ: "360deg"
                //     }
                // }
            ]
        })
        // this.$.animation({
        //     dom: demoDom,
        //     type: "Linear",
        //     duration: 800,
        //     from: {
        //         transformRotateZ: "0deg"
        //     },
        //     to: {
        //         transformRotateZ: "90deg"
        //     }
        // });
    }
    handleOnShowLoading(): void {
        const lResult = showLoading({
            type: "style2"
        });
        setTimeout(() => {
            lResult.dispose();
        }, 10000);
    }
    handleOnPageChange(event:IElmerEvent): void {
        this.redirect(event.dataSet.url);
    }
}
