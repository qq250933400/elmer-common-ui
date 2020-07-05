import { autowired, Component,declareComponent, ElmerDOM, IElmerEvent,IElmerMouseEvent, IPropCheckRule, PropTypes  } from "elmer-ui-core";
import dialog, { TypeCreateDialogResult } from "../../components/dialog/dialog";
import { ContentMenu, IContentMenuItem } from "../../components/menu";
import { createDesktopAppContent ,demoAppData, DesktopApp, DesktopMenus } from "../DesktopApp";
import "./styles/win10.less";
import "./Toolbar";
import "./WinStartMenu";

// tslint:disable-next-line:interface-over-type-literal
type DeskTopWin10State = {
    windowTime: string;
    windowDate: string;
    wWidth?: number;
    wHeight?: number;
    isInitAppPosition?: boolean;
    desktopApp: DesktopApp[];
    openWindows: DesktopApp[];
    activeAppId: string;
    showCalendar: boolean;
    showStartMenu: boolean;
    startMenuList: DesktopApp[];
    desktopMenuVisible: boolean;
    desktopMenuStyle: string;
};

type TypeDesktopWin10PropsRules = {
    autoRunAppList: IPropCheckRule;
    deskTopAppList: IPropCheckRule;
    startMenuList: IPropCheckRule;
    quickStartMenu: IPropCheckRule;
};
type TypeDesktopWin10Props = {[P in keyof TypeDesktopWin10PropsRules]: any};

@declareComponent({
    selector: "desktop-win10",
    components: [
        {selector: "menu", component: ContentMenu}
    ]
})
export class DeskTopWin10 extends Component {
    static propType:TypeDesktopWin10PropsRules = {
        autoRunAppList: {
            defaultValue: [],
            description: "页面加载后自动运行的App列表",
            rule: PropTypes.array.isRequired
        },
        deskTopAppList: {
            defaultValue: [],
            description: "显示在桌面的程序列表",
            rule: PropTypes.array.isRequired
        },
        startMenuList: {
            defaultValue: [],
            description: "开始菜单数据",
            rule: PropTypes.array.isRequired
        },
        quickStartMenu: {
            defaultValue: [],
            description: "快速启动菜单",
            rule: PropTypes.array.isRequired
        }
    };
    timeHandler: any;
    state:DeskTopWin10State = {
        windowTime: "",
        windowDate: "",
        desktopApp: [],
        openWindows: [],
        activeAppId: "",
        startMenuList: [],
        showCalendar: false,
        showStartMenu: false,
        desktopMenuVisible: false,
        desktopMenuStyle: ""
    };
    openAppList: any = {};
    windowMaxZIndex:number = 6;
    windowNormalZIndex:number = 5;
    desktopMenu:IContentMenuItem[] = DesktopMenus;

    props:TypeDesktopWin10Props;

