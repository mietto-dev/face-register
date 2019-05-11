import React from "react";
import { Route, HashRouter, Switch } from "react-router-dom";
// import Dashboard from './pages/Dashboard'
// import Wizard from './pages/Wizard'
// import Cards from './pages/Cards'
// import Main from './pages/Main'
import Signup from "./pages/Signup";
import ScrollToTop from "./components/ScrollTop";

export default props => (
  <HashRouter>
    <ScrollToTop>
      <Switch>
        <Route exact path="/:userId?" component={Signup} />
      </Switch>
    </ScrollToTop>
  </HashRouter>
);
