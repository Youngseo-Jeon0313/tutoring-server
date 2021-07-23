const express = require("express"); //express 모듈 불러오기
const cors = require("cors"); //
const app = express(); //express를 app 인스턴스에 담기
const models = require("./models");
const port = 8080; //포트 지정하기

app.use(express.json());
app.use(cors());

app.get("/student",(req,res) => {
    models.content.findAll()
        .then((result)=> {
            console.log("CONTENTS : ", result);
            res.send({
               content: result,
            })
        }).catch((error)=> {
            console.error(error);
            res.send("에러 발생");
        })
    });

app.post("/student",(req, res)=> {
    const body = req.body;
    const {imageUrl, date, pageandnum, description} = body;
    if (!imageUrl || !date || !pageandnum || !description) {
        res.send("모든 항목을 입력해주세요")
    }
    models.content.create({
        imageUrl,
        date,
        pageandnum,
        description
    }).then((result)=>{
        console.log("상품 생성 결과 : ", result);
        res.send({
            result,
        });
    })
    .catch((error)=>{
        console.log(error);
        res.send("상품 업로드에 문제가 발생했습니다");
    })
});

app.get("/student/:id", (req, res)=> {
    const params = req.params;
    const {id} = params;
    models.content.findOne({
        where : {
            id  : id
        }
    }).then((result)=>{
        console.log("CONTENT : ", result)
        res.send({
            content : result
        })
    }).catch((error)=> {
        console.error(error);
        res.send("내용 조회에 에러가 발생했습니다.");
    });
});

app.listen(port, () =>{
    console.log("서버가 돌아가고 있습니다.")
    models.sequelize.sync().then(()=>{
        console.log("DB 연결 성공!");
    }).catch((err)=>{
        console.error(err);
        console.log("DB 연결 에러ㅠ");
        process.exit();
    })
});