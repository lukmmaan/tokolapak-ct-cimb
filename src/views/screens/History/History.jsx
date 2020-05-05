import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import ButtonUI from "../../components/Button/Button"
import { Table } from "reactstrap"
import {connect} from "react-redux"
class History extends React.Component {
    state = {
        historyData: [],
        kondisi:false,
        kondisiDetail:false
    }
    getData = () => {
        // console.log(this.props.user.id)
        
        Axios.get(`${API_URL}/transactions`, {
            params: {
                _embed: "transactions_details",
                status: "Completed",
                userId: this.props.user.id
            }
        })
            .then((res) => {
                this.setState({
                    historyData: res.data
                })
                console.log(this.state.historyData)
            })
            .catch((err) => {
                console.log(err)
            })
    }
    renderHistory = () => {
        return this.state.historyData.map((val, idx) => {
            const { username, totalPrice, tanggalSelesai, status, transactions_details } = val
            return (
                <>
                    <tr>
                        <td>{idx + 1}</td>
                        <td>{username}</td>
                        <td>{totalPrice}</td>
                        <td>{tanggalSelesai}</td>
                        <td>{status}</td>
                        <td>
                            {
                                !this.state.kondisiDetail ?(
                                    <ButtonUI onClick={()=>this.setState({kondisiDetail:true})}>Transactions Detail</ButtonUI>
                                ):(
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
                                )
                            }    
                        </td>
                    </tr>
                </>
            )
        })
    }
    componentDidMount() {
        this.getData()
    }
    render() {
        return (
            <div>
                <ButtonUI onClick={()=>this.setState({kondisi:true})}>Melihat Transactions</ButtonUI>
                {
                    this.state.kondisi?(
                        <>
                        <Table>
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Username</th>
                                    <th>Total Price</th>
                                    <th>Tanggal Selesai</th>
                                    <th>Status</th>
                                    <th>Detail Transactions</th>
                                </tr>
                            </thead>
                            <tbody>
                            {this.renderHistory()}
                            </tbody>
                        </Table>
                        </>
                    ):null
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
  const mapDispatchtoProps = {

  }
export default connect(mapStateToProps)(History) 