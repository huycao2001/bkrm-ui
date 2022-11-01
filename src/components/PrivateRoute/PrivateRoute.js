import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Route, Redirect, useLocation } from "react-router-dom";
const PrivateRoute = ({ children, ...rest }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation()
  if(isLoggedIn){
    sessionStorage.setItem("BKRMprev",location.pathname)
  }

  console.log("private route is called");
  console.log("mylocaltion is : " + location.pathname);
  console.log("children " + children);
  console.log("rest " + JSON.stringify(rest));
  return (
    <Route
      {...rest}
      render={() =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
            }}
          />
        )
      }
    />
  );
};
export default PrivateRoute;
