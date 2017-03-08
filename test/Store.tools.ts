import {Store} from '../src';

describe('Store.tools', () => {
  it('기본 dispatch, observe, getState 역시 덮어쓰기가 가능해야 한다.', () => {
    const mockDispatch = jest.fn();
    const mockObserve = jest.fn();
    const mockGetState = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        dispatch: permit => mockDispatch,
        observe: permit => mockObserve,
        getState: permit => mockGetState,
      }
    })
    
    expect(store.tools.dispatch(null)).toEqual(mockDispatch);
    expect(store.tools.observe(null)).toEqual(mockObserve);
    expect(store.tools.getState(null)).toEqual(mockGetState);
    
    return new Promise(done => {
      new Store({
        state: {a: 1},
        tools: {
          dispatch: permit => mockDispatch,
          observe: permit => mockObserve,
          getState: permit => mockGetState,
        },
        startup: ({dispatch, observe, getState}) => {
          dispatch({a: 2});
          observe('a');
          //noinspection JSIgnoredPromiseFromCall
          getState('a');
          
          expect(dispatch).toEqual(mockDispatch);
          expect(dispatch).toHaveBeenCalled();
          
          expect(observe).toEqual(mockObserve);
          expect(observe).toHaveBeenCalled();
          
          expect(getState).toEqual(mockGetState);
          expect(getState).toHaveBeenCalled();
          
          done();
        }
      })
    })
  })
  
  it('Parent Store에서 선언된 Tool을 내려받아야 한다.', () => {
    const mock = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        foo: permit => mock,
      }
    })
    
    expect(store.tools.foo(null)).toEqual(mock);
    
    return new Promise(done => {
      new Store({
        state: {b: 2},
        startup: ({foo}:any) => {
          foo();
          expect(foo).toEqual(mock);
          expect(foo).toHaveBeenCalled();
          done();
        }
      }, store);
    })
  })
  
  it('기본 dispatch, observe, getState는 Parent Store에서 내려받지 않는다.', () => {
    const mockDispatch = jest.fn();
    const mockObserve = jest.fn();
    const mockGetState = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        dispatch: permit => mockDispatch,
        observe: permit => mockObserve,
        getState: permit => mockGetState,
      }
    })
    
    expect(store.tools.dispatch(null)).toEqual(mockDispatch);
    expect(store.tools.observe(null)).toEqual(mockObserve);
    expect(store.tools.getState(null)).toEqual(mockGetState);
    
    return new Promise(done => {
      new Store({
        state: {a: 1},
        startup: ({dispatch, observe, getState}) => {
          expect(dispatch).not.toEqual(mockDispatch);
          expect(observe).not.toEqual(mockObserve);
          expect(getState).not.toEqual(mockGetState);
          done();
        }
      }, store)
    })
  })
  
  it('Parent Store에서 선언된 Tool을 내려받아야 한다. 좀 더 다단계 상태 확인', () => {
    const mock = jest.fn();
    
    const top = new Store({
      state: {a: 1},
      tools: {
        foo: permit => mock,
      }
    })
    
    const gen1 = new Store({
      state: {b: 1},
    }, top);
    
    const gen2 = new Store({
      state: {c: 1},
    }, gen1);
    
    const gen3 = new Store({
      state: {d: 1},
    }, gen2);
    
    const gen4 = new Store({
      state: {e: 1},
    }, gen3);
    
    const gen5 = new Store({
      state: {f: 1},
    }, gen4);
    
    const gen6 = new Store({
      state: {g: 1},
    }, gen5);
    
    expect(top.tools.foo(null)).toEqual(mock);
    expect(gen1.tools.foo(null)).toEqual(mock);
    expect(gen2.tools.foo(null)).toEqual(mock);
    expect(gen3.tools.foo(null)).toEqual(mock);
    expect(gen4.tools.foo(null)).toEqual(mock);
    expect(gen5.tools.foo(null)).toEqual(mock);
    expect(gen6.tools.foo(null)).toEqual(mock);
    
    return new Promise(done => {
      new Store({
        state: {h: 2},
        startup: ({foo}:any) => {
          foo();
          expect(foo).toEqual(mock);
          expect(foo).toHaveBeenCalled();
          done();
        }
      }, gen6);
    })
  })
  
  it('Parent Store에서 선언된 Tool을 덮어써야한다.', () => {
    const mock1 = jest.fn();
    const mock2 = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        foo: permit => mock1,
      }
    })
    
    expect(store.tools.foo(null)).toEqual(mock1);
    
    return new Promise(done => {
      new Store({
        state: {b: 2},
        tools: {
          foo: permit => mock2,
        },
        startup: ({foo}:any) => {
          foo();
          expect(foo).not.toEqual(mock1);
          expect(mock1).not.toHaveBeenCalled();
          expect(foo).toEqual(mock2);
          expect(foo).toHaveBeenCalled();
          done();
        }
      }, store);
    })
  })
  
  it('Store가 파괴된 이후에는 null을 던지고, console.error()로 알려준다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = new Store({
      state: {a: 1},
    })
    
    store.destroy();
    
    expect(store.destroyed).toBeTruthy();
    expect(store.tools).toBeNull();
    expect(console.error).toHaveBeenCalled();
  
    console.error = error;
  })
})