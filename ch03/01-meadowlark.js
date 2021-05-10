const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// app.get - 라우트를 추가하는 메서드 → 경로와 함께 두가지 매개변수를 받음
app.get('/', (req, res) => {
  res.type('text/plain')
  res.send('Meadowlark Travel');
})

app.get('/about', (req, res) => {
  res.type('text/plain')
  res.status(404)
  res.send('404 - Not Found');
})

// custom 404 page
// app.use - 미들웨어와 관련있는 메서드
app.use((req, res) => {
    res.type('text/plain')
    res.status(404)
    res.send('404 - Not Found')
  })
  
  // custom 500 page
  app.use((err, req, res, next) => {
    console.error(err.message)
    res.type('text/plain')
    res.status(500)
    res.send('500 - Server Error')
  })
  
  app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    `press Ctrl-C to terminate.`))