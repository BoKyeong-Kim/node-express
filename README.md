# node-express
*Web Development with Node & Express*


### 03-helloworld.js

- fs.readFile이 지정한 파일의 콘텐츠를 읽고, 다 읽은 다음에 콜백함수 실행
    - 만약 파일이 존재하지 않거나 권한 문제 때문에 파일을 읽을 수 없다면 err 변수가 만들어지고 함수는 서버 오류를 나타내는 HTTP 상태코드 500울 반환
    - 파일을 성공적으로 읽었으면 콜백 함수에 전달된 응답 코드와 콘텐츠 타입과 함께 파일을 클라이언트에 전송

*ch02 - 노드만 사용하여 간단한 웹서버 생성*
*ch03 - 익스프레스를 사용하여 ch02에서 만들었던 서버 재생성*

---

<br>

### 00-meadowlark.js
- meadowlark.js 파일 생성 → 프로젝트의 진입점



### 01-meadowlark.js
app.get - 라우트를 추가하는 메서드 → 경로와 함께 두가지 매개변수를 받음
- **경로**는 라우트 (/about, /about/, /About, /about?foo=bar 모두 똑같이 동작)
- **함수**는 라우트가 일치할 때 호출하는 함수 → 요청과 응답객체가 매개변수로 전달


app.use - 미들웨어와 관련있는 메서드
- 라우트가 일치하지 않을 때 사용할 일종의 폴백 핸들러
- **익스프레스에서는 라우트와 미들웨어의 순서가 중요**
    - 만약 404 핸들러를 라우트보다 먼저 작성했다면, 홈페이지와 어바웃 페이지는 동작하지 않고 무조건 404페이지로 연결


앞서 req.url을 정규화 했던 부분
- 요청을 정확히 파악하기 위해 쿼리스트링과 마지막 슬래시를 없애고, 소문자로 변환하는 일을 직접했어야함
- 익스프레스의 라우트는 이런 작업을 자동으로 대신한다.

----


### 02-meadowlark.js

### 뷰와 레이아웃

- 뷰 : 사용자가 보는것을 책임지는 부분
    - 이미지나 CSS 파일같은 정적 자원과는 다름 → HTML역시 각 요청에 따라 즉석에서 변할 수 있음
- 익스프레스에서는 여러가지 뷰 엔진을 지원하며 이들의 추상화 레벨 역시 다양
    - 퍼그
    - 핸들바 → 퍼그에 비해 추상화가 좀 덜한 편

### 핸들바

- HTML은 그대로 작성하고, 여기에 특별한 태그를 사용하면 핸들바가 그 태그에 콘텐츠를 삽입하는 방식으로 동작
- `npm install express-handlebars@3`

```jsx
const expressHandlebars = require('express-handlebars')

// 핸들바 뷰 엔진 설정
app.engine('handlebars', expressHandlebars({
    defaultLayout : 'main',
}))

app.set('view engine', 'handlebars')
```

- 뷰 엔진을 생성하고 익스프레스에서 이 엔진을 기본 값으로 사용
- 레이아웃을 사용하여 사이트에 존재하는 모든 페이지에 프레임 워크를 제공

views/layouts/main.handlebars

```jsx
<!doctype html>
<html>
    <head>
        <title>Meadowlark Travel</title>
    </head>
    <body>
        {{ body }}
    </body>
</html>
```

- 위 표현식은 각 뷰에서 HTML로 바뀜
- 핸들바 인스턴스를 만들었을때 `defaultLayout : 'main'` 로 기본 레이아웃을 선언했었음
    - 따로 명시하지 않는다면 이 템플릿이 모든 뷰의 레이아웃으로 사용

```jsx
app.get('/', (req, res) => res.render('home'))

app.get('/about', (req, res) => res.render('about'))

app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
  })
  
app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
})
```

- 뷰 엔진에서 콘텐츠 타입 text/html과 상태코드 200을 기본으로 반환하므로, 콘텐츠 타입과 상태코드를 따로 명시할 필요는없음
- 반면 404, 500에 해당하는 폴백 핸들러에는 상태코드를 정확히 명시해야함


### 정적 파일과 뷰

