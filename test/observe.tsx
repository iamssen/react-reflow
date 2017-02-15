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
    expect(() => {
      permit.getState('d').then(({d}) => {
      })
    }).toThrow();
  })
  
  it('', () => {
    expect(() => {
      permit.observe('d')
    }).toThrow();
  })
})