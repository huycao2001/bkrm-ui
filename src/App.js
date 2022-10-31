import { useDispatch, useSelector } from "react-redux";
import { authActions } from "./store/slice/authSlice";




function App() {

  var isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch()
  console.log(isLoggedIn);
  return (
    <div className="App">
      
      <p>{String(isLoggedIn)}</p>
      <button onClick={() => dispatch(authActions.logIn())}>Login </button>


    </div>
  );
}

export default App;
