import {Observable, Subscription, BehaviorSubject, Subject, Scheduler} from 'rxjs';
import {Action, Tools, Teardown, ContextConfig, Observe, GetState, Dispatch} from './types';

// ---------------------------------------------
// Tools
// ---------------------------------------------
const observe = (permit: StorePermit) => (...names: string[]) => {
  return permit.observe(...names);
}

const getState = (permit: StorePermit) => (...names: string[]) => {
  return permit.getState(...names);
}

const dispatch = (permit: StorePermit) => (action: Action) => {
  return permit.dispatch(action);
}

// ---------------------------------------------
// StorePermit
// ---------------------------------------------
function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
}

export class StorePermit {
  private _destroyed: boolean;
  private _subjects: BehaviorSubject<any>[];
  private _subscriptions: Subscription[];
  
  constructor(private store: Store) {
    this._destroyed = false;
    this._subjects = [];
    this._subscriptions = [];
  }
  
  get destroyed(): boolean {
    return this._destroyed
      || !this.store
      || this.store.destroyed;
  }
  
  get tools(): Tools {
    const tools: any = {
      observe: observe(this),
      dispatch: dispatch(this),
      getState: getState(this),
    }
    
    const storeTools = this.store.tools;
    Object.keys(storeTools).forEach(name => {
      tools[name] = storeTools[name](this);
    });
    
    return tools;
  }
  
  hasParent = (): boolean => {
    return this.store
      && !this.store.destroyed
      && this.store.hasParent();
  }
  
  hasState = (name: string): boolean => {
    return this.store
      && !this.store.destroyed
      && this.store.hasState(name);
  }
  
  isPlainState = (name: string): boolean => {
    return this.store
      && !this.store.destroyed
      && this.store.isPlainState(name);
  }
  
  observe: Observe = (...names: string[]) => {
    if (this.destroyed) {
      return Observable.empty();
    }
    const subject = new BehaviorSubject<any>(null);
    this._subjects.push(subject);
    this._subscriptions.push(this.store.observe(...names).subscribe(subject));
    return subject.distinctUntilChanged().debounceTime(1, Scheduler.queue);
  }
  
  getState: GetState = (...names: string[]) => {
    if (this.destroyed) return Promise.resolve({});
    return this.store.observe(...names).first().toPromise();
  }
  
  dispatch: Dispatch = (action: Action) => {
    if (typeof action === 'function') { // case Operate
      let broken: boolean = false;
      const teardown = action(this.tools);
      
      return () => {
        if (!broken && typeof teardown === 'function') teardown();
        broken = true;
      }
    } else if (isPromise(action)) { // case UpdatePromise
      let broken: boolean = false;
      
      Promise.resolve(action).then(update => {
        if (broken) return;
        Object.keys(update).forEach(name => {
          if (this.store.isPlainState(name)) this.store.update(name, update[name]);
        })
      })
      
      return () => broken = true;
    } else { // case Update
      const update = action;
      
      Object.keys(update).forEach(name => {
        if (this.store.isPlainState(name)) this.store.update(name, update[name]);
      })
      
      return () => {
      };
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
    
    this.store = null;
  }
}

// ---------------------------------------------
// Store
// ---------------------------------------------
function excludeDefaultTools(tools: Object) {
  const keys = Object.keys(tools);
  if (keys.length === 0) return {};
  
  const defaultTools = ['dispatch', 'observe', 'getState'];
  return keys
    .filter(key => defaultTools.indexOf(key) === -1)
    .reduce((filtertedTools, key) => {
      filtertedTools[key] = tools[key];
      return filtertedTools;
    }, {});
}

export class Store {
  private _observables: Map<string, Observable<any>>;
  private _destroyed: boolean;
  private _startupPermit: StorePermit;
  private _startupTeardown: Teardown;
  
  get destroyed(): boolean {
    return this._destroyed;
  }
  
  get tools(): {[name: string]: (permit: StorePermit) => any} {
    const tools = this.config && this.config.tools ? this.config.tools : {};
    return this.parentStore
      ? Object.assign({}, excludeDefaultTools(this.parentStore.tools), tools)
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
  
  hasParent = (): boolean => {
    if (this._destroyed) {
      console.error('Store 파괴 이후엔 hasParent()가 호출되면 안됨. 찾아서 삭제할 것.');
      return false;
    }
    
    if (this.parentStore) {
      if (!this.parentStore.destroyed) {
        return true;
      } else {
        console.error(
          'The parent store has already been destroyed.\n' +
          'This hasParent() should not be executed.\n' +
          'Do not let this hasParent() execute.'
        );
        return false;
      }
    } else {
      return false;
    }
  }
  
  hasState = (name: string): boolean => {
    if (this._destroyed) {
      console.error('Store 파괴 이후엔 hasState()가 호출되면 안됨. 찾아서 삭제할 것.');
      return false;
    }
    
    return this.config.state[name] !== undefined
      || (this.parentStore && this.parentStore.hasState(name));
  }
  
  isPlainState = (name: string): boolean => {
    if (this._destroyed) {
      console.error('Store 파괴 이후엔 isPlainState()가 호출되면 안됨. 찾아서 삭제할 것.');
      return false;
    }
    
    if (!this.hasState(name)) {
      throw new Error(`"${name}"은 찾을 수 없는 state name이다.`);
    }
    
    if (this.config.state[name] !== undefined) {
      return typeof this.config.state[name] !== 'function';
    } else if (this.parentStore) {
      return this.parentStore.isPlainState(name);
    }
  }
  
  update = (name: string, value: any) => {
    if (this._destroyed) {
      console.error('Store 파괴 이후에는 update()가 호출되면 안됨. 찾아서 삭제할 것.');
      return;
    }
    
    if (!this.hasState(name)) {
      throw new Error(`"${name}"은 찾을 수 없는 state name이다.`);
    }
    
    if (!this.isPlainState(name)) {
      throw new Error(`"${name}"은 Plain State가 아니기 때문에 update 할 수 없다.`);
    }
    
    if (this.config.state[name] !== undefined) {
      const observable: Observable<any> = this.getObservable(name);
      if (observable instanceof Subject) observable.next(value);
    } else if (this.parentStore) {
      this.parentStore.update(name, value);
    }
  }
  
  getObservable = (name: string): Observable<any> => {
    if (this._destroyed) {
      console.error('Store 파괴 이후 getObservable()이 호출되면 안됨. 찾아서 삭제할 것.');
      return Observable.empty();
    }
    
    if (!this.hasState(name)) {
      throw new Error(`"${name}" is a state name that can not be found.`);
    }
    
    if (this.config.state[name] !== undefined) { // case state is in local
      if (!this._observables.has(name)) { // not exists
        const observable: Observable<any> = this.isPlainState(name)
          ? new BehaviorSubject<any>(this.config.state[name])
          : this.config.state[name](this.observe);
        this._observables.set(name, observable);
      }
      return this._observables.get(name);
    } else if (this.parentStore) { // case state is in the parent
      return this.parentStore.getObservable(name);
    }
  }
  
  observe = (...names: string[]): Observable<{[name: string]: any}> => {
    if (this._destroyed) {
      console.error('Store 파괴 이후 observe()는 호출되면 안됨. 찾아서 삭제할 것.');
      return Observable.empty();
    }
    
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
  
  access = (): StorePermit => {
    return !this._destroyed ? new StorePermit(this) : null;
  }
  
  destroy = () => {
    if (this._destroyed) {
      console.error('Store.destroy() can not be executed multiple times. Find and delete redundant code.');
      return;
    }
    
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