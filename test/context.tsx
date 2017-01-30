describe('', () => {
  describe('<Context> Element', () => {
    it('<Context prop={?}>을 통해서 업데이트가 되어야 한다?', () => {
      // 이게 가능한가? 초기화가 아니라... 업데이트가? Oneway binding에 의해서 내부 State 변화를
      // 지속적으로 바깥으로 알려줬어야 하는데 이건 불필요한 문제들을 낳지 않나 싶다
      
      // 1. 초기화에만 영향을 미친다
      //  - 초기화 타이밍은?
      //  - 이후 값의 변경이 어떤 영향을 미치지 않는다
      // 2. 초기화 이후 업데이트에는 refs.context.dispatch()를 사용하도록 한다
    })
  })
})