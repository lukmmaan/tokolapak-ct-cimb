import React from "react"
import { Table } from "reactstrap"
import Axios from "axios"
import { API_URL } from "../../../constants/API"

class Report extends React.Component {
    state = {
        userData: [],
        totalBelanjaApproved: [],
        productBought: 0,
        usernameData: [],
        namaProduk:[],
        produkSemoga:[]
    }
    addReport = () => {
        Axios.get(`${API_URL}/users`)
            .then((res) => {
                // console.log(res.data)
                this.setState({
                    userData: res.data,
                })
                res.data.map((val) => {
                    const { username } = val
                    this.setState({
                        usernameData: [...this.state.usernameData, username]
                    })
                })
                // console.log(this.state.usernameData)
                // console.log(this.state.userData)
                this.state.userData.map((val) => {
                    const { id } = val
                    Axios.get(`${API_URL}/transactions`, {
                        params: {
                            _embed: "transactions_details",
                            userId: id,
                            status: "Completed"
                        }
                    })
                        .then((res) => {
                            let totalHarga = 0
                            // console.log(res.data)
                            res.data.map((val) => {
                                const { totalPrice, transactions_details } = val
                                totalHarga += totalPrice
                            })
                            this.setState({
                                totalBelanjaApproved: [...this.state.totalBelanjaApproved, totalHarga]
                            })
                            // console.log(this.state.totalBelanjaApproved)
                        })
                        .catch((err) => {
                            console.log(err)
                        })
                })
            })
            .catch((err) => {
                console.log(err)
            })
        Axios.get(`${API_URL}/products`)
            .then((res) => {
                // console.log(res.data)
                res.data.map((val)=>{
                    this.setState({
                        namaProduk:[...this.state.namaProduk,val.productName]
                    })
                })
                // console.log(this.state.namaProduk)
            })
            .catch((err) => {
                console.log(err)
            })
            Axios.get(`${API_URL}/transactions`, {
                params: {
                    _embed: "transactions_details",
                    status:"Completed"
                }
            })
                .then((res) => {
                    console.log(res.data);
                    let arr=[]
                    // let quantity
                    res.data.map((val)=>{
                        val.transactions_details.map((value)=>{
                            arr=[...arr,{productId:value.productId,quantity:value.quantity}]
                        })
                    })
                    // this.setState({
                    //     produkSemoga:arr
                    // })
                    console.log(arr)
                    let arrBaru = []
                    
                })
                .catch((err) => {
                    console.log(err);
                })
    }
    componentDidMount() {
        this.addReport()
    }
    renderReport = () => {
        return this.state.totalBelanjaApproved.map((val, idx) => {
            return (
                <>
                    <tr>
                        <td>{idx + 1}.</td>
                        <td>{this.state.usernameData[idx]}</td>
                        <td>{val}</td>
                    </tr>
                </>
            )
        })
    }
    renderProduct = ()=>{
        return this.state.namaProduk.map((val,idx)=>{
            return (
                <>
                    <tr>
                        <td>{idx + 1}.</td>
                        <td>{val}</td>
                        <td>jumlah</td>
                    </tr>
                </>
            )
        })
    }
    render() {
        return (
            <div>
                <h3 className="text-center">Total Belanja User</h3>
                <Table>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Username</td>
                            <td>Total Belanja</td>
                        </tr>
                    </thead>
                    <tbody>

                        {this.renderReport()}

                    </tbody>
                </Table>
                <h3 className="text-center">Product Sudah Dibeli</h3>
                <Table>
                    <thead>
                        <tr>
                            <td>No.</td>
                            <td>Product</td>
                            <td>Jumlah Kebeli</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderProduct()}
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default Report