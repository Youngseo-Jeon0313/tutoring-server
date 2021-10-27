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

const answerupload = multer({
    storage: multer.diskStorage({
    destination: function(req, file, cb) { //cb는 콜백함수인데 주로 첫번째 인자는 에러고 두 번째 인자는 가져올/읽어올 파일을 의미한다.!
        cb(null, 'answeruploads/');
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
app.use('/answeruploads', express.static('answeruploads'))

//서버에 저장되어 있는 걸 가져와서 웹에서 띄어줄 때 get.
app.get("/question",(req,res) => {
    models.Content.findAll({   //여기서는 하나하나 정보들 다 가져와야 하니까!
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

app.post("/question",(req, res)=> {  //내가 posting한 것들을 저장해주는 역할
    const body = req.body; //body에 넣어 req받은 그 body를
    const {id, imageUrl, date, pageandnum, description} = body; //그 body들은 각각 이렇게 나눌 수 있지 (body는 통용적으로 쓰이는 말인 듯)
    if ( !imageUrl || !date || !pageandnum || !description) {
        res.status(400).send("모든 항목을 입력해주세요");
    } //하나라도 빠지지 않도록 써주는 말들
    models.Content.create({ //이때 models에다가 만들어준 내용들을 하나씩 가져옴 (모델은 그러라고 있는 거야)
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
    const params = req.params; //파라미터는 '외부로부터 투입되는 데이터'라고 여기서 해석하면 될 듯
    const {id} = params;
    models.Content.findOne({ //여기서는 정보 하나, 즉 내가 올린 것들 하나하나 떼어서 가져오기
        where : {
            id : id,  //그때 기준은 id 값!
        }
    }).then((result)=>{  //promise가 잘 됐으면 then~ 이렇게 가져와
        console.log("CONTENT : ", result)
        res.send({
            content : result //result는 이 때 content에서 받아온 것들!
        })
    }).catch((error)=> { //reject된 경우에는 이렇게 에러가 발생 ㅠㅠ
        console.error(error);
        res.status(400).send("내용 조회에 에러가 발생했습니다.");
    });
});

app.post("/image", upload.single("image"), (req, res) => {
    const file = req.file; //req에서 받은 file을 file로 지정해주고
    console.log(file); 
    res.send({  //보내 그걸
      imageUrl: file.path,
    });
  });

  const todos = [
    {
        id: 1,
        title: "수완 3단원 다하기"
    },
    {
        id: 2,
        title: "모의고사 2020 6월 꺼 풀기"
    },
    {
        id: 3,
        title: "산화수 파란색 종이 하기"
    }
    ];
    
    app.get("/todos", (req, res) => 
        res.json(todos));  //이렇게 보내는 건... 저장이 안 되는 것 같군


app.post("/class", (req, res)=> {
    const body = req.body;
    const {id, description} = body;
    if (!description) {
        res.status(400).send("수업 내용을 입력해주세요");
    }
    models.ClassContents.create({
        id,
        description
    }).then((result)=>{
        console.log("수업 내용 : ", result);
        res.send({
            result
        });
    }).catch((error)=>{
        console.log(error);
        res.status(400).send("수업 내용 업로드에 문제가 발생했습니다.")
    })
});


app.get("/class", (req, res) => {
    const params = req.params;
    const {id} = params;
    models.ClassContents.findOne({
        where : {
            id: id,
        }
    }).then((result)=> {
        console.log("수업 내용 결과 : ", result)
        res.send({
            classcontents : result
        })
    }).catch((error)=>{
        console.log(error);
        res.status(400).send("수업 내용 결과 조회에 오류가 발생했습니다.")
    })
})
    
app.get("/class/:id", (req, res)=> {
    const params = req.params; //파라미터는 '외부로부터 투입되는 데이터'라고 여기서 해석하면 될 듯
    const {id} = params;
    models.ClassContents.findOne({ //여기서는 정보 하나, 즉 내가 올린 것들 하나하나 떼어서 가져오기
        where : {
            
            id : id,  //그때 기준은 id 값!
        }
    }).then((result)=>{  //promise가 잘 됐으면 then~ 이렇게 가져와
        console.log("CONTENT : ", result)
        res.send({
            classcontents : result //result는 이 때 content에서 받아온 것들!
        })
    }).catch((error)=> { //reject된 경우에는 이렇게 에러가 발생 ㅠㅠ
        console.error(error);
        res.status(400).send("내용 조회에 에러가 발생했습니다.");
    });
});





app.post("/homework",(req,res)=> {
    const body = req.body;
    const {id, homework} =body;
    if (!homework) {
        res.status(400).send("숙제를 입력해주세요");
    }
    models.HomeworkContents.create({
        id,
        homework
    }).then((result)=>{
        console.log("기입한 숙제: ",result); //이건 이 java에서 나타남
        res.send({
            result,
        });
    })
    .catch((error)=>{
    console.log(error);
    res.status(400).send("글 업로드에 문제가 발생하였습니다");
})
})


app.get("/homework",(req,res) => {
    models.HomeworkContents.findAll({   //여기서는 하나하나 정보들 다 가져와야 하니까!
        //이게 하나만 찾아주는 솔루션 ㅎㅎㅎㅎㅎㅎ
        order : [["id","DESC"]],
         //정렬을 예전 순에서 최신 순으로!
         limit: 1,

    }).then((result)=> {
            console.log("CONTENTS : ", result); 
            res.send({
               homeworkcontents : result,
            })
        }).catch((error)=> {
            console.error(error);
            res.status(400).send("에러 발생"); //400은 서버가 클라이언트 오류(잘못된 요청구문/유효하지 않은 메시지 프레이밍)를 감지해 요청 처리할 수 없을 때
        })
    });
    
app.get("/homework/:id", (req, res)=> {
    const params = req.params; //파라미터는 '외부로부터 투입되는 데이터'라고 여기서 해석하면 될 듯
    const {id} = params;
    models.HomeworkContents.findOne({ //여기서는 정보 하나, 즉 내가 올린 것들 하나하나 떼어서 가져오기
        order: [['id', 'DESC']],
        limit : 1,
        where : {
            id : id,  //그때 기준은 id 값!
        },
        
        
    }).then((result)=>{  //promise가 잘 됐으면 then~ 이렇게 가져와
        console.log("CONTENT : ", result)
        res.send({
            homeworkcontents : result //result는 이 때 content에서 받아온 것들!
        })
    }).catch((error)=> { //reject된 경우에는 이렇게 에러가 발생 ㅠㅠ
        console.error(error);
        res.status(400).send("내용 조회에 에러가 발생했습니다.");
    });
});




app.post("/answer",(req, res)=> {  //내가 posting한 것들을 저장해주는 역할
    const body = req.body; //body에 넣어 req받은 그 body를
    const {id, imageUrl, httpnum, description} = body; //그 body들은 각각 이렇게 나눌 수 있지 (body는 통용적으로 쓰이는 말인 듯)
    if ( !imageUrl || !httpnum || !description) {
        res.status(400).send("모든 항목을 입력해주세요");
    } //하나라도 빠지지 않도록 써주는 말들
    models.AnswerContents.create({ //이때 models에다가 만들어준 내용들을 하나씩 가져옴 (모델은 그러라고 있는 거야)
        id,
        imageUrl,
        httpnum,
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



app.post("/answerimage", answerupload.single("image"), (req, res) => {
    const file = req.file; //req에서 받은 file을 file로 지정해주고
    console.log(file); 
    res.send({  //보내 그걸
      imageUrl: file.path,
    });
  });


app.get("/answer",(req,res) => {
    models.AnswerContents.findAll({   //여기서는 하나하나 정보들 다 가져와야 하니까!
        order : [["createdAt","DESC"]], //정렬을 예전 순에서 최신 순으로!
    }).then((result)=> {
            console.log("ANSWERCONTENTS : ", result); 
            res.send({
               contents : result,
            })
        }).catch((error)=> {
            console.error(error);
            res.status(400).send("에러 발생"); //400은 서버가 클라이언트 오류(잘못된 요청구문/유효하지 않은 메시지 프레이밍)를 감지해 요청 처리할 수 없을 때
        })
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
