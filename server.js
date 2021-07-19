const express = require('express'); //express 모듈 불러오기
const cors = require('cors'); //
const app = express(); //express를 app 인스턴스에 담기
const port = 8080; //포트 지정하기

app.use(express.json());
app.use(cors());

app.get("/student",(req,res) => {
    res.send({
        "products":
        {
            id: 2,
            number: "수능완성 123p 2번",
            contents: "ㄴ번에 있는 전기음성도가 이해가 안가요"
        }
    })
})

app.post("/student",(req, res)=> {
    res.send("등록되었습니다.")
})

app.listen(port, () =>{
    console.log("서버가 돌아가고 있습니다.")
})
