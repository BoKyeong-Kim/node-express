const express = require('express')
const expressHandlebars = require('express-handlebars')

const handlers = require('./lib/handlers')

const app = express()
const port = process.env.PORT || 3000

// 핸들바 뷰 엔진 설정
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
  }))

app.set('view engine', 'handlebars')

app.use(express.static(__dirname + '/public'))

// app.get - 라우트를 추가하는 메서드 → 경로와 함께 두가지 매개변수를 받음
app.get('/', handlers.home)

app.get('/about',handlers.about)

// custom 404 page
// app.use - 미들웨어와 관련있는 메서드
app.use(handlers.notFound)
  
// custom 500 page
app.use(handlers.serverError)

app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`)
)