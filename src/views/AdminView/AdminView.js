import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";

import React from "react";
import Admin from "./Admin/Admin";
import Inventory from "../InventoryView/Inventory/Inventory";

const AdminView = (props) => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}/*`}>
        <Redirect to={path} />
      </Route>
      <Route path={path} component={Admin} />
      {/* changed behavior to just default to admin/ and redirect admin/* so no more pagenotfound */}
      {/* <Route exact path={`${path}/*`} component={PageNotFound} />  */}

    </Switch>
  );
};

export default AdminView;