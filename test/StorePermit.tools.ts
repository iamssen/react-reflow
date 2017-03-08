import {Store} from '../src';

describe('StorePermit.tools', () => {
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
    const permit = store.access();
    
    permit.tools.dispatch({a: 2});
    permit.tools.observe('a');
    //noinspection JSIgnoredPromiseFromCall
    permit.tools.getState('a');
    
    expect(permit.tools.dispatch).toEqual(mockDispatch);
    expect(permit.tools.observe).toEqual(mockObserve);
    expect(permit.tools.getState).toEqual(mockGetState);
    
    expect(permit.tools.dispatch).toHaveBeenCalled();
    expect(permit.tools.observe).toHaveBeenCalled();
    expect(permit.tools.getState).toHaveBeenCalled();
  })
  
  it('Parent Store에서 선언된 Tool을 내려받아야 한다.', () => {
    const mock = jest.fn();
    
    const store = new Store({
      state: {a: 1},
      tools: {
        foo: permit => mock,
      }
    })
    const permit = store.access();
    
    permit.tools['foo']('a');
    
    expect(permit.tools['foo']).toEqual(mock);
    expect(permit.tools['foo']).toHaveBeenCalled();
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
    const permit = store.access();
    
    expect(permit.tools.dispatch).toEqual(mockDispatch);
    expect(permit.tools.observe).toEqual(mockObserve);
    expect(permit.tools.getState).toEqual(mockGetState);
    
    const childStore = new Store({
      state: {b: 1},
    }, store);
    const childPermit = childStore.access();
    
    expect(childPermit.tools.dispatch).not.toEqual(mockDispatch);
    expect(childPermit.tools.observe).not.toEqual(mockObserve);
    expect(childPermit.tools.getState).not.toEqual(mockGetState);
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
    
    const topPermit = top.access();
    const gen1Permit = gen1.access();
    const gen2Permit = gen2.access();
    const gen3Permit = gen3.access();
    const gen4Permit = gen4.access();
    const gen5Permit = gen5.access();
    const gen6Permit = gen6.access();
    
    gen6Permit.tools['foo']();
    
    expect(topPermit.tools['foo']).toEqual(mock);
    expect(gen1Permit.tools['foo']).toEqual(mock);
    expect(gen2Permit.tools['foo']).toEqual(mock);
    expect(gen3Permit.tools['foo']).toEqual(mock);
    expect(gen4Permit.tools['foo']).toEqual(mock);
    expect(gen5Permit.tools['foo']).toEqual(mock);
    expect(gen6Permit.tools['foo']).toEqual(mock);
    expect(mock).toHaveBeenCalled();
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
    const permit = store.access();
    const childStore = new Store({
      state: {b: 1},
      tools: {
        foo: permit => mock2,
      }
    }, store)
    const childPermit = childStore.access();
    
    childPermit.tools['foo']();
    
    expect(permit.tools['foo']).toEqual(mock1);
    expect(childPermit.tools['foo']).not.toEqual(mock1);
    expect(childPermit.tools['foo']).toEqual(mock2);
    expect(mock1).not.toHaveBeenCalled();
    expect(mock2).toHaveBeenCalled();
  })
  
  it('Store가 파괴된 이후에는 null을 던지고, console.error()로 알려준다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = new Store({
      state: {a: 1},
    })
    const permit = store.access();
    
    store.destroy();
    
    expect(store.destroyed).toBeTruthy();
    expect(permit.destroyed).toBeTruthy();
    expect(permit.tools).toBeNull();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('StorePermit이 파괴된 이후에는 null을 던지고, console.error()로 알려준다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = new Store({
      state: {a: 1},
    })
    const permit = store.access();
    
    permit.destroy();
    
    expect(store.destroyed).toBeFalsy();
    expect(permit.destroyed).toBeTruthy();
    expect(permit.tools).toBeNull();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
})