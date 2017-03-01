import {Store} from '../src';
import {EmptyObservable} from 'rxjs/observable/EmptyObservable';

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

describe('Store.observe', () => {
  it('없는 state의 경우에는 명시적인 error를 발생시킨다', () => {
    const store = createStore();
    expect(() => store.observe('b')).toThrow();
  })
  
  it('Store 파괴 이후에는 Observable.empty()를 날려주되, console.error()를 발생시킨다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    expect(store.observe('a')).not.toBeInstanceOf(EmptyObservable);
    
    store.destroy();
    expect(store.observe('a')).toBeInstanceOf(EmptyObservable);
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('상위 Store의 state를 observe 할 수 있다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    
    return childStore.observe('a', 'b', 'c').first().toPromise().then(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(b).toEqual(2);
      expect(c).toEqual(3);
    });
  })
  
  it('하위 Store의 state를 observe 할 수 없다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    
    expect(() => store.observe('b', 'c')).toThrow();
  })
})