    @autowired(ElmerDOM)
    private $:ElmerDOM;
    constructor(props:TypeDesktopWin10Props) {
        super(props);
        let now = new Date();
        this.state.windowTime = now.format("H:i");
        this.state.windowDate = now.format("YYYY:MM:DD");
        this.state.wWidth = document.body.clientWidth;
        this.state.wHeight = document.body.clientHeight;
        this.state.desktopApp = props.deskTopAppList;
        this.state.startMenuList = props.startMenuList;
        this.timeHandler = setInterval(this.timeTick.bind(this), 6000);
        now = null;// define propertye
    }
    $after(): void {
        let autoRunAppList:DesktopApp[] = this.props.autoRunAppList;
        if(!this.state.isInitAppPosition) {
            this.state.isInitAppPosition = true;
            this.resetAppPosition();
            if(autoRunAppList && autoRunAppList.length > 0) {
                autoRunAppList.map((tmpApp:DesktopApp) => {
                    this.openApp(tmpApp);
                });
            }
        }
        autoRunAppList = null;
    }
    $dispose(): void {
        this.timeHandler && clearInterval(this.timeHandler);
    }
    $resize(): Function {
        return (width:number,height:number) => {
            this.state.wWidth = width;
            this.state.wHeight = height;
            this.resetAppPosition();
        };
    }
    handleOnStartMenuClick(data:DesktopApp): void {
        this.setState({
            showStartMenu: false
        });
        this.openApp(data);
    }
    handleOnDesktopMenuClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            desktopMenuVisible: false
        });
    }
    handleOnDesktopMouseUp(evt:IElmerMouseEvent): void {
        const mouseX = evt.nativeEvent.clientX, mouseY = evt.nativeEvent.clientY;
        if((<HTMLElement>evt.nativeEvent.target).tagName === "UL") {
            if(evt.nativeEvent.button === 2) {
                this.setState({
                    desktopMenuStyle: `left: ${mouseX}px;top: ${mouseY}px;position:fixed;z-index:10;`,
                    desktopMenuVisible: true
                });
            } else {
                if(this.state.desktopMenuVisible) {
                    this.setState({
                        desktopMenuVisible: false
                    });
                }
            }
        }
    }
    handleOnStartMenuOutClick(): void {
        if(this.state.showStartMenu) {
            this.setState({
                showStartMenu: false
            });
        }
    }
    handleOnAppTimeOutClick(): void {
        if(this.state.showCalendar) {
            this.setState({
                showCalendar: false
            });
        }
    }
    handleOnStartButtonClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            showStartMenu: !this.state.showStartMenu
        });
    }
    handleOnAppTimeClick(evt:IElmerEvent): void {
        evt.nativeEvent.cancelBubble = true;
        evt.nativeEvent.stopPropagation();
        this.setState({
            showCalendar: !this.state.showCalendar
        });
    }
    handleOnAppItemClick(evt:IElmerEvent): void {
        let eventPath = typeof (<any>evt.nativeEvent).composedPath === "function" ? (<any>evt.nativeEvent).composedPath() : (<any>evt.nativeEvent).path;
        let targetDataType = (<HTMLElement>evt.nativeEvent.target).getAttribute("data-type");
        if((<any>evt.nativeEvent.target).tagName !== "UL" && targetDataType !== "AppList") {
            if(this.isArray(eventPath)) {
                let index = 0, maxLength = eventPath.length;
                let target:HTMLLIElement;
                while(index < maxLength && !target) {
                    if(eventPath[index].tagName === "LI") {
                        target = eventPath[index];
                        break;
                    }
                    index += 1;
                }
                maxLength = null;
                // find the event target is li element
                // get itemKey from target's data-key attribute
                if(!target) {
                    // tslint:disable-next-line:no-console
                    console.warn("Can not get the app Item,Maybe browser compatibility issues.");
                } else {
                    let dataKey = target.getAttribute("data-key");
                    let data = this.isNumeric(dataKey) ? this.state.desktopApp[parseInt(dataKey, 10)] : this.state.desktopApp[dataKey];
                    this.openApp(data);
                    dataKey = null;
                    data = null;
                }
            }
        }
        targetDataType = null;
        eventPath = null;
    }
    handleOnToolBarClick(evt:IElmerEvent): void {
        const mouseButton = (<MouseEvent>evt.nativeEvent).button;
        if(mouseButton === 0) {
            // mouse left clicked,bring window to the top
            this.moveWindowToTop(evt.data);
        }
    }
    timeTick(): void {
        let now = new Date();
        this.setState({
            windowTime: now.format("H:i"),
            windowDate: now.format("YYYY:MM:DD")
        });
        now = null;
    }
    render(): string {
        return require("./views/layout.html");
    }
    private openApp(appData:DesktopApp): void {
        this.createWindow(appData);
    }
    private createWindow(appData:DesktopApp): void {
        if(appData.data && appData.data.type === "CallMethod") {
            if(typeof appData.data.component === "function") {
                appData.data.component.call(this);
            } else {
                typeof window[appData.data.component] === "function" && window[appData.data.component]();
            }
        } else {
            let parent:HTMLDivElement = this.dom.container;
            if(parent) {
                let openWindow:TypeCreateDialogResult = this.openAppList[appData.id];
                if(!openWindow) {
                    let win = dialog.open({
                        attrs: appData,
                        parent,
                        params: {
                            title: appData.title,
                            icon: appData.icon,
                            showIcon: true,
                            zIndex: this.windowMaxZIndex,
                            width: appData.data && !this.isEmpty(appData.data.width) ? appData.data.width : 400,
                            height: appData.data && !this.isEmpty(appData.data.height) ? appData.data.height : 300,
                        },
                        htmlCode: createDesktopAppContent(appData),
                        onClose: (data:DesktopApp) => {
                            this.removeAppWindow(data.id);
                        },
                        onFocus:(data:DesktopApp) => {
                            this.moveWindowToTop(data.id);
                        }
                    });
                    this.openAppList[appData.id] = win;
                    let stateWindows = JSON.parse(JSON.stringify(this.state.openWindows)) || [];
                    stateWindows.push(appData);
                    this.setState({
                        openWindows: stateWindows,
                        activeAppId: appData.id
                    });
                    this.moveWindowToTop(appData.id);
                    stateWindows = null;
                    win = null;
                } else {
                    openWindow.show({
                        params: {
                            zIndex: this.windowMaxZIndex
                        }
                    });
                    this.moveWindowToTop(appData.id);
                }
                openWindow = null;
            }
            parent = null;
            self = null;
        }
    }
    private moveWindowToTop(id: string): void {
        if(this.openAppList) {
            const maxZIndex = this.windowMaxZIndex;
            const normalZIndex = this.windowNormalZIndex;
            Object.keys(this.openAppList).map((appId: string) => {
               let app:TypeCreateDialogResult = this.openAppList[appId];
               if(app) {
                   if (id === appId) {
                       if (!(<any>app.component).options.visible) {
                           // move the active window to the top and set visible equal true ignore the zIndex attribute change
                           app.setZIndex(maxZIndex, true);
                       } else {
                           app.zIndex !== maxZIndex && app.setZIndex(maxZIndex);
                       }
                   } else {
                       app.zIndex !== normalZIndex && app.setZIndex(normalZIndex);
                   }
               }
               app = null;
            });
        }
    }
    private removeAppWindow(id:string): void {
        if(this.openAppList && this.openAppList[id]) {
            delete this.openAppList[id];
        }
        let stateWindows = this.state.openWindows || [];
        let updateStateWindows = [];
        for(let i = 0, mLen = stateWindows.length;i<mLen;i++) {
            if(stateWindows[i].id !== id) {
                updateStateWindows.push(stateWindows[i]);
            }
        }
        this.setState({
            openWindows: updateStateWindows
        });
        stateWindows = null;
        updateStateWindows = null;
    }
    private resetAppPosition(): void {
        const appContent:HTMLDivElement = this.dom.appContent;
        if(appContent) {
            const maxAppLineHeight = appContent.clientHeight;
            const maxAppWidth = appContent.clientWidth;
            const appListDom = this.$.find(appContent, ">.eui-desktop-win10-content-app-list");
            if(appListDom && appListDom.length > 0) {
                for(let i=0,mLen=appListDom.length;i<mLen;i++) {
                    const appList = appListDom[i];
                    const parents = this.$.query("ul", appList);
                    if(parents && parents[0]) {
                        const parent = parents[0];
                        const items = this.$.query("li", <HTMLElement>parent);
                        if(items && items.length>0) {
                            let line = 0,lineCol = 0, lineHeight = 0, maxNums = items.length;
                            let appItemWidth = 0, allItemWidth = 0;
                            for(let j=0;j<maxNums;j++) {
                                const appItem:HTMLLIElement = <HTMLLIElement>items[j];
                                const appHeight = appItem.clientHeight;
                                const appWidth = appItem.clientWidth;
                                appItemWidth = appWidth;
                                if(lineHeight + appHeight <= maxAppLineHeight) {
                                    this.$.css(appItem, {
                                        left: line * appWidth,
                                        top: lineCol * appHeight,
                                        opacity: 1
                                    });
                                    lineCol += 1;
                                    lineHeight += appHeight;
                                } else {
                                    line += 1;
                                    lineCol = 0;
                                    lineHeight = 0;
                                    this.$.css(appItem, {
                                        left: line * appWidth,
                                        top: lineCol * appHeight,
                                        opacity: 1
                                    });
                                    lineCol += 1;
                                    lineHeight += appHeight;
                                }
                                appItem.style.setProperty("opacity", "1");
                            }
                            maxNums = null;
                            allItemWidth = (line + 1) * appItemWidth;
                            if(allItemWidth > maxAppWidth) {
                                this.$.css(<HTMLUListElement>parent, "width", allItemWidth);
                            }
                        }
                    }
                }
            }
        }
    }
}
