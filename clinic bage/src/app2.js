import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Booking from "./Booking";

function App() {
    return ( <
        Router >
        <
        div className = "container" >
        <
        h1 > Welcome to Dentai Clinic < /h1> <
        nav >
        <
        Link to = "/booking" > Book Appointment < /Link> < /
        nav > <
        Routes >
        <
        Route path = "/booking"
        element = { < Booking / > }
        /> < /
        Routes > <
        /div> < /
        Router >
    );
}

export default App;