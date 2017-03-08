import {Store} from '../src';

describe('new Store', () => {
  it('금지된 state name은 에러를 발생시킨다', () => {
    expect(() => {
      new Store({
        state: {
          children: 1,
        }
      })
    }).toThrow()
  })
})