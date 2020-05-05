import React from "react"
import { connect } from "react-redux"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { Table } from "reactstrap"
import ButtonUI from "../../components/Button/Button"
import TextField from "../../components/TextField/TextField"
import swal from "sweetalert"

class Members extends React.Component {
    state = {
        membersData: [],
        editForm: {
            username: "",
            fullName: "",
            password: "",
            email: "",
            id: 0,
            role: ""
        },
        regisForm: {
            username: "",
            fullName: "",
            password: "",
            email: "",
            id: 0,
            role: ""
        },
        kondisiEdit: false
    }
    inputHandler = (e, field, form) => {
        const { value } = e.target
        this.setState({
            [form]: {
                ...this.state[form],
                [field]: value,
            },
        })
    }
    addMembers = () => {
        Axios.get(`${API_URL}/users`,{
            params:{
                role:"user"
            }
        })
            .then((res) => {
                this.setState({
                    membersData: res.data
                })
                console.log(this.state.membersData)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    editMember =(idx)=>{
        this.setState({
            kondisiEdit:true,
            editForm:this.state.membersData[idx]
        })
        // console.log(this.state.editForm)
    }
    deleteMember = (id)=>{
        // alert(id)
        Axios.delete(`${API_URL}/users/${id}`)
        .then((res)=>{
            swal("Success!", "Your item has been deleted", "success");
            this.addMembers()
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    renderMembers = () => {
        return this.state.membersData.map((val, idx) => {
            const { id, username, fullName, password, email, role } = val
            return (
                <tr key={`Members-${id}`}>
                    <td>{idx + 1}.</td>
                    <td>{username}</td>
                    <td>{fullName}</td>
                    <td>{password}</td>
                    <td>{email}</td>
                    <td>{role}</td>
                    <td className="d-flex flex-row">
                        <ButtonUI onClick={()=>this.editMember(idx)} className="mr-5">Edit</ButtonUI>
                        <ButtonUI onClick={()=>this.deleteMember(id)}type="outlined">Delete</ButtonUI>
                    </td>
                </tr>
            )
        })
    }
    saveRegis = ()=>{
        Axios.post(`${API_URL}/users`,this.state.regisForm)
        .then((res)=>{
            this.addMembers()
            swal("Success!", "Your Account has been saved", "success");
        })
        .catch((err)=>{
            console.log(err)
        })
    }
    saveEdit =()=>{
        Axios.put(`${API_URL}/users/${this.state.editForm.id}`,this.state.editForm)
        .then((res) => {
            swal("Success!", "Your Account has been edited", "success");
            this.setState({
                kondisiEdit:false
            })
            this.addMembers()
          })
          .catch((err) => {
            swal("Error!", "Your item could not be edited", "error");
            console.log(err);
          });
    }
    componentDidMount() {
        this.addMembers()
    }
    render() {
        return (
            <div>
                <h3 className="text-center">Members</h3>
                <Table className="container py-4 text-center">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Username</th>
                            <th>Full-Name</th>
                            <th>Password</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderMembers()}
                    </tbody>
                </Table>
                <hr />
                <div className="text-center">
                    <h4>Input New Member</h4>
                    <div style={{ marginBottom: "20px" }} className="d-flex flex-row container">
                        <TextField 
                            className="col-3  mr-4" 
                            placeholder="Username"
                            onChange={(e) => this.inputHandler(e, "username", "regisForm")}
                        >
                        </TextField>
                        <TextField 
                            className="col-7 ml-4" 
                            placeholder="Full Name"
                            onChange={(e) => this.inputHandler(e, "fullName", "regisForm")}
                            >
                        </TextField>
                    </div>
                    <div style={{ marginBottom: "20px" }} className="d-flex flex-row container">
                        <TextField 
                            className="col-3  mr-3" 
                            placeholder="Password"
                            onChange={(e) => this.inputHandler(e, "password", "regisForm")}
                            >
                        </TextField>
                        <TextField 
                            className="col-5 ml-2" 
                            placeholder="Email"
                            onChange={(e) => this.inputHandler(e, "email", "regisForm")}
                        >
                        </TextField>
                        <TextField 
                            className="col-3 ml-2" 
                            placeholder="Role"
                            onChange={(e) => this.inputHandler(e, "role", "regisForm")}
                            >
                        </TextField>
                    </div>
                    <div className="row justify-content-center">
                        <ButtonUI onClick={this.saveRegis}>Registrasi</ButtonUI>
                    </div>
                </div>
                {
                    (!this.state.kondisiEdit) ? (
                        <div>
                        </div>
                    ) : (
                            <>
                                <hr />
                                <div className="text-center">
                                    <h4>Edit Member</h4>
                                    <div style={{ marginBottom: "20px" }} className="d-flex flex-row container">
                                        <TextField 
                                            value={this.state.editForm.username} 
                                            className="col-3  mr-4" 
                                            placeholder="Username"
                                            onChange={(e) => this.inputHandler(e, "username", "editForm")}
                                            >
                                        </TextField>
                                        <TextField 
                                            value={this.state.editForm.fullName} 
                                            className="col-7 ml-4" 
                                            placeholder="Full Name"
                                            onChange={(e) => this.inputHandler(e, "fullName", "editForm")}
                                            ></TextField>
                                    </div>
                                    <div style={{ marginBottom: "20px" }} className="d-flex flex-row container">
                                        <TextField 
                                            value={this.state.editForm.password} 
                                            className="col-3  mr-3" 
                                            placeholder="Password"
                                            onChange={(e) => this.inputHandler(e, "password", "editForm")}
                                            >
                                            </TextField>
                                        <TextField 
                                            value={this.state.editForm.email} 
                                            className="col-5 ml-2" 
                                            placeholder="Email"
                                            onChange={(e) => this.inputHandler(e, "email", "editForm")}
                                        >
                                        </TextField>
                                        <TextField 
                                            value={this.state.editForm.role} 
                                            className="col-3 ml-2" 
                                            placeholder="Role"
                                            onChange={(e) => this.inputHandler(e, "role", "editForm")}
                                            >
                                        </TextField>
                                    </div>
                                    <div className="row justify-content-center">
                                        <ButtonUI onClick={this.saveEdit}>Save</ButtonUI>
                                    </div>
                                </div>
                            </>
                        )
                }

            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        user: state.user,
    };
};
export default connect(mapStateToProps)(Members)