// -- React and related libs
import React from "react";
import { connect } from "react-redux";
import { Switch, Route, withRouter, Redirect } from "react-router";

// -- Third Party Libs
import PropTypes from "prop-types";

// -- Custom Components
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";
import Footer from "../Footer/Footer";
import Breadcrumbs from "../Breadbrumbs/Breadcrumbs";
import Dashboard from "../../pages/dashboard/Dashboard";
import Tables from "../../pages/tables/Tables";
import Charts from "../../pages/uielements/charts/Charts";
import Product from "../../pages/product/product";
import Addproduct from "../../pages/product/addproduct";
import Categorylist from "../../pages/category/categorylist";
import Subcategory from "../../pages/subcategory/subcategory";
import Tools from "../../pages/tools/tools";
import Editproduct from "../../pages/product/editproduct";
import EditCategory from "../../pages/category/editcategory";
import EditSubCategory from "../../pages/subcategory/editsubcategory";
import EditTool from "../../pages/tools/edittools";
import Usermanagement from "../../pages/user/usermanagement";

// -- Component Styles
import s from "./Layout.module.scss";

const Layout = (props) => {
  return (
    <div className={s.root}>
      <div className={s.wrap}>
        <Header />
        <Sidebar />
        <main className={s.content}>
          <Breadcrumbs url={props.location.pathname} />
          <Switch>
            <Route path="/template" exact render={() => <Redirect to="template/dashboard"/>} />
            <Route path="/template/dashboard" exact component={Dashboard}/>
            <Route path="/template/tables" exact component={Tables} />
            <Route path="/template/ui-elements" exact render={() => <Redirect to={"/template/ui-elements/charts"} />} />
            <Route path="/template/ui-elements/charts" exact component={Charts} />
            <Route path="/template/addproduct" exact component={Addproduct}/>
            <Route path="/template/product" exact component={Product}></Route>
            <Route path="/template/category" exact component={Categorylist}></Route>
            <Route path="/template/subcategory" exact component={Subcategory}></Route>
            <Route path="/template/tool" exact component={Tools}></Route>
            <Route path="/template/editproduct/:posturl" exact component={Editproduct}></Route>
            <Route path="/template/editcategory/:posturl" exact component={EditCategory}></Route>
            <Route path="/template/editsubcategory/:posturl" exact component={EditSubCategory}></Route>
            <Route path="/template/edittool/:posturl" exact component={EditTool}></Route>
            <Route path="/template/usermanagement" exact component={Usermanagement}></Route>
            <Route path='*' exact render={() => <Redirect to="/error" />} />
          </Switch>
        </main>
        <Footer />
      </div>
    </div>
  );
}

Layout.propTypes = {
  sidebarOpened: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
}

function mapStateToProps(store) {
  return {
    sidebarOpened: store.navigation.sidebarOpened,
  };
}

export default withRouter(connect(mapStateToProps)(Layout));
