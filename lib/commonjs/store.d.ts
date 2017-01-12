import { Observable } from 'rxjs';
export declare type Teardown = () => void;
export declare type Update = {
    [name: string]: any;
};
export declare type UpdatePromise = Promise<Update>;
export declare type Operation = (tools: ActionTools) => Teardown;
export declare type Action = Update | UpdatePromise | Operation;
export declare type Observe = (...names: string[]) => Observable<{
    [name: string]: any;
}>;
export declare type Dispatch = (action: Action) => Teardown;
export declare type Tool = (permit: StorePermit) => any;
export interface ActionTools {
    dispatch: Dispatch;
    observe: Observe;
}
export declare type ContextConfig = {
    state: {
        [name: string]: ((observe: Observe) => Observable<any>) | any;
    };
    startup?: (tools: ActionTools) => Teardown | void;
    tools?: {
        [name: string]: Tool;
    };
};
export declare class StorePermit {
    private store;
    private _destroyed;
    private _subjects;
    private _subscriptions;
    constructor(store: Store);
    readonly tools: ActionTools;
    observe: Observe;
    dispatch: Dispatch;
    destroy(): void;
}
export declare class Store {
    private config;
    private parentStore;
    private _observables;
    private _destroyed;
    private _startupPermit;
    private _startupTeardown;
    readonly destroyed: boolean;
    readonly tools: ({
        [name: string]: (permit: StorePermit) => any;
    });
    constructor(config: ContextConfig, parentStore?: Store);
    isPlainState: (name: string) => boolean;
    update: (name: string, value: any) => void;
    getObservable: (name: string) => Observable<any>;
    observe: (...names: string[]) => Observable<{
        [name: string]: any;
    }>;
    access(): StorePermit;
    destroy(): void;
}