- 익스프레스는 미들웨어를 사용해 정적 파일과 뷰를 처리
    - 미들웨어를 통해 기능을 모듈화하여 요청을 쉽게 처리 가능
        - *미들웨어는 순서에 따라 처리되며, 보통 맨 처음이나 앞 부분에 선언하는 static 미들웨어가 다른 라우트를 가로챌 수도 있음*
- static 미들웨어 : 하나 이상의 디렉터리를 지정해서 이 디렉터리에 정적 자원을 보관하고 이들은 아무런 변화없이 클라이언트에 바로 전송
    - 이 디렉터리에 이미지, CSS파일, 클라이언트 사이드 자바스크립트 파일을 넣는다.
    - 프로젝트 디렉터리에 public 서브디렉터리를 만듦
    - 이 디렉터리에 들어있는 것들은 조건 없이 클라이언트로 전송되므로 이름이 public임
        - 라우트를 선언하는 코드 앞에 static 미들웨어 추가

⇒ **static 미들웨어는 전송하려는 정적 파일 각각에 파일을 렌더링하고 클라이언트에 반환하는 라우트를 지정한 것과 효과가 같음**

- static 미들웨어 추가

```jsx
// 02-meadowlark.js
app.use(express.static(__dirname + '/public'))

// main.handlebars
<body>
    <header>
       <img src="/img/logo.png" alt="Meadowlark Travel Logo">
    </header>
    {{{ body }}} <- 주의할 점 {{{ }}}
 </body>
```

⇒ 미들웨어는 순서에 따라 처리되며, 보통 맨 처음이나 앞부분에 선언하는 static 미들웨어가 다른 라우트를 가로챌 수도 있음

--- 

### 03-meadowlark.js
### 뷰의 동적 콘텐츠

- 뷰는 동적인 정보를 포함할 수 있음
[ 랜덤한 포춘 쿠키 ]

```jsx
const fortunes = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
  ]

app.get('/about', (req, res) => {
    const randomFortune = fortunes[Math.floor(Math.random()*fortunes.length)]
    res.render('about', { fortune : randomFortune })
})
```

---

## 모범사례와 버전관리
### 파일과 디렉터리 구조

- 일반적으로 경로에는 설정파일(package.json)과 README.md 파일, 디렉터리만 있는것이 좋음
- 소스코드는 대부분 src 디렉터리에 보관 → 실무에서 프로젝트 경로에 소스코드를 보관하면 정신없어질 수 있으니 디렉터리에 파일을 보관하는것이 좋음



### 버전관리

- 장점
    - 문서화 → 프로젝트 역사 파악
    - 작성자 → 누가 무엇을 만들었는지 파악하는 것 중요
    - 실험 → 자유롭게 실험할 수 있음(새로운 것 시도)



### 프로젝트 메타데이터

- package.json 파일에는 프로젝트 이름, 저자, 라이센스 정보 등 프로젝트 메타데이터를 저장하려는 목적도 있음



### 노드 모듈

- **모듈화와 캡슐화 기능을 제공하는 메커니즘**
- 노드모듈은 npm패키지와 관련은 있지만 다른 개념


```jsx
const express = require('express')
```

- require는 모듈을 임포트하는 노드 함수
    - 기본적으로 노드는 node_modules 디렉터리에서 모듈을 찾음
- 패키지 매니저를 통해 node_modules에 설치되는 모듈 외에도 fs, http, os, path등 노드가 제공하는 '코어 모듈'이 있음



[위에서 작성한 포춘쿠키 기능을 모듈화하는 방법]

- 모듈을 저장할 디렉터리 생성 → lib/fortune.js
- 중요한 것은 전역변수 exports를 사용했다는 것
    - 모듈 바깥에서 모듈에 있는 내용을 보려면 반드시 exports를 사용해야함

**⇒ 캡슐화 원칙을 지키면 잠재적인 오류나 취약한 코드를 피하기 쉬워진다.**


