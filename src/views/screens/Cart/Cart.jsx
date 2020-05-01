import React from "react";
import { connect } from "react-redux";
import "./Cart.css";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import { Table, Alert } from "reactstrap"
import { Link } from "react-router-dom";
import TextField from "../../components/TextField/TextField";
import swal from "sweetalert";
class Cart extends React.Component {
  state = {
    cartData: [],
    kondisiTransaksi: false,
    totalPrice: 0
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
  addCart = () => {
    let hargaTotal =0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data })
        console.log(this.state.cartData);
        this.state.cartData.map((val)=>{
          hargaTotal+= val.quantity *val.product.price
        })
        this.setState({
          totalPrice:hargaTotal
        })
      })
      .catch((err) => {
        alert("error")
        console.log(err);
      });
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
          <td>
            <ButtonUI
              onClick={() => this.deleteCart(id)}
              style={{ backgroundColor: "red" }}
            >
              Delete
            </ButtonUI>
          </td>
        </tr>
      )
    })
  }
  transaksiCart = () => {
   
    this.setState({
      kondisiTransaksi: true
    })
    // console.log(this.state.cartData)
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
    const dataTransaksi = {
      userId:this.props.user.id,
      totalPrice,
      status: "pending",
      items: cartData.map((val) => {
        return {...val.product, quantity: val.quantity}       
      })
    }
    // console.log(dataTransaksi)
    Axios.post(`${API_URL}/transactions`,  dataTransaksi )
      .then((res)=>{
        // this.setState({
          // cartData:[]
        // })
        this.state.cartData.map((val)=>{
          Axios.delete(`${API_URL}/carts/${val.id}`)
          .then((res)=>{
            console.log("berhasil belanja")
            swal("Nuhun!", "Your Transactions Has Been Completed", "success");
            this.addCart()
          })
          .catch((err)=>{
            console.log(err)
          })
        })
      })
      .catch((err)=>{
        console.log(err)
        alert("error")
      })
  }
  deleteCart = (id) => {
    // alert(id)
    Axios.get(`${API_URL}/carts/${id}`)
      .then((res) => {
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
                <ButtonUI onClick={this.transaksiCart}>Transaction</ButtonUI>
              </div>
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
                          <h4 className="mb-4">Total Belanja Anda Adalah: {this.state.totalPrice}</h4>
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

export default connect(mapStateToProps)(Cart);
