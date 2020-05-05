import React from "react"
import Axios from "axios"
import { API_URL } from "../../../constants/API"
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Table } from "reactstrap";
import ButtonUI from "../../components/Button/Button";
import swal from "sweetalert";
import {tambahQty} from "../../../redux/actions/search"
class Wishlist extends React.Component {
    state = {
        wishlistData: []
    }
    addWishlist = () => {
        Axios.get(`${API_URL}/wishlist`, {
            params: {
                userId: this.props.user.id,
                _expand: "product",
            }
        })
            .then((res) => {
                this.setState({
                    wishlistData: res.data
                })
                // console.log(this.state.wishlistData)
            })
    }
    deleteWishlist = (id) => {
        // alert(id)
        Axios.get(`${API_URL}/wishlist/${id}`)
            .then((res) => {
                Axios.delete(`${API_URL}/wishlist/${id}`)
                    .then((res) => {
                        console.log(res.data)
                        // alert("sudah terhapus")
                        this.addWishlist()
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
    addToCart = (userId, productId,idx,id) => {
        // console.log(userId,productId)
        Axios.get(`${API_URL}/carts`, {
            params: {
                userId,
                productId
            }
        })
            .then((res) => {
                console.log(res.data)
                if (res.data.length == 0) {
                    // console.log("tidak dapat")
                    Axios.post(`${API_URL}/carts`, {
                        userId,
                        productId,
                        quantity: this.state.wishlistData[idx].quantity
                    })
                        .then((res) => {
                            console.log(res.data.length);
                            swal("", "Your item has been add to your cart", "success")
                            this.deleteWishlist(id)
                            this.props.tambahQty(1)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                else {
                    Axios.patch(`${API_URL}/carts/${res.data[0].id}`,{
                        quantity: res.data[0].quantity + this.state.wishlistData[idx].quantity
                    })
                    .then((res) => {
                        // console.log("barang sudah ada, dibeli lagi")
                        swal("", `you buy for ${res.data.quantity} items`, "success")
                        this.deleteWishlist(id)
                      })
                      .catch((err) => {
                        console.log(err);
                      })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }
    renderWishlist = () => {
        return this.state.wishlistData.map((val, idx) => {
            const { userId, productId, quantity, product, id } = val
            const { productName, price, image } = product
            return (
                <tr key={`wishlist-${id}`}>
                    <td>{idx + 1}</td>
                    <td>{productName}</td>
                    <td>{price}</td>
                    <td>{quantity}</td>
                    <td><img src={image} width="80" /></td>
                    <td className="d-flex">
                        <ButtonUI
                            onClick={() => this.deleteWishlist(id)}
                            style={{ backgroundColor: "red" }}
                        >
                            Delete
                        </ButtonUI>
                        <ButtonUI
                            onClick={() => this.addToCart(userId, productId,idx,id)}
                            style={{ marginLeft: "10px" }}
                        >
                            Add to Cart
                        </ButtonUI>
                    </td>
                </tr>
            )
        })
    }
    componentDidMount() {
        this.addWishlist()
    }
    render() {
        return (
            <div className="container py-4">
                {
                    this.state.wishlistData.length == 0 ? (
                        <Alert>
                            Your wishlist is Empty!<Link to="/">Go Shopping</Link>
                        </Alert>
                    ) : (
                            <div>
                                <h2 className="text-center">Wish - List</h2>
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
                                        {this.renderWishlist()}
                                    </tbody>
                                </Table>
                            </div>
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
export default connect(mapStateToProps,{tambahQty})(Wishlist)