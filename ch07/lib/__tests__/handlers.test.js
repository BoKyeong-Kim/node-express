const handlers = require('../handlers') //테스트 할 코드인 라우트 핸들러 임포트

// 테스트코드에서 해야할 일 : 문자열 home을 가지고 응답 객체의 render 메서드를 호출하는 일
test('home page renders', () => { // 테스트하고 있는 기능에 대한 설명
    const req = {} // 렌더링을 시작하려면 요청과 응답 객체가 필요
    const res = { render : jest.fn() } // 렌더링 함수는 제스트 메서드 jest.fn()을 호출히면 만들어짐
    handlers.home(req, res) 
    expect(res.render.mock.calls.length).toBe(1) //제스트의 모형 함수는 자신이 호출되었을 때를 항상 추적하므로, 이 함수가 단 한번만 호출됐는지 확인
    expect(res.render.mock.calls[0][0]).toBe('home')
    // res.render.mock.calls[0]는 첫 번째로 호출된 상황
    // res.render.mock.calls[0][0]는 그 상황에서 전달받은 매개변수 중 첫 번째
})


test('about page renders with fortune', () => {
    const req = {}
    const res = { render: jest.fn() }
    handlers.about(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('about')
    expect(res.render.mock.calls[0][1])
      .toEqual(expect.objectContaining({
        fortune: expect.stringMatching(/\W/),
      }))
  })
  
  test('404 handler renders', () => {
    const req = {}
    const res = { render: jest.fn() }
    handlers.notFound(req, res)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('404')
  })
  
  test('500 handler renders', () => {
    const err = new Error('some error')
    const req = {}
    const res = { render: jest.fn() }
    const next = jest.fn()
    handlers.serverError(err, req, res, next)
    expect(res.render.mock.calls.length).toBe(1)
    expect(res.render.mock.calls[0][0]).toBe('500')
  })