import { Observable } from 'rxjs';
import { Observe } from './store';
export declare function connect(operator?: (observe: Observe) => Observable<{
    [name: string]: any;
}>): any;
