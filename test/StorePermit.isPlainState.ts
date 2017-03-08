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

describe('StorePermit.isPlainState', () => {
  it('정상적으로 판단하고, 상위 Store까지 포함해서 판단한다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = store.access();
    const childPermit = childStore.access();
    
    expect(store.isPlainState('a')).toBeTruthy();
    expect(childStore.isPlainState('a')).toBeTruthy();
    expect(childStore.isPlainState('b')).toBeTruthy();
    expect(childStore.isPlainState('c')).toBeFalsy();
    
    expect(permit.isPlainState('a')).toBeTruthy();
    expect(childPermit.isPlainState('a')).toBeTruthy();
    expect(childPermit.isPlainState('b')).toBeTruthy();
    expect(childPermit.isPlainState('c')).toBeFalsy();
  })
  
  it('없는 state는 명시적인 error를 뿜어낸다.', () => {
    const store = createStore();
    const permit = store.access();
    expect(() => permit.isPlainState('c')).toThrow();
  })
  
  it('Store 파괴 이후엔 무조건 false를 던지고, console.error()를 사용해서 알린다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    store.destroy();
    expect(permit.isPlainState('a')).toBeFalsy();
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('StorePermit 파괴 이후엔 무조건 false를 던지고, console.error()를 사용해서 알린다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    permit.destroy();
    expect(permit.isPlainState('a')).toBeFalsy();
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
})