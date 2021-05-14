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