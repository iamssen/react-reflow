import {Store} from '../src';

const createStore = () => new Store({
  state: {
    a: 1,
  }
})

const createChildStore = (parent: Store) => new Store({
  state: {
    b: 2,
    c: observe => observe('a', 'b').map(({a, b}) => a + b),
  }
}, parent)

describe('StorePermit.hasState', () => {
  it('정상적으로 판단하고, 상위 Store까지 포함해서 판단한다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = store.access();
    const childPermit = childStore.access();
    
    expect(store.hasState('a')).toBeTruthy();
    expect(store.hasState('b')).toBeFalsy();
    expect(store.hasState('c')).toBeFalsy();
    expect(store.hasState('d')).toBeFalsy();
    expect(childStore.hasState('a')).toBeTruthy();
    expect(childStore.hasState('b')).toBeTruthy();
    expect(childStore.hasState('c')).toBeTruthy();
    expect(childStore.hasState('d')).toBeFalsy();
    
    expect(permit.hasState('a')).toBeTruthy();
    expect(permit.hasState('b')).toBeFalsy();
    expect(permit.hasState('c')).toBeFalsy();
    expect(permit.hasState('d')).toBeFalsy();
    expect(childPermit.hasState('a')).toBeTruthy();
    expect(childPermit.hasState('b')).toBeTruthy();
    expect(childPermit.hasState('c')).toBeTruthy();
    expect(childPermit.hasState('d')).toBeFalsy();
  })
  
  it('Store 파괴 이후엔 무조건 false를 던지되, console.error()를 통해 알려준다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    store.destroy();
    expect(permit.hasState('a')).toBeFalsy();
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('StorePermit 파괴 이후엔 무조건 false를 던지되, console.error()를 통해 알려준다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    permit.destroy();
    expect(permit.hasState('a')).toBeFalsy();
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
})