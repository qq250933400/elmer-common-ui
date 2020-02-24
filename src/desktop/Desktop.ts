import {
    Component,
    declareComponent,
    IElmerEvent,
    IPropCheckRule,
    PropTypes,
    redux,
    autoInit
} from "elmer-ui-core";
import "./app/setting";
import { MatrixCharacterEffects } from "./BackgroundPlugn";
import "./config/service";
import { autoRunAppList } from "./DesktopApp";
import { DesktopModel } from "./DesktopModel";
import { TypePluginInfo } from "./IBackgroundPlugin";
import "./styles/desktop.less";

type TypeDesktopThemes = {
    default: string,
    themeDesktop: string;
    themeDefault: string;
    themeNoBack: string;
};
type TypeDesktopProps = {
    userWallperPlugin: IPropCheckRule;
    autoRunAppList: IPropCheckRule;
};

@declareComponent({
    selector: "desktop",
    template: {
        url: "./views/index.html",
        fromLoader: true
    },
    model: {
        obj: DesktopModel
    },
    connect: {
        mapStateToProps: () => {
            return {
                autoRunAppList,
                backgroundPlugin: <TypePluginInfo[]>[
                    {
                        id: "hackers",
                        title: "黑客帝国",
                        factory: MatrixCharacterEffects
                    }
                ]
            };
        }
    }
})
export class Desktop extends Component {
    static propType:TypeDesktopProps = {
        userWallperPlugin: {
            defaultValue: "hackers",
            description: "设置背景使用的插件id",
            rule: PropTypes.string.isRequired
        },
        autoRunAppList: {
            defaultValue: [],
            description: "系统启动运行程序",
            rule: PropTypes.array.isRequired
        }
    };
    supportThemes:TypeDesktopThemes = {
        default: "default",
        themeDesktop: "themeDesktop",
        themeDefault: "themeDefault",
        themeNoBack: "themeNoBackground"
    };
    theme:keyof TypeDesktopThemes   = "default";
    cavId: string = this.getRandomID();
    reduxConfig: any = {};
    constructor(props:any) {
        super(props);
        console.log(autoInit(redux.ReduxController));
    }
    $init(): void {
        this.setTheme<TypeDesktopThemes>("themeNoBack", this.supportThemes);
    }
    $inject(): void {
        this.model.obj.setBackgroundPluginData(this.props.backgroundPlugin);
        this.model.obj.setBackgroundPluginId(this.props.userWallperPlugin);
    }
    $after(): void {
        this.addEvent(this, document.body, "contextmenu", (evt:IElmerEvent): boolean => {
            evt.nativeEvent.preventDefault();
            return false;
        });
        this.model.obj.setCanvas(this.dom[this.cavId]);
        this.model.obj.start();
    }
    $dispose(): void {
        this.setTheme("default", this.supportThemes);
        this.model.obj.stop();
    }
    $resize(): Function {
        return (width:number, height: number) => {
            this.model.obj.onResize(width, height);
        };
    }
}
