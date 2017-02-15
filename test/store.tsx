import {Store} from '../src/store';

describe('', () => {
  describe('', () => {
    const store: Store = new Store({
      state: {
        a: 1,
        b: 2,
      },
    })
    
    const child: Store = new Store({
      state: {
        c: 3,
      }
    }, store)
    
    it('', () => {
      expect(store.hasState('a')).toBeTruthy();
      expect(store.hasState('b')).toBeTruthy();
      expect(store.hasState('c')).toBeFalsy();
      expect(child.hasState('a')).toBeTruthy();
      expect(child.hasState('b')).toBeTruthy();
      expect(child.hasState('c')).toBeTruthy();
    })
  })
})