import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutUser from '../components/LayoutUser';
import Home from '../components/HomePage/Home';
import LayoutAdmin from '../components/LayoutAdmin';
import Admin from '../components/Admin/Admin';

function Pages() {
    return (
        <>
            <Routes>
                <Route path='/' element={<LayoutUser />}>
                    <Route index element={<Home />} />
                </Route>
                <Route path='/admin' element={<LayoutAdmin />}>
                    <Route index element={<Admin />} />
                </Route>
            </Routes>

        </>
    );
}

export default Pages;