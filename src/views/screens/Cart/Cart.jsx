import React from "react";
import { connect } from "react-redux";
import "./Cart.css";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Table, Alert } from "reactstrap"
import { Link } from "react-router-dom";
import {deleteQty, totalCart} from "../../../redux/actions/search"
import swal from "sweetalert";
class Cart extends React.Component {
  state = {
    cartData: [],
    kondisiTransaksi: false,
    totalPrice: 0,
    checkoutItems: [],
    kondisiCekout:false,
    tampung:"",
    hargaOngkir:0
  }
  componentDidMount() {
    // Axios.get(`${API_URL}/products/1`, {
    //   params: {
    //     _embed: "carts",
    //   },
    // })
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    this.addCart()
  }
  cekout =()=>{
    this.setState({
      kondisiCekout:true
    })
  }
  addCart = () => {
    let hargaTotal = 0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data })
        console.log(this.state.cartData);
        this.state.cartData.map((val) => {
          hargaTotal += val.quantity * val.product.price
        })
        this.setState({
          totalPrice: hargaTotal
        })
      })
      .catch((err) => {
        alert("error")
        console.log(err);
      });
  }
  deleteCart = (id) => {
    // alert(id)
    Axios.get(`${API_URL}/carts/${id}`)
      .then((res) => {
        console.log(res.data.length)
        this.props.deleteQty(1)
        Axios.delete(`${API_URL}/carts/${id}`)
          .then((res) => {
            console.log(res.data)
            alert("sudah terhapus")
            this.addCart()
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })

  }
  renderCart = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val
      const { productName, price, image } = product
      return (
        <tr key={`cartData-${id}`}>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>{price}</td>
          <td>{quantity}</td>
          <td><img src={image} width="80" /></td>
          <td className="d-flex flex-row">
            <ButtonUI
              onClick={() => this.deleteCart(id)}
              style={{ backgroundColor: "red" }}
            >
              Delete
            </ButtonUI>
            <input onChange={(e) => this.checkedboxHandler(e, idx)} type="checkbox" />
          </td>
        </tr>
      )
    })
  }
  checkedboxHandler = (e, idx) => {
    const { checked } = e.target
    if (checked) {
      this.setState({ checkoutItems: [...this.state.checkoutItems, idx] })

    }
    else {
      this.setState({
        checkoutItems: [
          ...this.state.checkoutItems.filter((val) => val !== idx)
        ]
      })
    }
  }
  penampung =(e)=>{
    this.setState({
      tampung:e
    })
  }
  transaksiCart = () => {
    if (this.state.tampung=="Instant") {
      this.setState({
        hargaOngkir:100000
      })
    }
    else if(this.state.tampung=="Sameday"){
      this.setState({
        hargaOngkir:50000
      })
    }
    else if(this.state.tampung=="Express"){
      this.setState({
        hargaOngkir:20000
      })
    }
    else if(this.state.tampung=="Economy"){
      this.setState({
        hargaOngkir:0
      })
    }
    this.setState({
        kondisiTransaksi: true
      })
      // console.log(this.state.tampung)
      // console.log(this.state.hargaOngkir)
  }
  renderTraksaksi = () => {
    return this.state.cartData.map((val, idx) => {
      const { quantity, product, id } = val
      const { productName, price, image } = product
      return (
        <tr key={`cartData-${id}`}>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>{price}</td>
          <td>{quantity}</td>
          <td><img src={image} width="80" /></td>
          <td>{quantity * price}</td>
        </tr>
      )
    })
  }
  confirmTransaksi = () => {
    const { totalPrice, cartData } = this.state
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    var today = new Date()
    var date = today.getDate() + '-' + monthNames[(today.getMonth())] + '-' + today.getFullYear()
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    var dateTime = date + ' ' + time
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product"
      }
    })
      .then((res) => {
        res.data.map(val => {
          Axios.delete(`${API_URL}/carts/${val.id}`)
            .then((res) => {
              swal('Nuhun!!', 'Transaksi selesai', 'success')
              this.addCart()
            })
            .catch((err) => {
              console.log(err);
            });
        })
        Axios.post(`${API_URL}/transactions`, {
          userId: this.props.user.id,
          totalPrice: totalPrice+this.state.hargaOngkir,
          status: "pending",
          tanggalBelanja: dateTime,
          tanggalSelesai: "",
          username: this.props.user.username
        })
          .then(res => {
            console.log(res.data)
            cartData.map(val => {
              Axios.post(`${API_URL}/transactions_details`, {
                productId: val.product.id,
                transactionId: res.data.id,
                price: val.product.price,
                totalPrice: val.product.price * val.quantity,
                quantity: val.quantity
              })
                .then((res) => {
                  // console.log(res)
                  this.props.totalCart(0)
                })
                .catch((err) => {
                  console.log(err)
                })
            })
          })
          .catch((err) => {
            console.log(err)
          })
      })
      .catch((err) => {
        console.log(err)
      })

  }
  render() {
    return (
      <div className="container py-4">
        {
          this.state.cartData.length > 0 ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Image</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {this.renderCart()}
                </tbody>
              </Table>
              <div className="d-flex justify-content-center">
                <ButtonUI onClick={this.cekout} className="mr-4" type="outlined">CheckOut</ButtonUI>
                <ButtonUI onClick={() => alert(this.state.checkoutItems)}>cek CheckBox</ButtonUI>
              </div>
              {
                  (!this.state.kondisiCekout)?(
                    <>

                    </>
                  ):(
                    <>
                    <br/>
                    <select onChange={(e)=>this.penampung(e.target.value)}>
                      <option value="Instant">Instant</option>
                      <option selected value="Sameday">Sameday</option>
                      <option value="Express">Express</option>
                      <option value="Economy">Economy</option>
                    </select>
                    <ButtonUI onClick={this.transaksiCart}>Transaction</ButtonUI>
                    </>
                    )
                  }
              {
                (!this.state.kondisiTransaksi) ? (null)
                  : (
                    <>
                      <h4>Konfirmasi Total Pembelian Anda</h4>
                      <Table style={{ marginTop: "10px" }}>
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Product Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Image</th>
                            <th>Total Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {this.renderTraksaksi()}
                        </tbody>
                      </Table>
                      <div className="d-flex flex-column">
                        <center>
                          <h4 className="mb-4">Total Belanja Anda Adalah: {this.state.totalPrice +this.state.hargaOngkir}</h4>
                          <ButtonUI onClick={this.confirmTransaksi} type="outlined">Confirm</ButtonUI>
                        </center>
                      </div>
                    </>
                  )
              }
            </>
          ) : (
              <Alert>
                Your Cart is Empty!<Link to="/">Go Shopping</Link>

              </Alert>
            )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchtoProps = {
deleteQty,totalCart
}

export default connect(mapStateToProps,mapDispatchtoProps)(Cart);
