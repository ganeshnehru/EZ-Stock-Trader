import React from "react"
import {Routes,Route,Navigate} from 'react-router-dom'

import Home from '../Pages/Home';
import Signin from '../Pages/Signin';
import Signup from '../Pages/Signup';
import ThankYou from "../Pages/ThankYou";
import StockVoting from "../Pages/StockVoting";
import StockPrediction from "../Pages/StockPrediction"
import About from "../Pages/About";
import Failure from "../Pages/Failure";
import TradingViewWidget from "../Pages/TradingViewWidget";
const Routers =()=>{
    return (
        <Routes>
            <Route path='/' element={<Navigate to='/home'/>} />
            <Route path='/home' element={<Home/>} />
            <Route path='/signin' element={<Signin/>} />
            <Route path='/signup' element={<Signup/>} />
            <Route path='/stocks' element={<StockVoting/>} />
            <Route path='/predict' element={<StockPrediction/>} />
            <Route path='/thank-you' element={<ThankYou/>} />
            <Route path='/failure' element={<Failure/>} />
            <Route path='/about' element={<About/>} />
            <Route path='/view' element={<TradingViewWidget/>} />
            </Routes>

    )
};

export default Routers;