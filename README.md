# node-express
*Web Development with Node & Express*


### 03-helloworld.js

- fs.readFile이 지정한 파일의 콘텐츠를 읽고, 다 읽은 다음에 콜백함수 실행
    - 만약 파일이 존재하지 않거나 권한 문제 때문에 파일을 읽을 수 없다면 err 변수가 만들어지고 함수는 서버 오류를 나타내는 HTTP 상태코드 500울 반환
    - 파일을 성공적으로 읽었으면 콜백 함수에 전달된 응답 코드와 콘텐츠 타입과 함께 파일을 클라이언트에 전송