```jsx
// meadowlark.js
const fortune = require('./lib/fortune')

app.get('/about', (req, res) => {
    res.render('about', { fortune : fortune.getFortune() })
})

// ./lib/fortune.js
const fortuneCookies = [
    "Conquer your fears or they will conquer you.",
    "Rivers need springs.",
    "Do not fear what you don't know.",
    "You will have a pleasant surprise.",
    "Whenever possible, keep it simple.",
  ]

exports.getFortune = () => {
    const idx = Math.floor(Math.random()*fortuneCookies.length)
    return fortuneCookies[idx]
}
```

- 모듈은 기능을 캡슐화하는 쉽고 강력한 방법
- 기능을 캡슐화하면 프로젝트의 전체적인 디자인과 유지보수성이 개선되고 테스트도 쉬워진다.


---


## 품질보증

### QA

- 해야 할 일을 파악하는 것, 그 일이 확실히 이루어지게 하는 것
- QA의 주요 목표는 소프트웨어 테스트가 아니라, 포괄적이고 반복 가능한 QA 계획을 수립하는 일
    - QA 계획의 목표는 프로젝트가 의도한 대로 동작하도록 하기 위해 취한 단계 전체를 기록하는 것
    - 아래와 같은 상황이 생길때마다 QA 계획을 업데이트 해야함
        - 새로운 기능 추가
        - 기존 기능의 변경
        - 기능 제거
        - 테스트 기술이나 테크닉의 변경
        - QA 계획에서 놓친 버그



### 로직과 표현

- 웹사이트에는 로직(비즈니스 로직)과 표현 두가지 영역이 있음
- 로직과 표현의 구분은 중요
    - 로직에서는 모든 것을 가능한 단순하고 명확하게 표현하는 게 좋지만, 표현은 필요에 따라 복잡할수도, 단순할수도 있음
    - 표현은 사용성과 미학의 영역이지만 로직은 그렇지 않음
    - 로직 → ex) 자바스크립트 모듈에 캡술화하는 것
    - 표현 → ex) 자바스크립트와 리액트, 뷰, 앵귤러 등 프론트엔드 프레임워크의 조합

⇒ 가능한 로직과 표현을 명확히 구분하는 것이 좋음



### 테스트 타입

- 단위테스트 : 구성요소 하나가 정확히 동작하는지 테스트하는 아주 세밀한 테스트
    - 애플리케이션에 존재하는 가장 작은 기능 단위 → 보통 함수를 테스트
    - **핵심은 함수나 구성 요소를 고립시키는 것**
    - 고립작업의 중요한 테크닉인 [모형](https://www.notion.so/node-express-ffe6a1410f2b4439b8a859a3c9103edf)에 대해 알아야함.
- 통합테스트 : 여러 구성 요소, 심지어 시스템 전체의 상호작용을 테스트
    - 더 큰 기능 단위를 테스트
    - 보통 애플리케이션의 여러 부분(함수, 모듈, 서브시스템 등)이 대상
- 린트
    - 존재하는 오류가 아닌 잠재적 오류를 찾는 작업



### 제스트 설치 & 설정

- 제스트는 리액트 어플리케이션을 테스트하는 프레임워크로 출발했고 그 목적은 지금도 동일하지만 리액트에서만 사용할 수 있는 것만이 아닌 범용적 테스트 프레임워크
- `npm install --save-dev jest@25`  → --save-dev는 개발단계에서만 사용
- `npm test` 로 실행




### 모형

- 의존하는 패키지가 있으면 그 모형(시뮬레이션)을 만들어야 효율적으로 테스트할 수 있음
- 우리가 테스트해야할 것은 **익스프레스를 사용하는 방법**



### 테스트를 위한 애플리케이션 리팩터링

- 앱을 더 테스트하기 쉽게 만들려면, 라우트 핸들러를 라이브러리로 분리해야함
- lib/handler.js파일 생성

```jsx
const fortune = require('./fortune')

exports.home = (req, res) => res.render('home')

exports.about = (req, res) => res.render('about', { fortune : fortune.getFortune() })

exports.notFound = (req, res) => res.render('404')

exports.serverError = (err, req, res, next) => {
    console.log(err)
    res.render('500')
}
```

- meadowlark.js

```jsx
const handlers = require('./lib/handlers')

app.get('/', handlers.home)

app.get('/about',handlers.about)

// custom 404 page
// app.use - 미들웨어와 관련있는 메서드
app.use(handlers.notFound)
  
// custom 500 page
app.use(handlers.serverError)
```

→ 핸들러는 요청과 응답 객체를 받는 단순한 함수이므로 테스트하기 쉬워짐



### 첫번째 테스트

- 1 ) _ _test _ _
    - 디렉터리에 테스트를 모두 넣으면 소스 디렉터리 깔끔해짐
