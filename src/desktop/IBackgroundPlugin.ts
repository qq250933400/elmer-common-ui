export interface IBackgroundPlugin {
    canvas:HTMLCanvasElement;
    isAnimation?: boolean;
    init(): void;
    dispose(): void;
    onPropsChange(props:any): void;
    draw(tim?:number): void;
    resize(wWidth?:number, wHeight?: number): void;
}

export type TypePluginInfo = {
    id: string;
    title: string;
    factory: any;
};
