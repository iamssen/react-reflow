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

describe('Store.update', () => {
  it('없는 state를 update하려 할 때 명시적인 error를 발생시킨다.', () => {
    const store = createStore();
    expect(() => store.update('d', 5)).toThrow();
  })
  
  it('Plain state가 아니면 명시적인 error를 발생시킨다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    expect(() => childStore.update('c', 5)).toThrow();
  })
  
  it('상위 Store를 update 할 수 있다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    childStore.update('a', 10);
    return store.getObservable('a').first().toPromise().then(a => 10);
  })
  
  it('Store 파괴 이후 호출을 무시하되, console.error()를 통해 알려준다.', () => {
    const error = console.error;
    console.error = jest.fn();
  
    const store = createStore();
    store.destroy();
    store.update('a', 10);
  
    expect(console.error).toHaveBeenCalled();
  
    console.error = error;
  })
})