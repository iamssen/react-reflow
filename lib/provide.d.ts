import { Observable } from 'rxjs';
import { Observe, ActionTools } from './store';
export declare type Provider = {
    mapState?: (observe: Observe) => Observable<{
        [name: string]: any;
    }>;
    mapHandlers?: (tools: ActionTools) => {
        [name: string]: any;
    };
};
export declare function provide(...providers: Provider[]): (WrappedComponent: any) => any;
