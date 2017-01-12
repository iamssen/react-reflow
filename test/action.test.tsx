import {Store, StorePermit, ActionTools} from '../src/store';
import {timer} from './timer';

describe('Action', () => {
  const store: Store = new Store({
    state: {
      a: 1,
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b),
    }
  })
  
  const permit: StorePermit = store.access();
  
  afterEach(() => {
    permit.observe('a', 'b', 'c').first().subscribe(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(c).toEqual(a + b);
    })
  })
  
  it('Action will change b and c', () => {
    permit.observe('b', 'c').first().subscribe(({b, c}) => {
      expect(b).toEqual(100);
      expect(c).toEqual(101);
    })
    permit.dispatch({b: 100});
  })
  
  it('Action will change b and c', () => {
    permit.observe('b', 'c').take(2).last().subscribe(({b, c}) => {
      expect(b).toEqual(200);
      expect(c).toEqual(201);
    })
    permit.dispatch(timer(10).then(() => ({b: 200})));
  })
  
  it('Action will change b and c', () => {
    permit.observe('b', 'c').take(2).last().subscribe(({b, c}) => {
      expect(b).toEqual(300);
      expect(c).toEqual(301);
    })
    permit.dispatch(({dispatch}) => {
      setTimeout(() => dispatch({b: 300}), 10);
    })
  })
  
  it('Action can be canceled', done => {
    const cancel = permit.dispatch(timer(20).then(() => {
      return {a: 1000};
    }))
    
    setTimeout(cancel, 10);
    setTimeout(done, 100);
  })
  
  it('Action can be canceled', done => {
    const cancel = permit.dispatch(({dispatch}:ActionTools) => {
      const timeout: number = setTimeout(() => {
        dispatch({a: 1000});
        done.fail();
      }, 30);
      
      return () => clearTimeout(timeout);
    });
    
    setTimeout(cancel, 10);
    setTimeout(done, 100);
  })
  
  it('Teardown multiple runs are safe', done => {
    const teardown = permit.dispatch(timer(50).then(() => {
      return {a: 1000};
    }))
    
    setTimeout(teardown, 10);
    setTimeout(teardown, 20);
    setTimeout(teardown, 30);
    setTimeout(teardown, 40);
    setTimeout(done, 100);
  })
  
  it('Teardown multiple runs are safe', done => {
    const teardown = permit.dispatch(({dispatch}:ActionTools) => {
      let t: number = 0;
      const timeout: number = setTimeout(() => {
        dispatch({a: 1000});
        done.fail();
      }, 30);
      
      return () => { // teardown run only once
        if (t > 1) done.fail();
        clearTimeout(timeout);
        t += 1;
      }
    })
    
    setTimeout(teardown, 10);
    setTimeout(teardown, 20);
    setTimeout(teardown, 30);
    setTimeout(teardown, 40);
    setTimeout(done, 100);
  })
})