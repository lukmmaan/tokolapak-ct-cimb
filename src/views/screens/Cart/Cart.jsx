import React from "react";
import { connect } from "react-redux";
import "./Cart.css";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import ButtonUI from "../../components/Button/Button";
import {Table,Alert} from "reactstrap"
import { Link } from "react-router-dom";
class Cart extends React.Component {
  state = {
    cartData: []
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
  
   addCart =()=>{
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
        this.setState({ cartData: res.data })
        console.log(this.state.cartData);
      })
      .catch((err) => {
        console.log(err);
      });
   } 
   renderCart = () => {
    return this.state.cartData.map((val, idx) => {
      const {quantity,product,id} = val
      const {productName,price,image} = product
      return (
        <tr key={`cartData-${id}`}>
          <td>{idx + 1}</td>
          <td>{productName}</td>
          <td>{price}</td>
          <td>{quantity}</td>
          <td><img src={image} width="80" /></td>
          <td>
            <ButtonUI
            onClick={()=>this.deleteCart(id)}
            style={{ backgroundColor: "red" }}
            >
            Delete
            </ButtonUI>
          </td>
        </tr>
      )
    })
  }
  deleteCart = (id) => {
    // alert(id)
    Axios.delete(`${API_URL}/carts/${id}`)
    .then((res) => {
        console.log(res.data)
        alert("sudah terhapus")
        this.addCart()
    })
    .catch((err) => {
        console.log(err)
    })
  }
  render() {
    return (
      <div className="container py-4">
        {
          this.state.cartData.length>0 ?(
        <Table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Product Name</th>
              <th>Price</th>
              <th>Qantity</th>
              <th>Image</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.renderCart()}
          </tbody>
        </Table>
          ):(
            <Alert>
              Your Cart is Empty! <Link to="/">Go Shopping</Link>
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
