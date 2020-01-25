import { Component, declareComponent, propTypes } from "elmer-ui-core";
import { TypeLoadingTypes } from "./index";
import "./style.less";

@declareComponent({
    selector: "LoadingIcon"
})
export class Loading extends Component {
    static propType: any = {
        type: propTypes.string,
        visible: propTypes.boolean
    };
    private type: TypeLoadingTypes = "style1";
    private style1Visible: boolean = true;
    private style2Visible: boolean = false;
    private style3Visible: boolean = false;
    private style4Visible: boolean = false;
    private style5Visible: boolean = false;
    private style6Visible: boolean = false;
    private style7Visible: boolean = false;
    private style8Visible: boolean = false;
    private visible: boolean = true;
    constructor(props: any) {
        super(props);
        this.type = props.type || "style1";
        this.visible = props.visible;
        this.style1Visible = false;
        this[`${this.type}Visible`] = true;
    }
    $onPropsChanged(newProps: any): void {
        const updateState: any = {};
        if(!this.isEmpty(newProps.visible)) {
            updateState.visible = newProps.visible;
        }
        if(!this.isEmpty(newProps.type)) {
            this[`${newProps.type}Visible`] = true;
        }
        this.setData(updateState);
    }
    render(): string {
        return require("./icon.html");
    }
}
