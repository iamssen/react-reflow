import { Observable } from 'rxjs';
import { Observe, ActionTools } from './store';
export declare function provide(mapState: (observe: Observe) => Observable<{
    [name: string]: any;
}>, mapHandlers?: (tools: ActionTools) => {
    [name: string]: any;
}): (WrappedComponent: any) => any;
