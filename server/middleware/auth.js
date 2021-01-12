const { User } = require('../models/User');

let auth = (req,res,next) => {
    //인증 처리를 하는 곳


    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;

    //토큰을 디코드 한다. (복호화) 유저를 차는다.
    User.findByToken(token, (err,user) => {
        if(err) throw err;

        if (!user) return res.js ({isAuth: false, error : true})
        req.token = token
        //토큰을 넣어줌으로써 user 정보를 가질 수 있고, 토큰을 가질 수 있다.
        req.user = user;

        //next함수가 호출 되기전에는 middleware에 갇혀있게 된다.
        next()
    })


    //유저가 있으면 인증 OK



    //유저가 없으면 인증 No!

}


module.exports = { auth } ;