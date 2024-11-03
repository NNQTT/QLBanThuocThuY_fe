import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutUser from '../components/LayoutUser';
import Home from '../components/HomePage/Home';
import LayoutAdmin from '../components/LayoutAdmin';
import LoginAdmin from '../components/Admin/LoginAdmin';
import Admin from '../components/Admin/Admin';
import Login from '../components/HomePage/Login';
import Register from '../components/HomePage/Register';
import Cart from '../components/Cart/Cart';
import OrderList from '../components/Admin/OrderList';


function Pages() {
    return (
        <>
            <Routes>
                <Route path='/' element={<LayoutUser />}>
                    <Route index element={<Home />} />
                </Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/admin' element={<LayoutAdmin />}>
                    <Route index element={<Admin />} />
                    <Route path='orderlist' element={<OrderList/>}/>
                </Route>
                <Route path='/adminlogin' element={<LoginAdmin />}>
                </Route>
                <Route path='/cart/:cartId' element={<Cart />}></Route>
            </Routes>

        </>
    );
}

export default Pages;