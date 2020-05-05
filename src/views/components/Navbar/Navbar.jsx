import React from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { logoutHandler } from "../../../redux/actions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons/";
import { onchangeTodo } from "../../../redux/actions/"
import { faUser } from "@fortawesome/free-regular-svg-icons";
import "./Navbar.css";
import ButtonUI from "../Button/Button.tsx";
import Axios from "axios";
import { API_URL } from "../../../constants/API";
import {totalCart} from "../../../redux/actions/search"
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
const CircleBg = ({ children }) => {
  return <div className="circle-bg">{children}</div>;
};

class Navbar extends React.Component {
  state = {
    searchBarIsFocused: false,
    searcBarInput: "",
    dropdownOpen: false,
    jumlahPembelian:0,
    cartData:[],
    kondisi: false
  };
  onFocus = () => {
    this.setState({ searchBarIsFocused: true });
  };

  onBlur = () => {
    this.setState({ searchBarIsFocused: false });
  };
  logoutBtnHandler = () => {
    this.props.onLogout();
    
    // this.forceUpdate();
  };
  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };
  addCart=()=>{
    let qtyTotal = 0
    Axios.get(`${API_URL}/carts`, {
      params: {
        userId: this.props.user.id,
        _expand: "product",
      },
    })
    .then((res)=>{
        // console.log(res.data)
        this.setState({cartData:res.data})
        this.state.cartData.map((val)=>{
          qtyTotal+= val.quantity
        })
        this.setState({
          jumlahPembelian:qtyTotal,
        })
        this.props.totalCart(qtyTotal)
        // console.log(qtyTotal)
        // this.addCart()
    })
  }
  componentDidMount(){
      this.addCart()
  }
  render() {
    return (
      <div className="d-flex flex-row justify-content-between align-items-center py-4 navbar-container">
        <div className="logo-text">
          <Link style={{ textDecoration: "none", color: "inherit" }} to="/">
            LOGO
          </Link>
        </div>
        <div style={{ flex: 1 }} className="px-5 d-flex flex-row justify-content-start">
          <input
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={`search-bar ${
              this.state.searchBarIsFocused ? "active" : null
              }`}
            type="text"
            placeholder="Cari produk impianmu disini"
            onChange={(e) => this.props.onchangeTodo(e.target.value)}
          />
        </div>
        <div className="d-flex flex-row align-items-center">
          {this.props.user.id ? (
            <>
              <Dropdown
                toggle={this.toggleDropdown}
                isOpen={this.state.dropdownOpen}
              >
                <DropdownToggle tag="div" className="d-flex">
                  <FontAwesomeIcon icon={faUser} style={{ fontSize: 24 }} />
                  <p className="small ml-3 mr-4">{this.props.user.username}</p>
                </DropdownToggle>
                <DropdownMenu className="mt-2">
                  {
                    this.props.user.role == "admin" ? (
                      <>
                        <DropdownItem>
                          <Link
                            style={{ color: "inherit", textDecoration: "none" }}
                            to="/admin/dashboard"
                          >
                            Dashboard
                              </Link>
                        </DropdownItem>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to="/Members">
                        <DropdownItem>Members</DropdownItem>
                        </Link>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to="/Payment"> 
                        <DropdownItem>Payments</DropdownItem>
                        </Link>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to="/Report">
                        <DropdownItem>Reports</DropdownItem>
                        </Link>
                      </>
                    ) : (
                        <>
                        <Link style={{ textDecoration: "none", color: "inherit" }} to="/wishlist">
                          <DropdownItem>Wishlist</DropdownItem>
                        </Link>
                        <Link  style={{ textDecoration: "none", color: "inherit" }} to="/history">
                          <DropdownItem>History</DropdownItem>
                        </Link>
                        </>
                      )
                  }
                </DropdownMenu>
              </Dropdown>

              <Link
                className="d-flex flex-row"
                to="/cart"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <FontAwesomeIcon
                  className="mr-2"
                  icon={faShoppingCart}
                  style={{ fontSize: 24 }}
                />
                <CircleBg>
                  <small style={{ color: "#3C64B1", fontWeight: "bold" }}>
                    {/* {this.state.jumlahPembelian} */}
                     {this.props.qtyDunia.qty}
                            </small>
                </CircleBg>
              </Link>
              <ButtonUI
                onClick={this.logoutBtnHandler}
                className="ml-3"
                type="textual"
              >
                Logout
                        </ButtonUI>
            </>
          ) : (
              <>
                <ButtonUI className="mr-3" type="textual">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign in
                </Link>
                </ButtonUI>
                <ButtonUI type="contained">
                  <Link
                    style={{ textDecoration: "none", color: "inherit" }}
                    to="/auth"
                  >
                    Sign up
                </Link>
                </ButtonUI>
              </>
            )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user,
    qtyDunia:state.search
  };
};
const mapDispatchtoProps = {
  onchangeTodo,
  onLogout: logoutHandler,
  totalCart
}

export default connect(mapStateToProps, mapDispatchtoProps)(Navbar);
