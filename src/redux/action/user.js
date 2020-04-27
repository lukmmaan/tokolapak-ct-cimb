import Axios from "axios"
import { API_URL } from '../../constants/API'
import userTypes from "../types/user"
import Cookie from "universal-cookie"
const {ON_LOGIN_FAIL,ON_LOGIN_SUCCESS,ON_LOGOUT_SUCCESS} = userTypes

export const loginHandler = (userData) => {
    const { username, password } = userData
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                username: username,
                password: password
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    // alert("masuk dong kaka")
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0]
                    })
                }
                else {
                    alert("username/password salah")
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "Username / Password Salah"
                    })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }
}

export const registerHandler = (userData) => {
    const { username, fullName, password, role } = userData
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                username: username
            }
        })
            .then((res) => { //res = response dari API
                // console.log(res.data)
                if (res.data.length > 0) {
                    dispatch({
                        type: "ON_REGISTER_FAIL",
                        payload: "username sudah digunakan"
                    })
                }
                else {
                    Axios.post(`${API_URL}/users`, userData)
                        .then((res) => {
                            // console.log("sukses")
                            console.log(res.data)
                            alert("Data sudah ditambah")
                            dispatch({
                                type: ON_LOGIN_SUCCESS,
                                payload: res.data
                            })
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                }
            })
            .catch((err) => { //error
                // alert("beda")
                console.log(err)
            })
    }
}

export const userKeepLogin = (userData) => {
    const { id } = userData
    return (dispatch) => {
        Axios.get(`${API_URL}/users`, {
            params: {
                id: id
            }
        })
            .then((res) => {
                if (res.data.length > 0) {
                    // alert("masuk dong kaka")
                    dispatch({
                        type: ON_LOGIN_SUCCESS,
                        payload: res.data[0]
                    })
                }
                else {
                    // alert("tidak masuk kaka")
                    dispatch({
                        type: ON_LOGIN_FAIL,
                        payload: "Username / Password Salah"
                    })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

export const logoutHandler = () => {
    return {
        type: ON_LOGOUT_SUCCESS,
    }
}