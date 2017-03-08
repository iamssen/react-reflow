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

describe('StorePermit.observe', () => {
  it('없는 state의 경우에는 명시적인 error를 발생시킨다', () => {
    const store = createStore();
    const permit = store.access();
    expect(() => permit.observe('b')).toThrow();
  })
  
  it('Store 파괴 이후에는 Observable.empty()를 날려주되, console.error()를 발생시킨다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    expect(permit.observe('a')).not.toBeInstanceOf(EmptyObservable);
    
    store.destroy();
    expect(permit.observe('a')).toBeInstanceOf(EmptyObservable);
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('StorePermit 파괴 이후에는 Observable.empty()를 날려주되, console.error()를 발생시킨다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    const permit = store.access();
    expect(permit.observe('a')).not.toBeInstanceOf(EmptyObservable);
    
    permit.destroy();
    expect(permit.observe('a')).toBeInstanceOf(EmptyObservable);
    
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('상위 Store의 state를 observe 할 수 있다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = childStore.access();
    
    return permit.observe('a', 'b', 'c').first().toPromise().then(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(b).toEqual(2);
      expect(c).toEqual(3);
    });
  })
  
  it('하위 Store의 state를 observe 할 수 없다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = store.access();
    
    expect(() => permit.observe('b', 'c')).toThrow();
  })
  
  it('Store 파괴 이후엔 Subscription이 closed 되어야한다.', () => {
    const store = createStore();
    const permit = store.access();
    
    const subscription = permit.observe('a').subscribe(({a}) => {
      expect(a).toEqual(1);
    })
  
    expect(subscription.closed).toBeFalsy();
    store.destroy();
    expect(subscription.closed).toBeTruthy();
  })
  
  it('StorePermit 파괴 이후엔 Subscription이 closed 되어야한다.', () => {
    const store = createStore();
    const permit = store.access();
    
    const subscription = permit.observe('a').subscribe(({a}) => {
      expect(a).toEqual(1);
    })
  
    expect(subscription.closed).toBeFalsy();
    permit.destroy();
    expect(subscription.closed).toBeTruthy();
  })
})