import {Observable} from 'rxjs';
import {StorePermit} from './store';

export type Teardown = (() => void) | void;

export type Update = {[name: string]: any};
export type Operation = (tools: Tools) => Teardown;
export type Action = Update | Promise<Update> | Operation;

export type Observe = (...names: string[]) => Observable<{[name: string]: any}>;
export type Dispatch = (action: Action) => Teardown;
export type GetState = (...names: string[]) => Promise<{[name: string]: any}>;

export interface Tools {
  dispatch: Dispatch;
  observe: Observe;
  getState: GetState;
}

export type Provider = {
  mapState?: (observe: Observe) => Observable<{[name: string]: any}>,
  mapHandlers?: (tools: Tools) => {[name: string]: any},
}

export type ContextConfig = {
  isolate?: boolean,
  state: {[name: string]: ((observe: Observe) => Observable<any>) | any};
  
  // receiveContextProps: ({dispatch}) => ({
  //   a: (prevValue, nextValue) => dispatch(updateA(nextValue)),
  //   b: (prevValue, nextValue) => dispatch(updateB(nextValue)),
  // })
  
  receiveContextProps?: (tools: Tools) => {[name: string]: (prevValue, nextValue) => void};
  // handleContextProps: ({observe}, getContextProps) => {
  //   const subscription = observe('a').subscribe(({a}) => {
  //     getContextProps().onChange(a)
  //   })
  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }
  handleContextProps?: (tools: Tools, getContextProps: () => any) => Teardown;
  
  // startup: ({dispatch, observe}) => {
  //   const stop = dispatch(updateValueWhenABChange());
  //   const subscription = observe('value').subscribe(({value}) => {
  //     console.log(value);
  //   }
  //   return () => {
  //     stop();
  //     subscription.unsubscribe();
  //   }
  // }
  startup?: (tools: Tools) => Teardown;
  
  // tools: {
  //   sum: permit => (a:number, b:number) => a + b,
  // }
  //
  // const action = () => ({sum}) => {
  //   console.log(sum(1, 2)) // 3
  // }
  tools?: {[name: string]: (permit: StorePermit) => any};
}