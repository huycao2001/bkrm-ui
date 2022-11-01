import React from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/slice/authSlice";

const LoginPage = (props) => {
    const dispatch = useDispatch();
    return (
        <div>
            This is the Login page

            <button onClick={()=> dispatch(authActions.logIn()) }>Log in</button>
        </div>
    )
}

export default LoginPage;