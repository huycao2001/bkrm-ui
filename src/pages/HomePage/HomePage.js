import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";

const HomePage = (props) => {
    const path = useRouteMatch(); 
    console.log(`${path.path}/sales` );
    console.log("home page called with path " + `/${path.path}`);
    
    return (
        <div>
            This is the HomePage
        </div>
    )
}

export default HomePage; 