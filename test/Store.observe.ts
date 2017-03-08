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
  
  it('Store permit를 파괴하면 하위의 Subscription들 역시 파괴되어야 한다', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = store.access();
    const childPermit = childStore.access();
    const a = permit.observe('a').subscribe(({a}) => a);
    const a1 = childPermit.observe('a').subscribe(({a}) => a);
    const b1 = childPermit.observe('b').subscribe(({b}) => b);
    const c1 = childPermit.observe('c').subscribe(({c}) => c);
    
    permit.destroy();
    expect(a.closed).toBeTruthy();
    expect(a1.closed).toBeFalsy(); // permit과 childPermit은 상관없는 별개이기 때문에 permit이 파괴되어도 childPermit엔 영향이 없다
    expect(b1.closed).toBeFalsy();
    expect(c1.closed).toBeFalsy();
    
    childPermit.destroy();
    expect(a.closed).toBeTruthy();
    expect(a1.closed).toBeTruthy();
    expect(b1.closed).toBeTruthy();
    expect(c1.closed).toBeTruthy();
  })
  
  it('Store를 파괴하면 하위의 Subscription들 역시 파괴되어야 한다', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    const permit = store.access();
    const childPermit = childStore.access();
    const a = permit.observe('a').subscribe(({a}) => a);
    const a1 = childPermit.observe('a').subscribe(({a}) => a);
    const b1 = childPermit.observe('b').subscribe(({b}) => b);
    const c1 = childPermit.observe('c').subscribe(({c}) => c);
  
    store.destroy();
    expect(a.closed).toBeTruthy();
    expect(a1.closed).toBeTruthy(); // store의 파괴는 하위 store에 영향을 미치기 때문에 하위 subscription이 closed 된다
    expect(b1.closed).toBeFalsy();
    expect(c1.closed).toBeFalsy();
  
    childStore.destroy();
    expect(a.closed).toBeTruthy();
    expect(a1.closed).toBeTruthy();
    expect(b1.closed).toBeTruthy();
    expect(c1.closed).toBeTruthy();
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