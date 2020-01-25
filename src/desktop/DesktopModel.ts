import { Canvas } from "elmer-common/lib/Canvas/Canvas";
import { Component } from "elmer-ui-core";
import { IBackgroundPlugin, TypePluginInfo } from "./IBackgroundPlugin";

export class DesktopModel extends Canvas {
    private dom:Component;
    private animationHandler:number;
    private cav:HTMLCanvasElement;
    private supportCanvas: boolean = false;
    private pluginData:TypePluginInfo[] = [];
    private userPlugin: TypePluginInfo;
    private plugin: IBackgroundPlugin;
    constructor(obj:Component) {
        super();
        this.dom = obj;
    }
    setCanvas(cav:HTMLCanvasElement): void {
        this.cav = cav;
        this.supportCanvas = cav && cav.getContext("2d") !== null;
    }
    setBackgroundPluginData(pluginData:TypePluginInfo[]): void {
        if(pluginData && pluginData.length>0) {
            this.pluginData = pluginData;
        }
    }
    setBackgroundPluginId(id:string): void {
        for(const plugin of this.pluginData) {
            if(plugin.id === id) {
                this.userPlugin = plugin;
                break;
            }
        }
    }
    start(): void {
        if(this.supportCanvas) {
            if(this.userPlugin) {
                this.plugin = new this.userPlugin.factory(this.cav);
                typeof this.plugin.init === "function" && this.plugin.init();
                this.animationHandler= this.startAnimation(this.animation, this);
            }
        } else {
            // tslint:disable-next-line: no-console
            console.error("Your browser not support Canvas. Upgrade your browser maybe resolve this problem.");
        }
    }
    stop(): void {
        (this.plugin && typeof this.plugin.dispose === "function") && this.plugin.dispose();
        this.plugin = null;
        this.userPlugin = null;
        this.pluginData = null;
        this.stopAnimation(this.animationHandler);
    }
    animation(tim?:number): void {
        // do something for draw background
        typeof this.plugin.draw === "function" && this.plugin.draw(tim);
    }
    onResize(width:number, height: number): void {
        (this.plugin && typeof this.plugin.resize === "function") && this.plugin.resize(width, height);
    }
}
