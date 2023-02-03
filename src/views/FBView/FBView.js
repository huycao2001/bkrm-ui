import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import React from "react";
import { useSelector } from "react-redux";
import FBTable from "./Table/Table";
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
    </Switch>
  );
};

export default FBView;
