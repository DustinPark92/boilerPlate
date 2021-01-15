import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import {registerUser} from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom'

function RegisterPage(props) {

    const dispatch = useDispatch();

    //이 안에서 변화 시키려면 state를 변화 시켜야 함
    //이메일 state, password state

    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [Name, setName] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    //email action handler
    const onEmailHandler = (event) => {

        setEmail(event.currentTarget.value)
    }

    //password action handler
    const onPasswordHandler = (event) => {

        setPassword(event.currentTarget.value)
    }

    const onNameHandler = (event) => {

        setName(event.currentTarget.value)
    }

    const onConfirmPasswordHandler = (event) => {

        setConfirmPassword(event.currentTarget.value)
    }

    const onSubmitHandler = (event) => {
        //page가 refresh 되고 있다. 그것을 막아줌
        event.preventDefault();

        if(Password !== ConfirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.")
        }

        let body = {
            email : Email,
            password : Password,
            name : Name
        }


        //Redux 사용
        dispatch(registerUser(body))
            .then(response => {
            //랜딩 페이지로 이동 props 사용
            if(response.payload.success) {
                props.history.push('/')
            } else {
                alert('Fail to SignUp')
            }
        })

        
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
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />
                <label>password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <label>Confirm password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                <br />
                <button>
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)
