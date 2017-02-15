import {Store, StorePermit} from '../src/store';

describe('getState', () => {
  const store: Store = new Store({
    state: {
      a: 1,
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b),
    }
  })
  
  const permit: StorePermit = store.access();
  
  it('', () => {
    return permit.getState('a', 'b', 'c').then(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(b).toEqual(2);
      expect(c).toEqual(3);
    })
  })
  
  it('', () => {
    permit.dispatch({a: 10, b: 20});
    return permit.getState('a', 'b', 'c').then(({a, b, c}) => {
      expect(a).toEqual(10);
      expect(b).toEqual(20);
      expect(c).toEqual(30);
    })
  })
})