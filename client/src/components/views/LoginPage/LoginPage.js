import React, { useState } from 'react'

function LoginPage() {


    //이 안에서 변화 시키려면 state를 변화 시켜야 함
    //이메일 state, password state

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    //email action handler
    const onEmailHandler = (event) => {

        setEmail(event.currentTarget.value)
    }

    //password action handler
    const onPasswordHandler = (event) => {

        setPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        //page가 refresh 되고 있다. 그것을 막아줌
        event.preventDefault();

        console.log('Email', Email)
        console.log('Password',Password)

        
    }


    return (
        <div style={{
            display: 'flex' , justifyContent : 'center' , alignItems : 'center'
            , width : '100%' , height : '100vh'
        }}>
            <form style={{
                display :'flex', flexDirection : 'column'
            }}
            onSubmit={onSubmitHandler}
            >
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
