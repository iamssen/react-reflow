import { Store } from './store';
import { ContextConfig } from './types';
export declare const mountedStores: Set<Store>;
export declare function createContext(config: ContextConfig): any;
