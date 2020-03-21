import {
    autoInit,
    Component,
    declareComponent,
    IElmerEvent,
    IPropCheckRule,
    PropTypes,
    redux
} from "elmer-ui-core";
import "./app/setting";
import { MatrixCharacterEffects } from "./backgroundPlugin/MatrixCharacterEffects";
import { PictureBackground } from "./backgroundPlugin/PictureBackground";
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
type TypeDesktopPropsCheckRule = {
    userWallperPlugin: IPropCheckRule;
    autoRunAppList: IPropCheckRule;
    backgroundConfig: IPropCheckRule;
    backgroundPlugin: IPropCheckRule;
};
type TypeDesktopProps = {[P in keyof TypeDesktopPropsCheckRule]:any};

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
        mapStateToProps: (state:any) => {
            return {
                autoRunAppList,
                backgroundPlugin: <TypePluginInfo[]>[
                    {
                        id: "hackers",
                        title: "黑客帝国",
                        factory: MatrixCharacterEffects
                    }, {
                        id: "images",
                        title: "背景图片",
                        factory: PictureBackground
                    }
                ],
                backgroundConfig: state.desktop.background
            };
        }
    }
})
export class Desktop extends Component {
    static propType:TypeDesktopPropsCheckRule = {
        userWallperPlugin: {
            defaultValue: "images",
            description: "设置背景使用的插件id",
            rule: PropTypes.string.isRequired
        },
        autoRunAppList: {
            defaultValue: [],
            description: "系统启动运行程序",
            rule: PropTypes.array.isRequired
        },
        backgroundConfig: {
            description: "背景设置参数",
            rule: PropTypes.any
        },
        backgroundPlugin: {
            description: "背景渲染插件",
            rule: PropTypes.array
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
    props:TypeDesktopProps;
    private backgroundConfig: any;
    $init(): void {
        this.setTheme<TypeDesktopThemes>("themeNoBack", this.supportThemes);
    }
    $inject(): void {
        this.model.obj.setBackgroundPluginData(this.props.backgroundPlugin);
        this.model.obj.setBackgroundPluginId(this.props.userWallperPlugin);
    }
    $onPropsChanged(props:TypeDesktopProps):void {
        if(JSON.stringify(props.backgroundConfig) !== JSON.stringify(this.backgroundConfig)) {
            this.backgroundConfig = props.backgroundConfig;
        }
        console.log("---PropsChange");
        this.model.obj.onPropsChange(props);
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
