import {Store} from '../src/store';

const createStore = () => new Store({
  state: {
    a: 1,
  }
});

const createChildStore = (parent: Store) => new Store({
  state: {
    b: 2,
    c: observe => observe('a', 'b').map(({a, b}) => a + b),
  }
}, parent);

describe('StorePermit.hasParent', () => {
  it('상위 Store가 없는 경우 false를 return한다.', () => {
    const store = createStore();
    const permit = store.access();
    expect(permit.hasParent()).toBeFalsy();
  })
  
  it('상위 Store가 있는 경우 true를 return한다.', () => {
    const store = createStore();
    const child = createChildStore(store);
    const permit = child.access();
    expect(permit.hasParent()).toBeTruthy();
  })
  
  it('상위 Store가 파괴된 경우 false를 return한다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const child = createChildStore(store);
    const permit = child.access();
    store.destroy();
    
    expect(permit.hasParent()).toBeFalsy();
    expect(console.error).toHaveBeenCalled(); // console.error() from Store.hasParent()
    
    console.error = error;
  })
  
  it('Store가 파괴된 경우 false를 return하지만, console.error()로 경고한다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    store.destroy();
    
    expect(permit.hasParent()).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('StorePermit이 파괴된 경우 false를 return하지만, console.error()로 경고한다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    permit.destroy();
    
    expect(permit.hasParent()).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
})