const express = require("express"); //express 모듈 불러오기
const cors = require("cors"); //
const app = express(); //express를 app 인스턴스에 담기
const models = require("./models");
const multer = require('multer');
const upload = multer({
    storage: multer.diskStorage({
    destination: function(req, file, cb) { //cb는 콜백함수인데 주로 첫번째 인자는 에러고 두 번째 인자는 가져올/읽어올 파일을 의미한다.!
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    },
    }),
});
const port = 8080; //포트 지정하기


app.use(express.json());
app.use(cors());
app.use('/uploads',express.static('uploads')) //다른 경로로 보여줘야 해!

app.get("/question",(req,res) => {
    models.Content.findAll({
        order : [["createdAt","DESC"]], //정렬을 예전 순에서 최신 순으로!
    }).then((result)=> {
            console.log("CONTENTS : ", result); 
            res.send({
               contents : result,
            })
        }).catch((error)=> {
            console.error(error);
            res.status(400).send("에러 발생"); //400은 서버가 클라이언트 오류(잘못된 요청구문/유효하지 않은 메시지 프레이밍)를 감지해 요청 처리할 수 없을 때
        })
    });

app.post("/question",(req, res)=> { 
    const body = req.body;
    const {id, imageUrl, date, pageandnum, description} = body;
    if ( !imageUrl || !date || !pageandnum || !description) {
        res.status(400).send("모든 항목을 입력해주세요");
    }
    models.Content.create({
        id,
        imageUrl,
        date,
        pageandnum,
        description
    }).then((result)=>{
        console.log("글 생성 결과 : ", result);
        res.send({
            result,
        });
    })
    .catch((error)=>{
        console.log(error);
        res.status(400).send("글 업로드에 문제가 발생했습니다");
    })
});


app.get("/question/:id", (req, res)=> {
    const params = req.params;
    const {id} = params;
    models.Content.findOne({
        where : {
            id : id,
        }
    }).then((result)=>{
        console.log("CONTENT : ", result)
        res.send({
            content : result
        })
    }).catch((error)=> {
        console.error(error);
        res.status(400).send("내용 조회에 에러가 발생했습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
    const file = req.file;
    console.log(file);
    res.send({
      imageUrl: file.path,
    });
  });
  


app.listen(port, () =>{
    console.log("서버가 돌아가고 있습니다.")
    models.sequelize.
    sync()
    .then(()=>{
        console.log("DB 연결 성공!");
    })
    .catch((err)=>{
        console.error(err);
        console.log("DB 연결 에러ㅠ");
        process.exit();
    })
});
