import { Component, declareComponent, IPropCheckRule,PropTypes } from "elmer-ui-core";

export type TypeDemoContextTypes = {
    appIndex: IPropCheckRule
};

@declareComponent({
    selector: "demo"
})
export class DemoComponent extends Component {
    static contextType:TypeDemoContextTypes = {
        appIndex: {
            description: "hh",
            rule: PropTypes.object
        }
    };
    context:any;
    constructor(props:any, context:any) {
        super(props);
        this.context = context;
        console.log(context);
    }
    render(): string {
        return "<h5>DemoComponent:{{context.appIndex.title}}</h5>";
    }
}
