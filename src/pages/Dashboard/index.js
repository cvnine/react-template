import React from 'react';
import { useLocation } from "react-router-dom";
import './index.scss';

const Dashboard = () => {
    let location = useLocation();


    return (
        <div>Dashboard   {location.pathname}</div>
    )
}

export default Dashboard
