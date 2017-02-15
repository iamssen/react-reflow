import {Store, StorePermit} from '../src/store';
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
  
  // TODO store에서 없는 state 이름을 호출할때 명시적인 에러가 나야한다
  
  afterEach(() => {
    permit.observe('a', 'b', 'c').first().subscribe(({a, b, c}) => {
      expect(a).toEqual(1);
      expect(c).toEqual(a + b);
    })
  })
  
  it('Action should update b and c', () => {
    permit.dispatch({b: 100});
    
    return permit.observe('b', 'c').first().toPromise().then(({b, c}) => {
      expect(b).toEqual(100);
      expect(c).toEqual(101);
    })
  })
  
  it('Action should update b and c', () => {
    permit.dispatch(timer(10).then(() => ({b: 200})));
    
    return timer(20)
      .then(() => permit.observe('b', 'c').first().toPromise())
      .then(({b, c}) => {
        expect(b).toEqual(200);
        expect(c).toEqual(201);
      })
  })
  
  it('Action should update b and c', () => {
    permit.dispatch(({dispatch}) => {
      timer(10).then(() => {
        dispatch({b: 300})
      });
    });
    
    return timer(20)
      .then(() => permit.observe('b', 'c').first().toPromise())
      .then(({b, c}) => {
        expect(b).toEqual(300);
        expect(c).toEqual(301);
      })
  })
  
  it('Action should be canceled', () => {
    const cancel = permit.dispatch(timer(20).then(() => ({a: 1000})));
    
    return timer(10)
      .then(() => {
        if (typeof cancel === 'function') cancel();
        return permit.observe('a').first().toPromise();
      })
      .then(({a}) => expect(a).not.toEqual(1000));
  })
  
  it('Action should be canceled', () => {
    let canceled: boolean = false;
    const cancel = permit.dispatch(() => {
      return () => {
        canceled = true;
      }
    });
    
    return timer(10).then(() => {
      if (typeof cancel === 'function') cancel();
      expect(canceled).toBeTruthy();
    })
  })
  
  it('It should be safe to cancel multiple times', () => {
    const cancel = permit.dispatch(timer(50).then(() => ({a: 1000})))
    
    const doCancel = () => {
      if (typeof cancel === 'function') cancel();
      return timer(10);
    }
    
    return timer(10)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(() => permit.observe('a').first().toPromise())
      .then(({a}) => {
        expect(a).not.toEqual(1000);
      })
  })
  
  it('It should be safe to cancel multiple times', () => {
    let cancelCount: number = 0;
    const cancel = permit.dispatch(() => {
      return () => { // teardown run only once
        cancelCount += 1;
      }
    })
    
    const doCancel = () => {
      if (typeof cancel === 'function') cancel();
      return timer(10);
    }
    
    return timer(10)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(doCancel)
      .then(() => {
        expect(cancelCount).toEqual(1);
      })
  })
})