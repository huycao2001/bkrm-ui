import React from "react";
import { useLocation, useParams, useRouteMatch } from "react-router-dom";

const HomePage = (props) => {
    const path = useRouteMatch(); 
    console.log(`${path.path}/sales` );
    
    return (
        <div>
            This is the HomePage
        </div>
    )
}

export default HomePage; 