import React from "react";
import { connect } from "react-redux";
import "./Cart.css";

import Axios from "axios";
import { API_URL } from "../../../constants/API";

class Cart extends React.Component {
    state={
        dataCart:{}
    }
  componentDidMount() {
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
      .then((res) => {
          this.setState({dataCart:res.data[0]})
          console.log(this.state.dataCart.product);
      })
      .catch((err) => {
        console.log(err);
      });

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
  }
  renderCart =()=>{

  }
  render() {
    return (
      <div className="container">
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Desc</th>
                </tr>
            </thead>
            <tbody>

            </tbody>
        </table>
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
