import { autowired, Component, declareComponent, IElmerEvent,IPropCheckRule, PropTypes } from "elmer-ui-core";
import { ITreeViewItem } from "../../../components/treeView";
import "./index.less";

type TypeBookProps = {
    menuData: IPropCheckRule;
    title: IPropCheckRule;
};
type TypeBookStateKeys = Exclude<keyof TypeBookProps, "menuData">;

type TypeBookState = {
    menuData: ITreeViewItem[];
} & {[P in TypeBookStateKeys]?: any};
type TypeBookPropData = {[P in keyof TypeBookProps]: any};
@declareComponent({
    selector: "book",
    template: {
        url: "./index.html",
        fromLoader: true
    }
})
export class Book extends Component {
    static propType:TypeBookProps = {
        menuData: {
            defaultValue: [],
            description: "menu data",
            rule: PropTypes.array.isRequired
        },
        title: {
            defaultValue: "在线教程",
            description: "标题",
            rule: PropTypes.string.isRequired
        }
    };
    state:TypeBookState = {
        menuData: []
    };
    props: TypeBookPropData;
    constructor(props:TypeBookPropData) {
        super(props);
        this.state = {
            ...this.state,
            ...props
        };
    }
}
