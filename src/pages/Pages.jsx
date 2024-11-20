import React, {useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutUser from '../components/LayoutUser';
import Home from '../components/HomePage/Home';
import LayoutAdmin from '../components/LayoutAdmin';
import LoginAdmin from '../components/Admin/LoginAdmin';
import Admin from '../components/Admin/Admin';
import Login from '../components/HomePage/Login';
import Register from '../components/HomePage/Register';
import ProductDetail from '../components/HomePage/ProductDetail';
import Cart from '../components/Cart/Cart';
import OrderList from '../components/Admin/OrderList';
import AddProduct from '../components/Admin/AddProduct';
import ListProduct from '../components/HomePage/ListProduct';
import Checkout from '../components/Cart/Checkout';
import DetailProduct from '../components/Admin/DetailProduct';


function Pages() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <>
            <Routes>
                <Route path='/' element={<LayoutUser onSearchResults={(results) => setSearchResults(results)} searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}>
                    <Route index element={<Home />} />
                    <Route path='/productdetail/:productId' element={<ProductDetail />} />
                    <Route path='/cart/' element={<Cart />}></Route>
                    <Route path='/listproduct' element={<ListProduct searchResults={searchResults} setSearchResults={setSearchResults} searchTerm={searchTerm}/>}></Route>
                </Route>
                <Route path='/login' element={<Login />}></Route>
                <Route path='/register' element={<Register />}></Route>
                <Route path='/admin' element={<LayoutAdmin />}>
                    <Route index element={<Admin />} />
                    <Route path='orderlist' element={<OrderList/>}/>
                    <Route path='addproduct' element={<AddProduct/>}/>
                    <Route path='detailproduct/:maThuoc' element={<DetailProduct />} />
                </Route>
                <Route path='/adminlogin' element={<LoginAdmin />}>
                </Route>
                <Route path='/checkout' element={<Checkout />}></Route>
            </Routes>

        </>
    );
}

export default Pages;