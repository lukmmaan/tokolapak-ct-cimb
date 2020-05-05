import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { Table } from "reactstrap"
import ButtonUI from "../../components/Button/Button"
import swal from "sweetalert"

class Payment extends React.Component {
    state = {
        paymentData: [
        ]
    }
    addpaymentData = () => {
        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transactions_details",
            }
        })
            .then((res) => {
                console.log(res.data);
                this.setState({
                    paymentData: res.data
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }
    konfirmasiPayment = (id, idx) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        var today = new Date()
        var date = today.getDate() + '-' + monthNames[(today.getMonth())] + '-' + today.getFullYear()
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        var dateTime = date + ' ' + time
        // alert(id)
        if (this.state.paymentData[idx].status == "pending") {
            // console.log("status pending")
            Axios.patch(`${API_URL}/transactions/${id}`, {
                status: "Completed",
                tanggalSelesai: dateTime
            })
                .then((res) => {
                    this.addpaymentData()
                    swal("Yes..!", "Oke lo confirm pembayaran ini", "success")
                })
        }
        else {
            // console.log("status completed")
            swal("No..!", "Lo udah pernah Confirm sebelumnya, ga bisa confirm lagi", "error")
        }
        // console.log(this.state.paymentData[idx].status)
    }
    renderPayment2 = () => {
        return this.state.paymentData.map((val, idx) => {
            const { id, username, status, tanggalBelanja, tanggalSelesai, totalPrice, userId, transactions_details } = val
            if (val.status == "Completed") {
                return (
                    <tr key={`Members-${id}`}>
                        <td style={{ color: "green" }}>{status}</td>
                        <td>{tanggalBelanja}</td>
                        <td>{tanggalSelesai}</td>
                        <td>{totalPrice}</td>
                        <td>{username}</td>
                        <td>
                            <Table>
                                <thead>
                                    <tr class="table-primary">
                                        <th>No.</th>
                                        <th>ProductId</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions_details.map(((value, idx) => {
                                        return (
                                            <tr>
                                                <td>{idx + 1}</td>
                                                <td>{value.productId}</td>
                                                <td>{value.price}</td>
                                                <td>{value.quantity}</td>
                                                <td>{value.totalPrice}</td>
                                            </tr>
                                        )
                                    }))}
                                </tbody>
                            </Table>
                        </td>
                        <td className="d-flex flex-row">
                            <h3>Accepted Payment</h3>
                        </td>
                    </tr>
                )
            }
        })
    }
    renderPayment = () => {
        return this.state.paymentData.map((val, idx) => {
            const { id, username, status, tanggalBelanja, tanggalSelesai, totalPrice, userId, transactions_details } = val
            if (val.status == "pending") {
                return (
                    <tr key={`Members-${id}`}>
                        <td style={{ color: "red" }}>{status}</td>
                        <td>{tanggalBelanja}</td>
                        <td>{tanggalSelesai}</td>
                        <td>{totalPrice}</td>
                        <td>{username}</td>
                        <td>
                            <Table>
                                <thead>
                                    <tr class="table-primary">
                                        <th>No.</th>
                                        <th>ProductId</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions_details.map(((value, idx) => {
                                        return (
                                            <tr>
                                                <td>{idx + 1}</td>
                                                <td>{value.productId}</td>
                                                <td>{value.price}</td>
                                                <td>{value.quantity}</td>
                                                <td>{value.totalPrice}</td>
                                            </tr>
                                        )
                                    }))}
                                </tbody>
                            </Table>
                        </td>
                        <td className="d-flex flex-row">
                            <ButtonUI onClick={() => this.konfirmasiPayment(id, idx)} className="mr-1">Konfirmasi</ButtonUI>
                        </td>
                    </tr>
                )
            }
        })
    }
    componentDidMount() {
        this.addpaymentData()
    }
    render() {
        return (
            <div className="text-center">
                <h3>Pending Stat's</h3>
                <Table className="py-4 text-center">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Tanggal Belanja</th>
                            <th>Tanggal Selesai</th>
                            <th>Total Harga</th>
                            <th>Username</th>
                            <th>Transactions Detail</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPayment()}
                    </tbody>
                </Table>
                <h3>Completed Stat's</h3>
                <Table style={{marginTop:"100"}} className="py-4 text-center">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Tanggal Belanja</th>
                            <th>Tanggal Selesai</th>
                            <th>Total Harga</th>
                            <th>Username</th>
                            <th>Transactions Detail</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderPayment2()}
                    </tbody>
                </Table>
            </div>
        )
    }
}
export default Payment