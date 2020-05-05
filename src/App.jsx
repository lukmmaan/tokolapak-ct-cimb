import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookie from "universal-cookie";
import { connect } from "react-redux";

import "./App.css";
import "bootstrap/dist/css/bootstrap.css";

import Home from "./views/screens/Home/Home";
import Navbar from "./views/components/Navbar/Navbar";
import AuthScreen from "./views/screens/Auth/AuthScreen";
import ProductDetails from "./views/screens/ProductDetails/ProductDetails";
import { userKeepLogin, cookieChecker } from "./redux/actions";
import Cart from "./views/screens/Cart/Cart";
import AdminDashboard from "./views/screens/Admin/AdminDashboard";
import Wishlist from "./views/screens/Wishlist/Wishlist";
import Members from "./views/screens/Members/Members";
import Payment from "./views/screens/Payment/Payment";
import PageNotFound from "./views/screens/PageNotFound/PageNotFound";
import History from "./views/screens/History/History";
import Report from "./views/screens/Report/Report";
const cookieObj = new Cookie();

class App extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      let cookieResult = cookieObj.get("authData",{path:"/"});
      if (cookieResult) {
        this.props.keepLogin(cookieResult);

      } else {
        this.props.cookieChecker();
      }
    }, 200);
  }
  renderAdminRoutes = () => {
    if (this.props.user.role === "admin") {
      return(
        <>
      <Route exact path="/admin/dashboard" component={AdminDashboard} />
      <Route exact path="/members" component={Members}/>
      <Route exact path="/payment" component={Payment}/>
      <Route exact path="/Report" component={Report}/>
      </>
      )
    }
    else{
      return <Route exact path="*"  component={PageNotFound}/>
    }
  };
  render() {
    if (this.props.user.cookieChecked) {
      return (
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/auth" component={AuthScreen} />
            <Route
              exact
              path="/products/:productId"
              component={ProductDetails}
            />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/wishlist" component={Wishlist}/>
            <Route exact path="/members" component={Members}/>
            <Route exact path="/history" component={History}/>
            {this.renderAdminRoutes()}
          </Switch>
          <div style={{ height: "120px" }} />
        </>
      );
    } else {
      return <div>Loading ...</div>;
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = {
  keepLogin: userKeepLogin,
  cookieChecker,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));