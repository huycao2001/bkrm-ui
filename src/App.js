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

import Echo from "laravel-echo";
import Pusher from "pusher-js";

// const SignupPage = React.lazy(() => import("./pages/SignupPage/SignupPage.js"));

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_APP_KEY,
  wsHost: process.env.REACT_APP_PUSHER_URL,
  wsPort: process.env.REACT_APP_PUSHER_PORT,
  wssPort: process.env.REACT_APP_PUSHER_PORT,
  forceTLS: false,
  disableStats: true,
  encrypted: false,
  enabledTransports: ['ws', 'wss'],
  // cluster: 'mt1',
});

function App() {
  var isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const customization = useSelector((state) => state.customize);
  console.log(isLoggedIn);
  console.log("Customization : " + JSON.stringify(customization));
  const [path, setPath] = useState("/home");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifyToken());
    setPath(sessionStorage.getItem("BKRMprev"));
    // dispatch(loadBranches(store_uuid));

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
