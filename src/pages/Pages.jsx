import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutUser from '../components/LayoutUser';
import Home from '../components/HomePage/Home';
import LayoutAdmin from '../components/LayoutAdmin';
import LoginAdmin from '../components/Admin/LoginAdmin';
import Admin from '../components/Admin/Admin';
import Login from '../components/HomePage/Login';
import Register from '../components/HomePage/Register';
import ProductDetail from '../components/HomePage/ProductDetail';


function Pages() {
    return (
        <>
            <Routes>
                <Route path='/' element={<LayoutUser />}>
                    <Route index element={<Home />} />
                    <Route path='/productdetail' element={<ProductDetail />} />
                </Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/admin' element={<LayoutAdmin />}>
                    <Route index element={<Admin />} />
                </Route>
                <Route path='/adminlogin' element={<LoginAdmin />}>
                </Route>
            </Routes>

        </>
    );
}

export default Pages;