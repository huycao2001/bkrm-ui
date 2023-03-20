import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/slice/authSlice";

import { Route, Switch, Redirect, HashRouter } from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import { Box } from "@material-ui/core";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";
import SignUp from "./pages/SignUpPage/SignUpPage.js";
import GlobalSnackbar from "./components/GlobalSnackBar/GlobalSnackBar";
import { useState, useEffect } from "react";
import { verifyToken } from "./store/actionCreator"

// const SignupPage = React.lazy(() => import("./pages/SignupPage/SignupPage.js"));
import Echo from "laravel-echo";
import Pusher from "pusher-js";



window.Echo = new Echo({
  broadcaster: 'pusher',
  key: "apollo13",
  wsHost: "localhost",
  wsPort: 6001,
  wssPort: 6001,
  forceTLS: false,
  disableStats: true,
  encrypted: false,
  enabledTransports: ['ws', 'wss'],
  cluster: 'ap1',
});
function App() {
  var isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const customization = useSelector((state) => state.customize);
  const info = useSelector((state)  => state.info);
  console.log(isLoggedIn);
  console.log("Customization : " + JSON.stringify(customization));
  const [path, setPath] = useState("/home");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyToken());
    setPath(sessionStorage.getItem("BKRMprev"));
    
    // dispatch(loadBranches(store_uuid));
    console.log('Info of store ' + JSON.stringify(info));
  }, [dispatch]);


  return (
    <ThemeProvider theme={theme(customization)}>


      <Box>
        <GlobalSnackbar/>
        <HashRouter>
          <Switch>
            <Route path="/" exact>
              <Redirect to="/home" />
            </Route>

            <PrivateRoute path="/home">
              <HomePage />
            </PrivateRoute>

            <Route path="/login" exact>
              {isLoggedIn ? <Redirect to={path} /> : <LoginPage />}
            </Route>

            <Route path="/signup" exact>
              {isLoggedIn ? <Redirect to={path} /> : <SignUp />}
            </Route>
          </Switch>
        </HashRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
