const mongoose = require('mongoose');

//1. bcrypt import
const bcrypt = require('bcrypt');

// salt를 이용해서 비밀번호를 암호화 해야 함
// saltRounds : salt가 몇글자 인지를 나타냄
const saltRounds = 10;

const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema( {
    name: {
        type : String,
        maxlength : 50
    },
    email: {
        type: String,
        trim : true,
        unique : 1
    },
    password : {
        type : String
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image : String,

    token : {
        type : String
    },
    tokenExp : {
        type : Number
    }

});


//2. mongoose method에서 pre사용 , 유저 정보를 저장하기전에 무엇을 하기 위한 작업 처리
userSchema.pre('save', function( next ) {
    //비밀 번호를 암호화 시킨다.

    var user = this;
    // this는 userSchema을 의미한다.

    if (user.isModified('password')) { //비밀 번호 변경 시에만 암호화를 해준다.
        bcrypt.genSalt(saltRounds,function(err,salt) {
            //salt 생성!
            if (err) return next(err)
            //user.save 쪽으로 돌려 보낸다.
    
    
            bcrypt.hash(user.password,salt,function(err,hash) {
                if (err) return next(err)
                //user.save 쪽으로 돌려 보낸다.
    
                //plain password를 hash된 비밀번호로 바꿔준다.
                user.password = hash
    
                next()
            })
        })
    } else {
        //비밀 번호 변경이 아닐때만,
        next()


    }

})


//2.
userSchema.methods.comparePassword = function(plainPassword, cb) {

    //plainPassword = 1234567 , 암호화 된 비밀 번호 : $123213dkaghghk
    bcrypt.compare(plainPassword, this.password, function(err,isMatch) {
        if (err) return cb(err);
        cb(null,isMatch);
    });

};


//5.
userSchema.methods.generateToken = function(cb) {
    //json web token을 이용해서 token을 생성하기

    var user = this;

    var token = jwt.sign(user._id.toHexString(), 'secretToken')

    // user._id + 'secretToken' => token 생성 , token으로 누구인지 식별 가능
    user.token = token
    user.save(function(err,user) {
        if(err) return cb(err)
        cb(null,user)
    }) 

}


userSchema.statics.findByToken = function(token,cb) {
    var user = this;


    //user._id + '' = token
    //토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err,decoded) {
        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인


        user.findOne({"_id" : decoded, "token" : token}, function(err,user){
            if (err) return cb(err);
            cb(null,user)


        })
    })


}

const User = mongoose.model('User',userSchema)

module.exports = { User }