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
        namaProduk: [],
        produkSemoga: [],
        namaBarang: []
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
                this.setState({
                    namaBarang: res.data
                })
                // console.log(this.state.namaBarang)
            })
            .catch((err) => {
                console.log(err)
            })
        Axios.get(`${API_URL}/transactions`,{
            params:{
                status:"Completed",
                _embed:"transactions_details"
            }
        })
        .then((res)=>{
            this.setState({
                produkSemoga: res.data
            })
            // console.log(this.state.produkSemoga)

        })
        .catch((err)=>{
            console.log(err)
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
    renderSudahBeli =()=>{
        return this.state.namaBarang.map((val,idx)=>{
            const {productName,id} = val
            let qtyTotal = 0
            this.state.produkSemoga.map((valak)=>{
                valak.transactions_details.map((anak_valak)=>{
                    if (id===anak_valak.productId) {
                        qtyTotal+= anak_valak.quantity
                    }
                    else{
                        qtyTotal=qtyTotal
                    }
                })
            })
            if (qtyTotal>0) {     
                return(
                    <>
                        <tr>
                            <td>{idx+1}</td>
                            <td>{productName}</td>
                            <td>{qtyTotal}</td>
                        </tr>
                    </>
                )
            }
            else{
                return (<></>)
            }
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
                        {this.renderSudahBeli()}
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default Report