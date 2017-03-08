import { Observable } from 'rxjs';
import { StoreConfig } from './types';
import { StorePermit } from './permit';
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
    constructor(config: StoreConfig, parentStore?: Store);
    hasParent: () => boolean;
    hasState: (name: string) => boolean;
    isPlainState: (name: string) => boolean;
    update: (name: string, value: any) => void;
    getObservable: (name: string) => Observable<any>;
    observe: (...names: string[]) => Observable<{
        [name: string]: any;
    }>;
    access: () => StorePermit;
    destroy: () => void;
}
