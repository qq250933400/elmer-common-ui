import { autowired, Component, declareComponent, IElmerEvent,IPropCheckRule, PropTypes } from "elmer-ui-core";
import { ITreeViewItem } from "../../../components/treeView";
import "./index.less";

type TypeBookProps = {
    menuData: IPropCheckRule;
};
type TypeBookState = {
    menuData: ITreeViewItem[];
};

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
        }
    };
    state:TypeBookState = {
        menuData: []
    };
    constructor(props:any) {
        super(props);
        for(let i=0;i<10;i++) {
            this.state.menuData.push({
                title: "Book" + i,
                id: "hhh",
                children: []
            });
        }
    }

}
