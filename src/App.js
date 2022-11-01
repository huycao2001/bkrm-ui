import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/slice/authSlice";

import {
  Route,
  Switch,
  Redirect,
  HashRouter,
  BrowserRouter,
} from "react-router-dom";

import HomePage from "./pages/HomePage/HomePage";




function App() {

  var isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch()
  console.log(isLoggedIn);
  return (
    <BrowserRouter>
        <Switch>
            <Route path='/home'>
              <HomePage />
            </Route>
        </Switch>
    </BrowserRouter>
  );
}

export default App;
