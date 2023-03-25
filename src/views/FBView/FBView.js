import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import FBTable from "./Table/Table";
import Reservation from "./Reservation/Reservation";
import Cashier from "./Cashier/Cashier";
const FBView = (props) => {
  const { path } = useRouteMatch();
  const permissions = useSelector((state) => state.info.user.permissions);
  return (
    <Switch>
      <Route exact path={path}>
        <Redirect
          to={
            permissions?.find((p) => p.name === "employee")
              ? `${path}/employee`
              : "/home"
          }
        />
      </Route>
      <Route exact path={`${path}/table`} component={FBTable} />
      <Route exact path={`${path}/reservation`} component={Reservation} />
      <Route exact path={`${path}/cashier`} component={Cashier} />
    </Switch>
  );
};

export default FBView;
