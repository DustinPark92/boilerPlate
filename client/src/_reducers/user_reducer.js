import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER
} from '../_actions/types';



export default function (state = {},action) {
    switch (action.type) {
        case LOGIN_USER:
            //스프레드 오퍼레이트 , 빈 상태를 나타내는 것.
            return { ...state, loginSuccess: action.payload }
            break;
        case REGISTER_USER:
            return { ...state, register: action.payload }
            break;
        case AUTH_USER:
            //모든 유저 데이터가 userData에 들어 있다.
            return { ...state, userData: action.payload }
            break;
        default:
            return state;
    }

}