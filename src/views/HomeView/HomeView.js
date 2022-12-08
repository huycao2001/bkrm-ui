import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import PageNotFound from "../../pages/PageNotFound/PageNotFound";

import Home from "./Home/Home";

import React, { useEffect, useState } from "react";

const HomeView = (props) => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/*`}>
        <Redirect to={path} />
      </Route>
      <Route path={path} component={Home} />

    </Switch>
  );
};

export default HomeView;