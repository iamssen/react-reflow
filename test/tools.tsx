import {Store, StorePermit} from '../src/store';
import {Tools} from '../src/types';

declare module '../src/types' {
  interface Tools {
    multiply: (a: number, b: number) => number,
    doublingB: () => void,
  }
}

const multiply = (permit: StorePermit) => (x: number, y: number) => {
  return x * y;
}

const doublingB = (permit: StorePermit) => () => {
  permit.observe('b').first().subscribe(({b}) => {
    permit.dispatch({b: b * 2});
  });
}

describe('Action Tools', () => {
  let store: Store, permit: StorePermit;
  
  beforeAll(() => {
    store = new Store({
      state: {
        a: 1,
        b: 2,
        c: observe => observe('a', 'b').map(({a, b}) => a + b),
      },
      tools: {
        multiply,
        doublingB,
      },
      startup: ({observe, dispatch, multiply, doublingB}:Tools) => {
        expect(typeof observe).toEqual('function');
        expect(typeof dispatch).toEqual('function');
        expect(typeof multiply).toEqual('function');
        expect(typeof doublingB).toEqual('function');
        expect(multiply(2, 3)).toEqual(6);
      }
    });
    
    permit = store.access();
  })
  
  it('Get all action tools properly', () => {
    permit.dispatch(({observe, dispatch, multiply, doublingB}:Tools) => {
      expect(typeof observe).toEqual('function');
      expect(typeof dispatch).toEqual('function');
      expect(typeof multiply).toEqual('function');
      expect(typeof doublingB).toEqual('function');
      expect(multiply(2, 3)).toEqual(6);
    });
  })
  
  it('Custom action tool makes good use of store permit', done => {
    permit.observe('b').take(2).bufferCount(2)
      .do(([prev, next]:{b: number}[]) => {
        expect(prev.b * 2).toEqual(next.b);
      })
      .subscribe(() => done(), e => done.fail(e));
    
    permit.dispatch(({doublingB}:Tools) => {
      doublingB();
    });
  })
})

describe('Action Tools Hierarchy', () => {
  const store: Store = new Store({
    state: {
      a: 1
    },
    tools: {
      multiply
    }
  })
  
  const child: Store = new Store({
    state: {
      b: 2
    }
  }, store)
  
  const permit: StorePermit = child.access()
  
  it('Get action tools from the parent context', () => {
    permit.dispatch(({multiply}:Tools) => {
      expect(typeof multiply).toEqual('function');
      expect(multiply(2, 3)).toEqual(6);
    })
  })
})