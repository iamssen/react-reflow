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

describe('Store.getObservable()', () => {
  it('없는 State의 경우에는 명시적인 Error를 발생시킨다', () => {
    const store = createStore();
    expect(() => store.getObservable('b')).toThrow();
  })
  
  it('Plain state가 제대로 들어와야한다?', () => {
    const store = createStore();
    return store.getObservable('a').first().toPromise()
      .then(a => {
        expect(a).toEqual(1);
        store.update('a', 2);
        return store.getObservable('a').first().toPromise();
      })
      .then(a => {
        expect(a).toEqual(2);
      })
  })
  
  it('Store 파괴 이후에는 Observable.empty()를 날려주되, console.error()를 사용해서 경고한다', () => {
    const error = console.error;
    console.error = jest.fn();
    
    const store = createStore();
    expect(store.getObservable('a')).not.toBeInstanceOf(EmptyObservable);
    
    store.destroy();
    expect(store.getObservable('a')).toBeInstanceOf(EmptyObservable);
    
    expect(store.destroyed).toBeTruthy();
    expect(console.error).toHaveBeenCalled();
    
    console.error = error;
  })
  
  it('상위 Store의 state를 observe 할 수 있다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    
    return childStore.getObservable('a').first().toPromise().then(a => expect(a).toEqual(1));
  })
  
  it('하위 Store의 state를 observe 할 수 없다.', () => {
    const store = createStore();
    const childStore = createChildStore(store);
    
    expect(() => store.getObservable('b')).toThrow();
  })
})