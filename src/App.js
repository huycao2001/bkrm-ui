import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/slice/authSlice";

import {
  Route,
  Switch,
  Redirect,
  HashRouter,
  BrowserRouter,
} from "react-router-dom";

import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";

import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import HomePage from "./pages/HomePage/HomePage";
import LoginPage from "./pages/LoginPage/LoginPage";




function App() {

  var isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const customization = useSelector((state) => state.customize);
  console.log(isLoggedIn);
  console.log("Customization : " + JSON.stringify(customization));
  return (
    <ThemeProvider theme={theme(customization)}>
        <BrowserRouter>
          <Switch>
              <Route path="/" exact>
                <Redirect to="/home" />
              </Route>

              <PrivateRoute path='/home'>
                <HomePage />
              </PrivateRoute>

              <Route path="/login" exact>
                {isLoggedIn ? <Redirect to={"/home"} /> : <LoginPage />}
              </Route>
          </Switch>
        </BrowserRouter>
    </ThemeProvider>

  );
}

export default App;
