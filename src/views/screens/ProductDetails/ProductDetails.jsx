import React from "react";
import { connect } from "react-redux";
import swal from "sweetalert";

import "./ProductDetails.css";
import ButtonUI from "../../components/Button/Button";
import TextField from "../../components/TextField/TextField";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import {totalCart} from "../../../redux/actions/search"
class ProductDetails extends React.Component {
  state = {
    productData: {
      image: "",
      productName: "",
      price: 0,
      desc: "",
      category: "",
      id: 0,
    },
  };
  addToWishListHandler =()=>{
    Axios.get(`${API_URL}/wishlist`, {
      params: {
        userId: this.props.user.id,
        productId: this.state.productData.id
      }
    })
    .then((res)=>{
      if (res.data.length==0) {
        Axios.post(`${API_URL}/wishlist`, {
          userId: this.props.user.id,
          productId: this.state.productData.id,
          quantity: 1,
        })
          .then((res) => {
            console.log(res);
            swal("", "Your item has been add to your wishList", "success")
          })
          .catch((err) => {
            console.log(err);
          })
      }else {
        swal("Ooops","Your item has been added in your wishlist","error")
      }
    })
  }
  addToCartHandler = () => {
    // console.log(this.props.user.id);
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        productId: this.state.productData.id
      }
    })
      .then((res) => {
        if (res.data.length == 0) {
          Axios.post(`${API_URL}/carts`, {
            userId: this.props.user.id,
            productId: this.state.productData.id,
            quantity: 1,
          })
            .then((res) => {
              // console.log(res);
              swal("", "Your item has been add to your cart", "success")
              Axios.get(`${API_URL}/carts`, {
                params: {
                  userId: this.props.user.id,
                  _expand: "product",
                },
              })
              .then((res)=>{
                // console.log(res.data.length)
                
                // console.log(qtyTotal)
                this.props.totalCart(res.data.length)
              })
              .catch((err)=>{
                console.log(err)
              })
            })
            .catch((err) => {
              console.log(err);
            })
        } else {
          Axios.patch(`${API_URL}/carts/${res.data[0].id}`, {
            quantity: res.data[0].quantity + 1,
          })
            .then((res) => {
              // console.log("barang sudah ada, dibeli lagi")
              swal("", `you buy for ${res.data.quantity} items`, "success")
              Axios.get(`${API_URL}/carts`, {
                params: {
                  userId: this.props.user.id,
                  _expand: "product",
                },
              })
              .then((res)=>{
                console.log(res.data)
              })
            })
            .catch((err) => {
              console.log(err);
            })
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  componentDidMount() {
    Axios.get(`${API_URL}/products/${this.props.match.params.productId}`)
      .then((res) => {
        this.setState({ productData: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    const {
      productName,
      image,
      price,
      desc,
      category,
      id,
    } = this.state.productData;
    return (
      <div className="container">
        <div className="row py-4">
          <div className="col-6 text-center">
            <img
              style={{ width: "100%", objectFit: "contain", height: "550px" }}
              src={image}
              alt=""
            />
          </div>
          <div className="col-6 d-flex flex-column justify-content-center">
            <h3>{productName}</h3>
            <h4>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(price)}
            </h4>
            <p className="mt-4">{desc}</p>
            {/* <TextField type="number" placeholder="Quantity" className="mt-3" /> */}
            <div className="d-flex flex-row mt-4">
              <ButtonUI onClick={this.addToCartHandler}>Add To Cart</ButtonUI>
              <ButtonUI onClick={this.addToWishListHandler} className="ml-4" type="outlined">
                Add To Wishlist
              </ButtonUI>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps,{totalCart})(ProductDetails);
