import {Observable, Subscription, BehaviorSubject, Scheduler} from 'rxjs';
import {Action, Tools, Observe, GetState, Dispatch} from './types';
import {Store} from './store';

const observe = (permit: StorePermit) => (...names: string[]) => {
  return permit.observe(...names);
}

const getState = (permit: StorePermit) => (...names: string[]) => {
  return permit.getState(...names);
}

const dispatch = (permit: StorePermit) => (action: Action) => {
  return permit.dispatch(action);
}

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
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.tools가 호출되면 안됨. 확인해서 지울것.');
      return null;
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.tools가 호출되면 안됨. 확인해서 지울것.');
      return null;
    }
    
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
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.hasParent()가 호출되면 안됨. 확인해서 지울것.');
      return false;
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.hasParent()가 호출되면 안됨. 확인해서 지울것.');
      return false;
    }
    
    return this.store
      && !this.store.destroyed
      && this.store.hasParent();
  }
  
  hasState = (name: string): boolean => {
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.hasState()가 호출되면 안됨. 확인해서 지울것.');
      return false;
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.hasState()가 호출되면 안됨. 확인해서 지울것.');
      return false;
    }
    
    return this.store
      && !this.store.destroyed
      && this.store.hasState(name);
  }
  
  isPlainState = (name: string): boolean => {
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.isPlainState()가 호출되면 안됨. 확인해서 지울것.');
      return false;
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.isPlainState()가 호출되면 안됨. 확인해서 지울것.');
      return false;
    }
    
    return this.store
      && !this.store.destroyed
      && this.store.isPlainState(name);
  }
  
  observe: Observe = (...names: string[]) => {
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.observe()가 호출되면 안됨. 확인해서 지울것.');
      return Observable.empty();
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.observe()가 호출되면 안됨. 확인해서 지울것.');
      return Observable.empty();
    }
    
    const subject = new BehaviorSubject<any>(null);
    this._subjects.push(subject);
    this._subscriptions.push(this.store.observe(...names).subscribe(subject));
    return subject.distinctUntilChanged().debounceTime(1, Scheduler.queue);
  }
  
  getState: GetState = (...names: string[]) => {
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.getState()가 호출되면 안됨. 확인해서 지울것.');
      return Promise.resolve({});
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.getState()가 호출되면 안됨. 확인해서 지울것.');
      return Promise.resolve({});
    }
    
    return this.store.observe(...names).first().toPromise();
  }
  
  dispatch: Dispatch = (action: Action) => {
    if (this._destroyed) {
      console.error('StorePermit이 파괴된 이후엔 StorePermit.dispatch()가 호출되면 안됨. 확인해서 지울것.');
      return;
    }
    
    if (this.store && this.store.destroyed) {
      console.error('Store가 파괴된 이후엔 StorePermit.dispatch()가 호출되면 안됨. 확인해서 지울것.');
      return;
    }
    
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
        if (broken || this.destroyed) return;
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
  
  destroy = () => {
    if (this._destroyed) {
      console.error('StorePermit.destroy() can not be executed multiple times. Find and delete redundant code.');
      return;
    }
    
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