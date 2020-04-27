import React from "react"
import TextField from "../../components/TextField/TextField"
import ButtonUI from "../../components/Button/Button"
import "./AuthScreen.css"
class AuthScreen extends React.Component {
    state = {
        kondisi: true
    }
    registerFungsi = () => {
        this.setState({kondisi:false})
    }
    loginFungsi =()=>{
        this.setState({kondisi:true})
    }
    render() {
        return (
            <div className="container">
                <div className="row mt-5">
                    <div className="col-5">
                        
                        {
                            (this.state.kondisi) ? (
                                <div>
                                    <div className="d-flex">
                                        <ButtonUI className="btn-putih" onClick={this.registerFungsi}>Register</ButtonUI>
                                        <ButtonUI className="btn-hitam">Login</ButtonUI>
                                        {/* <input onClick={this.registerFungsi} className="btn btn-putih" type="button" value="Register"/> */}
                                        {/* <input className="btn btn-hitam" type="button" value="Login"/> */}
                                    </div>    
                                    <h3 style={{ marginTop: "20px" }}>Log In</h3>
                                    <p className="mt-4">
                                        Welcome Back.
                                    <br />Please, Login to your account</p>
                                    <TextField placeholder="Username" className="mt-5" />
                                    <TextField placeholder="Password" className="mt-2" />
                                    <div className="d-flex justify-content-center">
                                        <ButtonUI type="contained" className="mt-4">
                                            Login
                                        </ButtonUI>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="d-flex">
                                        {/* <input className="btn btn-hitam" type="button" value="Register"/>
                                        <input onClick={this.loginFungsi} className="btn btn-putih" type="button" value="Login"/> */}
                                        <ButtonUI className="btn-hitam">Register</ButtonUI>
                                        <ButtonUI className="btn-putih" onClick={this.loginFungsi}>Login</ButtonUI>
                                    </div>  
                                    <h3 style={{ marginTop: "20px" }}>Register</h3>
                                    <p className="mt-4">
                                    You will get the best recommendation for rent
                                    <br />house in near of you</p>
                                    <TextField placeholder="Username" className="mt-5" />
                                    <TextField placeholder="Full Name" className="mt-2" />
                                    <TextField placeholder="Address" className="mt-2" />
                                    <TextField placeholder="Password" className="mt-2" />
                                    <div className="d-flex justify-content-center">
                                    <ButtonUI type="contained" className="mt-4">
                                        Register
                                    </ButtonUI>
                                    </div>
                                </div>   
                            )
                        }
                    </div>
                    <div className="col-7">Picture</div>
                </div>
            </div>
        )
    }
}
export default AuthScreen