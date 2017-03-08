import { Tools, Observe, GetState, Dispatch } from './types';
import { Store } from './store';
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
    destroy: () => void;
}
