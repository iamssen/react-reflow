import {Store, StorePermit} from '../src/store';
import {Subscription} from 'rxjs';

describe('Subscription Chain', () => {
  let store: Store;
  
  beforeEach(() => {
    store = new Store({
      state: {
        a: 1,
        b: 2,
        c: observe => observe('a', 'b').map(({a, b}) => a + b),
      }
    })
  })
  
  it('Store permit를 파괴하면 하위의 Subscription들 역시 파괴되어야 한다', done => {
    const permit: StorePermit = store.access();
    const a: Subscription = permit.observe('a').subscribe(({a}) => a);
    const b: Subscription = permit.observe('b').subscribe(({b}) => b);
    const c: Subscription = permit.observe('c').subscribe(({c}) => c);
    
    setTimeout(() => {
      permit.destroy();
      expect(a.closed).toBeTruthy();
      expect(b.closed).toBeTruthy();
      expect(c.closed).toBeTruthy();
      done();
    }, 10);
  })
  
  it('Store를 파괴하면 하위의 Subscription들 역시 파괴되어야 한다', done => {
    const permit: StorePermit = store.access();
    const a: Subscription = permit.observe('a').subscribe(({a}) => a);
    const b: Subscription = permit.observe('b').subscribe(({b}) => b);
    const c: Subscription = permit.observe('c').subscribe(({c}) => c);
    
    setTimeout(() => {
      store.destroy();
      expect(a.closed).toBeTruthy();
      expect(b.closed).toBeTruthy();
      expect(c.closed).toBeTruthy();
      done();
    }, 10)
  })
})