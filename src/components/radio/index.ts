import { declareComponent, Component, IPropCheckRule, PropTypes } from "elmer-ui-core";
import "./style.less";

type TypeRadioButtonProps = {
    name: string;
    id: string;
    title: string;
    onChange?: Function;
    onChanged?: Function;
};

type TypeRadioButtonPropsRule = {
    [P in keyof TypeRadioButtonProps]?: IPropCheckRule
};

@declareComponent({
    selector: "radio"
})
export class RadioButton extends Component<TypeRadioButtonProps> {
    static propType: TypeRadioButtonPropsRule = {
        name: {
            rule: PropTypes.string.isRequired
        },
        id: {
            rule: PropTypes.string.isRequired  
        },
        title: {
            defaultValue: "",
            rule: PropTypes.string.isRequired
        },
        onChange: {
            rule: PropTypes.func
        }
    };
    state = {
        checked: false
    }
    constructor(props) {
        super(props);
        if(props.defaultValue !== undefined || props.defaultValue !== null) {
            this.state.checked = props.defaultValue ? true : false;
        }
    }
    onCheckChange(evt) {
        this.setState({
            checked: true
        });
        typeof this.props.onChange === "function" && this.props.onChange({
            name: this.props.name,
            id: this.props.id,
            checked: true
        });
        typeof this.props.onChanged === "function" && this.props.onChanged({
            name: this.props.name,
            id: this.props.id,
            checked: true
        });
    }
    render(): any {
        return `<label style="{{props.style}}" et:click="onCheckChange" for="{{props.id}}" class="eui-radio-button">
            <input checked="{{state.checked}}" id="{{props.id}}" name="{{props.name}}" type='radio' />
            <div><span>{{props.title}}</span><context /></div>
        </label>`;
    }
}
