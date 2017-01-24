import {Store, StorePermit, ActionTools} from '../src/store';
import {timer} from './utils/timer';

describe('Action', () => {
  const store: Store = new Store({
    state: {
      a: 1,
      b: 2,
      c: observe => observe('a', 'b').map(({a, b}) => a + b),
    }
  })
  
  const permit: StorePermit = store.access();
  
  // dispatch ( update | promise<update> | operation ) => teardown()
  
  // Store update
  // TODO 순수 value의 업데이트와 operation value의 업데이트 모두 잘 되어야 한다
  // TODO cancel된 async dispatch는 반영되지 않아야 한다
  // Teardown
  // TODO 여러번 teardown()이 실행되어도 안전해야 한다
  // TODO operation action teardown()은 한 번만 실행되어야 한다
  // TODO teardown()을 선언하지 않은 operation도 teardown 실행에 안전해야 한다 (undefined bug)
  // Frame
  // Store destory
  // TODO store가 파괴되었을때 async update에서 에러가 일어나지 않아야 한다 (무시해야 한다)
  // Permit destroy
  // TODO permit이 파괴되었을때 async update가 반영되지 않아야 한다 (무시해야 한다)
  
  afterEach(() => {
    permit.observe('a', 'b', 'c').first().subscribe(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(c).toEqual(a + b);
    })
  })
  
  it('Action should update b and c', () => {
    permit.observe('b', 'c').debounceTime(10).subscribe(({b, c}) => {
      expect(b).toEqual(100);
      expect(c).toEqual(101);
    })
    permit.dispatch({b: 100});
  })
  
  it('Action should update b and c', () => {
    permit.observe('b', 'c').debounceTime(10).subscribe(({b, c}) => {
      expect(b).toEqual(200);
      expect(c).toEqual(201);
    })
    permit.dispatch(timer(10).then(() => ({b: 200})));
  })
  
  it('Action should update b and c', () => {
    permit.observe('b', 'c').debounceTime(10).subscribe(({b, c}) => {
      expect(b).toEqual(300);
      expect(c).toEqual(301);
    })
    permit.dispatch(({dispatch}) => {
      setTimeout(() => dispatch({b: 300}), 10);
    })
  })
  
  it('Action should be canceled', done => {
    const cancel = permit.dispatch(timer(20).then(() => {
      return {a: 1000};
    }))
    
    setTimeout(cancel, 10);
    setTimeout(done, 40);
  })
  
  it('Action should be canceled', done => {
    const cancel = permit.dispatch(({dispatch}:ActionTools) => {
      const timeout: number = setTimeout(() => {
        dispatch({a: 1000});
        done.fail();
      }, 30);
      
      return () => clearTimeout(timeout);
    });
    
    setTimeout(cancel, 10);
    setTimeout(done, 40);
  })
  
  it('It should be safe to cancel multiple times', done => {
    const teardown = permit.dispatch(timer(50).then(() => {
      return {a: 1000};
    }))
    
    setTimeout(teardown, 10);
    setTimeout(teardown, 20);
    setTimeout(teardown, 30);
    setTimeout(teardown, 40);
    setTimeout(done, 100);
  })
  
  it('It should be safe to cancel multiple times', done => {
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