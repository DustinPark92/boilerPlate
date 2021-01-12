const express = require('express');
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");




//application/x-www-from-urlencoded ->이런 데이터들을 분석해서 가져오게 해줌
app.use(bodyParser.urlencoded({extended: true})); 
//application/json >이런 데이터들을 분석해서 가져오게 해줌
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true, useFindAndModify : false
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/hello' , (req,res) => {


  res.send("안녕하세요~~")
})
 
app.post('/api/users/register',(req, res) => {
    //회원 가입 할떄 필요한 정보들을 client에서 가져오면
    //그것들을 데이터 베이스에 넣어준다.
    //body parser를 이용해서 client정보를 가져온다

    const user = new User(req.body)

    //유저 모델에 저장이 된다.
    user.save((err,userInfo) => {
        if (err) return res.json({ success : false, err})
        return res.status(200).json ({
            success: true
        })
    })
})

app.post('/api/users/login' ,(req,res) => {
  //1.요청된 이메일을 데이터 베이스에서 있는지 찾는다.

  User.findOne({email : req.body.email}, (err,user) => {
    if (!user) {
      return res.json({
        loginSuccess : false,
        message : "제공 된 이메일에 해당하는 유저가 없습니다."
      })
    }
    //-> User.js 에 method 생성

    //3.요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인
    user.comparePassword(req.body.password, (err,isMatch) => {
      if(!isMatch) 
      return res.json( {loginSuccess: false , message: "비밀번호가 틀렸습니다."})
    
  

  //4.비밀 번호 까지 맞다면 token을 생성한다.
      user.generateToken((err , user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지 , 세션  -> 어디에 저장 해야 안전한지에 대해서는 논란이 많다.

        // x_auth + cookie
        res.cookie("x_auth",user.token)
        .status(200) 
        .json({loginSuccess : true ,userId : user._id})     


      })

    }) 

  })


})

app.get('/api/users/auth', auth ,(req,res) => {
      //middleware 콜백 function 중간에 무언가를 해주는건가
      // 여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True라는 말.

      req.status(200).json({
        //auth에 user를 넣었기 떄문에
          _id : req.user._id,
          isAdmin : req.user.role === 0 ? false : true,
          isAuth : true,
          email : req.user.email,
          name : req.user.name,
          lastname : req.user.lastname,
          role : req.user.role,
          image : req.user.image
      })

}) 


//로그인 된 상태기 때문에 auth middle ware를 넣어준다.
app.get('/api/users/logout', auth , (req,res) => {
  User.findOneAndUpdate({ _id : req.user._id},
     {token : ""},
     (err,user) => {
    if (err) return res.json({success : false,err});
    return res.status(200).send({
      success: true
    })
  })
})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})