import {Observable, Subscription, BehaviorSubject, Subject, Scheduler} from 'rxjs';

// ---------------------------------------------
// Types
// ---------------------------------------------
export type Teardown = (() => void) | void;

export type Update = {[name: string]: any};
export type Operation = (tools: ActionTools) => Teardown;
export type Action = Update | Promise<Update> | Operation;

export type Observe = (...names: string[]) => Observable<{[name: string]: any}>;
export type Dispatch = (action: Action) => Teardown;

export type Tool = (permit: StorePermit) => any;

export interface ActionTools {
  dispatch: Dispatch;
  observe: Observe;
}

export type ContextConfig = {
  state: {[name: string]: ((observe: Observe) => Observable<any>) | any};
  startup?: (tools: ActionTools) => Teardown;
  tools?: {[name: string]: Tool};
}

// ---------------------------------------------
// Tools
// ---------------------------------------------
const observe = (permit: StorePermit) => (...names: string[]) => {
  return permit.observe(...names);
}

const dispatch = (permit: StorePermit) => (action: Action) => {
  return permit.dispatch(action);
}

// ---------------------------------------------
// StorePermit
// ---------------------------------------------
export class StorePermit {
  private _destroyed: boolean;
  private _subjects: BehaviorSubject<any>[];
  private _subscriptions: Subscription[];
  
  constructor(private store: Store) {
    this._destroyed = false;
    this._subjects = [];
    this._subscriptions = [];
  }
  
  get tools(): ActionTools {
    const tools: any = {
      observe: observe(this),
      dispatch: dispatch(this),
    }
    
    const additionalTools = this.store.tools;
    Object.keys(additionalTools).forEach(name => {
      tools[name] = additionalTools[name](this);
    });
    
    return tools;
  }
  
  observe: Observe = (...names: string[]) => {
    if (this._destroyed || this.store.destroyed) return Observable.empty();
    const subject = new BehaviorSubject<any>(null);
    this._subjects.push(subject);
    this._subscriptions.push(this.store.observe(...names).subscribe(subject));
    return subject.distinctUntilChanged().debounceTime(1, Scheduler.queue);
  }
  
  dispatch: Dispatch = (action: Action) => {
    if (typeof action === 'function') { // case Operate
      let broken: boolean = false;
      const teardown = action(this.tools);
      
      return () => {
        if (!broken && typeof teardown === 'function') teardown();
        broken = true;
      }
    } else { // case Update, UpdatePromise
      let broken: boolean = false;
      
      Promise.resolve(action).then(update => {
        if (broken) return;
        Object.keys(update).forEach(name => {
          if (this.store.isPlainState(name)) this.store.update(name, update[name]);
        })
      })
      
      return () => broken = true;
    }
  }
  
  destroy() {
    for (const subject of this._subjects) {
      subject.complete();
      subject.unsubscribe();
    }
    
    for (const subscription of this._subscriptions) {
      subscription.unsubscribe();
    }
    
    this._subjects = null;
    this._subscriptions = null;
    this._destroyed = true;
  }
}

// ---------------------------------------------
// Store
// ---------------------------------------------
export class Store {
  private _observables: Map<string, Observable<any>>;
  private _destroyed: boolean;
  private _startupPermit: StorePermit;
  private _startupTeardown: Teardown;
  
  get destroyed(): boolean {
    return this._destroyed;
  }
  
  get tools(): ({[name: string]: (permit: StorePermit) => any}) {
    const tools = this.config && this.config.tools ? this.config.tools : {};
    return this.parentStore
      ? Object.assign({}, this.parentStore.tools, tools)
      : tools || {};
  }
  
  constructor(private config: ContextConfig, private parentStore?: Store) {
    this._observables = new Map<string, Observable<any>>();
    this._destroyed = false;
    if (typeof config.startup === 'function') {
      this._startupPermit = this.access();
      this._startupTeardown = this._startupPermit.dispatch(this.config.startup);
    }
  }
  
  isPlainState = (name: string): boolean => {
    return typeof this.config.state[name] !== 'function';
  }
  
  update = (name: string, value: any) => {
    if (this._observables.has(name)) {
      const observable: Observable<any> = this._observables.get(name);
      if (observable instanceof Subject) observable.next(value);
    } else if (this.parentStore) {
      this.parentStore.update(name, value);
    }
  }
  
  getObservable = (name: string): Observable<any> => {
    if (this.config.state[name] !== undefined) {
      if (!this._observables.has(name)) {
        const observable: Observable<any> = this.isPlainState(name)
          ? new BehaviorSubject<any>(this.config.state[name])
          : this.config.state[name](this.observe);
        this._observables.set(name, observable);
      }
      return this._observables.get(name);
    } else if (this.parentStore) {
      return this.parentStore.getObservable(name);
    } else {
      return undefined;
    }
  }
  
  observe = (...names: string[]): Observable<{[name: string]: any}> => {
    if (names.length === 1) {
      return this.getObservable(names[0])
        .map(value => {
          const states = {};
          states[names[0]] = value;
          return states;
        })
    } else if (names.length > 1) {
      return Observable
        .combineLatest(...names.map(name => this.getObservable(name)), (...values: any[]) => {
          return values.reduce((states, value, i) => {
            states[names[i]] = value;
            return states;
          }, {});
        });
    } else {
      throw new Error('names length is 0');
    }
  }
  
  access(): StorePermit {
    return new StorePermit(this);
  }
  
  destroy() {
    if (typeof this._startupTeardown === 'function') this._startupTeardown();
    if (this._startupPermit instanceof StorePermit) this._startupPermit.destroy();
    
    this._startupTeardown = null;
    this._startupPermit = null;
    
    this._observables.forEach(observable => {
      if (observable instanceof Subject) {
        observable.complete();
        observable.unsubscribe();
      }
    })
    
    this._observables.clear();
    this._destroyed = true;
  }
}