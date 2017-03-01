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

describe('Store.hasParent', () => {
  it('상위 Store가 없는 경우 false를 return한다.', () => {
    const store = createStore();
    expect(store.hasParent()).toBeFalsy();
  })
  
  it('상위 Store가 있는 경우 true를 return한다.', () => {
    const store = createStore();
    const child = createChildStore(store);
    expect(child.hasParent()).toBeTruthy();
  })
  
  it('상위 Store가 파괴된 경우 false를 return하지만, console.error()로 경고한다.', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const child = createChildStore(store);
    store.destroy();
    
    expect(child.hasParent()).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('Store가 파괴된 경우 false를 return하지만, console.error()로 경고한다.', () => {
    const error = console.error;
    console.error = jest.fn();
  
    const store = createStore();
    store.destroy();
  
    expect(store.hasParent()).toBeFalsy();
    expect(console.error).toHaveBeenCalled();
  
    console.error = error;
  })
})