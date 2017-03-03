import {Store} from '../src/store';
import {timer} from './utils/timer';

const createStore = () => {
  return new Store({
    state: {
      a: 1,
    }
  })
}

const createChildStore = (parent: Store) => {
  return new Store({
    state: {
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b),
    }
  }, parent)
}

describe('StorePermit.dispatch', () => {
  it('Update가 정상적으로 이루어짐', () => {
    const store = createStore();
    const permit = store.access();
    
    permit.dispatch({a: 10});
    
    return permit.getState('a')
      .then(({a}) => expect(a).toEqual(10))
  })
  
  it('Promise Update가 정상적으로 이루어짐', () => {
    const store = createStore();
    const permit = store.access();
    
    permit.dispatch(timer(10).then(() => ({a: 10})));
    
    return timer(20)
      .then(() => permit.getState('a'))
      .then(({a}) => expect(a).toEqual(10))
  })
  
  it('Operation이 정상적으로 이루어짐', () => {
    const store = createStore();
    const permit = store.access();
    
    permit.dispatch(({getState, dispatch}) => {
      getState('a').then(({a}) => {
        dispatch({a: a + 10});
      })
    })
    
    return timer(10)
      .then(() => permit.getState('a'))
      .then(({a}) => expect(a).toEqual(11))
  })
  
  it('Parent Store에 대한 Update가 정상적으로 이루어짐', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = childStore.access();
    
    permit.dispatch({a: 10});
    
    return permit.getState('a', 'b', 'c')
      .then(({a, b, c}) => {
        expect(a).toEqual(10);
        expect(b).toEqual(2);
        expect(c).toEqual(12);
      })
  })
  
  it('Parent Store에 대한 Promise Update가 정상적으로 이루어짐', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = childStore.access();
    
    permit.dispatch(timer(10).then(() => ({a: 10})));
    
    return timer(20)
      .then(() => permit.getState('a', 'b', 'c'))
      .then(({a, b, c}) => {
        expect(a).toEqual(10);
        expect(b).toEqual(2);
        expect(c).toEqual(12);
      })
  })
  
  it('Parent Store에 대한 Operation이 정상적으로 이루어짐', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = childStore.access();
    
    permit.dispatch(({getState, dispatch}) => {
      getState('a').then(({a}) => dispatch({
        a: a + 10,
      }))
    })
    
    return timer(10)
      .then(() => permit.getState('a', 'b', 'c'))
      .then(({a, b, c}) => {
        expect(a).toEqual(11);
        expect(b).toEqual(2);
        expect(c).toEqual(13);
      })
  })
  
  it('Store가 파괴된 이후엔 무시하되, console.error()를 알림', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    
    store.destroy();
    permit.dispatch({a: 10});
    
    expect(console.error).toHaveBeenCalled();
    console.error = error;
  })
  
  it('StorePermit이 파괴된 이후엔 무시하되, console.error()를 알림', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    
    permit.destroy();
    permit.dispatch({a: 10});
    
    expect(console.error).toHaveBeenCalled();
    console.error = error;
  })
  
  it('Operation 상황에서 Tool이 정상적으로 들어오는 것을 확인', () => {
    const mock = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        foo: permit => mock,
      }
    })
    
    const permit = store.access();
    
    permit.dispatch(({foo}:any) => {
      foo();
      expect(foo).toEqual(mock);
      expect(mock).toHaveBeenCalled();
    })
  })
  
  it('Operation 상황에서 상위 Store의 Tool이 정상적으로 들어오는 것을 확인', () => {
    const mock = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        foo: permit => mock,
      }
    })
    const childStore = new Store({
      state: {b: 1},
    }, store)
    
    const permit = childStore.access();
    
    permit.dispatch(({foo}:any) => {
      foo();
      expect(foo).toEqual(mock);
      expect(mock).toHaveBeenCalled();
    })
  })
  
  it('Promise Update는 StorePermit 파괴 이후에 적용되지 않아야한다.', () => {
    const mock = jest.fn();
    const store = createStore();
    const permit = store.access();
    
    permit.dispatch(timer(10).then(() => {
      mock();
      return {a: 100};
    }));
    
    permit.destroy();
    
    return timer(20)
      .then(() => store.getObservable('a').first().toPromise())
      .then(a => {
        expect(mock).toHaveBeenCalled();
        expect(a).toEqual(1);
      })
  })
  
  it('Operation은 StorePermit 파괴 이후에 적용되지 않아야한다.', () => {
    const mock = jest.fn();
    const store = createStore();
    const permit = store.access();
    
    permit.dispatch(({dispatch}) => {
      timer(10).then(() => {
        mock();
        if (!permit.destroyed) dispatch({a: 100});
      })
    })
    
    permit.destroy();
    
    return timer(20)
      .then(() => store.getObservable('a').first().toPromise())
      .then(a => {
        expect(mock).toHaveBeenCalled();
        expect(a).toEqual(1);
      })
  })
  
  it('취소된 Promise Update는 실행되지 않는다.', () => {
    const mock = jest.fn();
    const store = createStore();
    const permit = store.access();
    
    const teardown = permit.dispatch(timer(10).then(() => {
      mock(); // 실행 자체는 되지만,
      return {a: 100}; // Update는 적용되지 않는다
    }));
    
    if (typeof teardown === 'function') teardown();
    
    return timer(20)
      .then(() => store.getObservable('a').first().toPromise())
      .then(a => {
        expect(mock).toHaveBeenCalled();
        expect(a).toEqual(1);
      })
  })
  
  it('취소된 Operation은 StorePermit는 실행되지 않는다.', () => {
    const mock = jest.fn();
    const store = createStore();
    const permit = store.access();
    
    const teardown = permit.dispatch(({dispatch}) => {
      const t = setTimeout(() => {
        mock();
        dispatch({a: 100});
      }, 10);
      
      return () => clearTimeout(t);
    })
    
    if (typeof teardown === 'function') teardown();
    
    return timer(20)
      .then(() => store.getObservable('a').first().toPromise())
      .then(a => {
        expect(mock).not.toHaveBeenCalled();
        expect(a).toEqual(1);
      })
  })
})