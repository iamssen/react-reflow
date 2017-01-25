import {Store} from '../src/store';
import {Observable} from 'rxjs';
import {timer} from './utils/timer';

describe('Dispatch', () => {
  const store = new Store({
    state: {
      a: 1
    }
  });
  
  const addStore = new Store({
    state: {
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b)
    }
  }, store);
  
  const subtractStore = new Store({
    state: {
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a - b)
    }
  }, store);
  
  const permit = store.access()
  const add = addStore.access()
  const subtract = subtractStore.access()
  
  it('Dispatch from children can change local and parent state', done => {
    Observable.combineLatest(
      add.observe('a', 'b', 'c').take(2).bufferCount(2).do(([prev, next]:{a: number, b: number, c: number}[]) => {
        expect(prev.a).not.toEqual(next.a); // changed store.a
        expect(prev.b).not.toEqual(next.b); // changed add.b
        expect(prev.c).not.toEqual(next.c); // changed store.a + add.b
        expect(next.a + next.b).toEqual(next.c);
      }),
      
      subtract.observe('a', 'b', 'c').take(2).bufferCount(2).do(([prev, next]:{a: number, b: number, c: number}[]) => {
        expect(prev.a).not.toEqual(next.a); // changed store.a
        expect(prev.b).toEqual(next.b);     // not changed subtract.b
        expect(prev.c).not.toEqual(next.c); // changed store.a + subtract.b
        expect(next.a - next.b).toEqual(next.c);
      })
    ).subscribe(() => done(), e => done.fail(e))
    
    timer(10).then(() => add.dispatch({a: 10, b: 20}));
  })
  
  it('Dispatch from the parent can affect to children operation state', done => {
    Observable.combineLatest(
      add.observe('a', 'b', 'c').take(2).bufferCount(2).do(([prev, next]:{a: number, b: number, c: number}[]) => {
        expect(prev.a).not.toEqual(next.a);
        expect(prev.b).not.toEqual(next.b);
        expect(prev.c).not.toEqual(next.c);
        expect(next.a + next.b).toEqual(next.c);
      }),
      
      subtract.observe('a', 'b', 'c').take(2).bufferCount(2).do(([prev, next]:{a: number, b: number, c: number}[]) => {
        expect(prev.a).not.toEqual(next.a);
        expect(prev.b).toEqual(next.b);
        expect(prev.c).not.toEqual(next.c);
        expect(next.a - next.b).toEqual(next.c);
      })
    ).subscribe(() => done(), e => done.fail(e))
    
    timer(10).then(() => add.dispatch({a: 20, b: 30}));
  })
  
  it('Dispatch from the parent can not affect to children state', done => {
    add.observe('a', 'b', 'c').take(2).bufferCount(2).subscribe(() => {
      done.fail()
    })
    
    subtract.observe('a', 'b', 'c').take(2).bufferCount(2).subscribe(() => {
      done.fail()
    })
    
    timer(10)
      .then(() => {
        permit.dispatch({b: 100, c: 100})
        return timer(100)
      })
      .then(done)
  })
})