const http = require('http');
const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    //쿼리스트링, 옵션인 마지막 슬래시를 없애고 소문자로 바꿔서 URL을 정규화
    const path = req.url.replace(/\/?(?:\?.*)?$/, '').toLowerCase();
    switch(path) {
        case '':
            res.writeHead(200, { 'Content-Type' : 'text/plain' })
            res.end('Homepage')
            break
        case '/about':
            res.writeHead(200, { 'Content-Type' : 'text/plain' })
            res.end('About')
            break
        default :
            res.writeHead(404, { 'Content-Type' : 'text/plain' })
            res.end('Not Found')
            break
    }
})

server.listen(port, () => console.log(`server started on port ${port};\n` +
`press Ctrl-C to terminate....`))