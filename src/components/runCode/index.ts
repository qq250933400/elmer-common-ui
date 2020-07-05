import { Component, declareComponent, IPropCheckRule, propTypes } from "elmer-ui-core";

@declareComponent({
    selector: "RunCode"
})
export class RunCodeComponent extends Component {
    static propType:any = {
        code: <IPropCheckRule>{
            description: "运行代码",
            rule: propTypes.string
        },
        owner:<IPropCheckRule>{
            description: "事件执行绑定对象",
            rule: propTypes.any
        },
        showProps: <IPropCheckRule>{
            description: "打印传入的props",
            rule: propTypes.bool
        }
    };
    state:any = {
        htmlCode: ""
    };
    owner: null;
    constructor(props:any) {
        super(props);
        this.state.htmlCode = props.code;
        this.owner = props.owner;
        if(props.showProps) {
            // tslint:disable-next-line:no-console
            console.log("RunCode Component Props: ", props);
        }
    }
    help(): void {
        // tslint:disable-next-line: no-console
        console.log(this.props);
    }
    $onPropsChanged(props:any, oldProp:any): void {
        if(props.code !== this.state.htmlCode) {
            this.setState({
                htmlCode: props.code
            });
        } else {
            if(!this.isEqual(props, oldProp)) {
                this.setState({}, true);
            }
        }
    }
    render(): string {
        if(/^\s*\<[a-z0-9\-\_]{1,}/i.test(this.state.htmlCode)) {
            return this.state.htmlCode;
        } else {
            throw new Error("不支持的htmlCode: " + this.state.htmlCode);
        }
    }
}
