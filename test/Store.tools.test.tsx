import {Store} from '../src';

describe('Store.tools', () => {
  it('기본 dispatch, observe, getState 역시 덮어쓰기가 가능해야 한다.', () => {
    const mockDispatch = jest.fn();
    const mockObserve = jest.fn();
    const mockGetState = jest.fn();
    
    // TODO 이런식으로 tools에 대한 테스트도 진행
    const store = new Store({
      state: {a: 1},
      tools: {
        dispatch: mockDispatch,
        observe: mockObserve,
        getState: mockGetState,
      }
    })
    
    expect(store.tools.dispatch).toEqual(mockDispatch);
    expect(store.tools.observe).toEqual(mockObserve);
    expect(store.tools.getState).toEqual(mockGetState);
    
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
})