- 2 ) .test.js
    - 에디터에서 탭을 여러 개 열었을 떄 어떤 탭이 소스코드이고 어떤 탭이 테스트인지 쉽게 구분됨


`lib/__tests__/handlers.test.js`

```jsx
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
```

jest.fn() : 이 함수는 어떻게 호출되었는지 추적하는 범용함수

테스트의 중요한 부분인 어시션

⇒ 테스트할 코드를 호출하는 데는 성공했지만, 의도한 대로 동작하는지 확신하려면?

테스트코드에서 해야할 일 : 문자열 home을 가지고 응답 객체의 render 메서드를 호출하는 일

→ 제스트의 모형 함수는 자신이 호출되었을 때를 항상 추적하므로, 이 함수가 단 한번만 호출됐는지 확인하기만 하면 된다.



### 테스트 유지보수

- 코드를 수정하게되면 테스트 코드 또한 같이 수정해주어야함



### 코드 커버리지

- 코드를 얼마나 테스트했는가에 관한 정량적 답변이지만 단순히 답변할 순 없음
- 제스트에 자동으로 코드 커버리지를 분석하는 툴이 존재
    - `npm test -- --coverage`

----

## 요청과 응답객체

→ 익스프레스로 웹 서버를 만든다면 거의 대부분이 요청 객체로 시작하고 응답 객체로 끝남

- 요청객체와 응답객체는 노드에서 제공한 걸 익스프레스에서 확장한 객체

클라이언트가 서버에 페이지를 요청하는 방법, 그 페이지를 전송받는 방법



### URL의 각 부분

`https://localhost:3000/about?test=1#history`

- 프로토콜 → 요청을 어떻게 전송할지 결정 (http, https, file, ftp)
- 호스트 → 서버 (localhost, google.com)
    - 호스트 이름 앞에 서브도메인이 있을 수 있음 (www)
- 포트 → 각 서버에는 숫자 형태의 포트가 있음, 한 서버에서 포트 번호를 중복으로 사용할 수 없음
- 경로 → 일반적으로 앱에서 가장 많이 사용하는 URL부분 (/about, /search)
    - 앱에서 사용하는 페이지나 기타 자원은 모두 경로를 통해 유일하게 식별할 수 있어야함
- 쿼리스트링 → 이름-값 쌍의 컬렉션이며 옵션
    - 이름과 값은 모두 URL인코드를 사용(JS 내장함수 : encodeURLComponent - 스페이스는 + 기호로 바뀌고, 다른 특수문자는 숫자형 문자 참조로 바뀜)
- 해시 (또는 fragment) → 서버로 전송되지 않으며 브라우저에서만 사용 (#history, q=express)



### HTTP 요청 메서드

- http 프로토콜에는 클라이언트가 서버와 통신할 때 사용하는 요청 메서드 컬렉션이 정의되어있음
    - 가장 많이 사용하는 메서드는 GET과 POST
- 브라우저에 URL을 입력하거나 링크를 클릭하면 브라우저는 서버에 HTTP GET요청을 보냄
- 웹사이트의 대부분 페이지 대부분 GET 요청에 반응함
- POST 요청은 보통 폼 처리 등의 용도로 서버에 정보를 보낼 때 사용




### 요청 헤더

- 페이지를 방문할 때 서버에 URL만 보내는 것은 아님
- 브라우저는 돌려받을 페이지가 어떤 언어로 되어 있으면 좋겠다는 정보를 서버에 보냄

[00-echo-headers.js]

```jsx
const express = require('express')
const app = express()

app.get('/headers', (req, res) => {
    res.type('text/plain')
    const headers = Object.entries(req.headers)
      .map(([key, value]) => `${key}: ${value}`)
    res.send(headers.join('\n'))
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`\nnavigate to http://localhost:${port}/headers\n`))
```

