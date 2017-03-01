import { Observable } from 'rxjs';
import { StorePermit } from './store';
export declare type Teardown = (() => void) | void;
export declare type Update = {
    [name: string]: any;
};
export declare type Operation = (tools: Tools) => Teardown;
export declare type Action = Update | Promise<Update> | Operation;
export declare type Observe = (...names: string[]) => Observable<{
    [name: string]: any;
}>;
export declare type Dispatch = (action: Action) => Teardown;
export declare type GetState = (...names: string[]) => Promise<{
    [name: string]: any;
}>;
export interface Tools {
    dispatch: Dispatch;
    observe: Observe;
    getState: GetState;
}
export declare type Provider = {
    mapState?: (observe: Observe) => Observable<{
        [name: string]: any;
    }>;
    mapHandlers?: (tools: Tools) => {
        [name: string]: any;
    };
};
export declare type ContextConfig = {
    isolate?: boolean;
    state: {
        [name: string]: ((observe: Observe) => Observable<any>) | any;
    };
    receiveContextProps?: (tools: Tools) => {
        [name: string]: (prevValue, nextValue) => void;
    };
    handleContextProps?: (tools: Tools, getContextProps: () => any) => Teardown;
    startup?: (tools: Tools) => Teardown;
    tools?: {
        [name: string]: (permit: StorePermit) => any;
    };
};
