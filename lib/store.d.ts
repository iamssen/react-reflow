import { Observable } from 'rxjs';
import { Tools, ContextConfig, Observe, GetState, Dispatch } from './types';
export declare class StorePermit {
    private store;
    private _destroyed;
    private _subjects;
    private _subscriptions;
    constructor(store: Store);
    readonly destroyed: boolean;
    readonly tools: Tools;
    hasParent: () => boolean;
    hasState: (name: string) => boolean;
    isPlainState: (name: string) => boolean;
    observe: Observe;
    getState: GetState;
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
    readonly tools: {
        [name: string]: (permit: StorePermit) => any;
    };
    constructor(config: ContextConfig, parentStore?: Store);
    hasParent: () => boolean;
    hasState: (name: string) => boolean;
    isPlainState: (name: string) => boolean;
    update: (name: string, value: any) => void;
    getObservable: (name: string) => Observable<any>;
    observe: (...names: string[]) => Observable<{
        [name: string]: any;
    }>;
    access(): StorePermit;
    destroy(): void;
}
