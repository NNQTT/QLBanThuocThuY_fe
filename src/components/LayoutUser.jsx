import React, { useEffect, useState } from 'react';
import { Search, Menu, X, ShoppingCart, ChevronDown } from 'lucide-react'
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

import { Dropdown, Menu as AntdMenu, Space, message } from 'antd';

const LayoutUser = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [userinfo, setUserInfo] = useState(null);

    const handleLogout = async () => {
        localStorage.removeItem('accessToken');
        try {
            const res = await axios.post('http://localhost:3000/api/logout', {}, {
                withCredentials: true
            });
            if (res.status === 204) {
                setUserInfo(null);
                sessionStorage.removeItem('userInfo');
                message.success('Đăng xuất thành công');
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const listmenu = ['Trang chủ', 'Sản phẩm', 'Thương hiệu', 'Liên hệ'];

    const createItems = [
        {
            key: '1',
            label: 'Đăng xuất',
            onClick: () => handleLogout()
        }
    ];

    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            const token = localStorage.getItem('accessToken');
            console.log(token);

            try {
                const res = await axios.get('http://localhost:3000/api/authenticationLogin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true

                });
                console.log(res);
                if (res.status === 200) {
                    console.log('Login successfully');
                    setUserInfo(res.data.data);
                    sessionStorage.setItem('userInfo', JSON.stringify(res.data.data));
                    sessionStorage.getItem('userInfo');
                    console.log(sessionStorage.getItem('userInfo'));
                    // localStorage.setItem('accessToken', res.data.accessToken);
                    if (res.data?.method === 'refresh') {
                        localStorage.removeItem('accessToken');
                        localStorage.setItem('accessToken', res.data.accessToken);
                        const token = res.data.accessToken;
                        try {
                            const res = await axios.get('http://localhost:3000/api/reloginwithrefreshtoken', {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                                withCredentials: true
                            });
                            setUserInfo(res.data.data);
                        } catch (error) {
                            console.error(error);
                            if (error.response && error.response.status === 400) {
                                console.log('Login failed');
                            }
                        }
                    }
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    console.log('Login failed');
                }
            }
        };

        (async () => {
            await authenticateUser();
        })();
    }, []);
    return (
        <div>
            <header className="bg-gradient-to-r bg-[#FFE5D9] text-black shadow-lg">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <div className="flex items-center">
                            <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="h-12 w-12 mr-3 rounded-full shadow-md" />
                            <span className="text-2xl font-bold font-serif tracking-wide text-[#4A3228]">Phamarcy</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {listmenu.map((item) => (
                                <a
                                    key={item}
                                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-lg text-[#4A3228] font-medium hover:text-[#FF7F50] transition duration-300 ease-in-out"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>

                        {/* Search, Cart, User Avatar */}
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    className="bg-white bg-opacity-20 text-[#4A3228] placeholder-black-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:bg-opacity-30 transition duration-300 ease-in-out w-64"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#4A3228] group-hover:text-[#FF7F50] transition duration-300 ease-in-out" />
                            </div>
                            <a href="/gio-hang" className="relative hover:text-[#FF7F50] transition duration-300 ease-in-out">
                                <ShoppingCart className="h-6 w-6" />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                            </a>
                            <div className="ml-4 flex items-center relative">
                                {userinfo ? (
                                    <Dropdown menu={{ items: createItems }}>
                                        <button
                                            className="ml-2 flex items-center text-[#4A4E69] hover:text-[#22223B] focus:outline-none"
                                        >
                                            <span className="text-sm font-medium">{userinfo.tentaikhoan}</span>
                                            <ChevronDown className="ml-1 h-4 w-4" />
                                        </button>
                                    </Dropdown>
                                ) : (
                                    <a className="text-sm font-medium" href="/login">
                                        Đăng nhập
                                    </a>
                                )}

                            </div>
                            {/* <div className="ml-4 flex items-center">
                                {userinfo ? (
                                    <button
                                        onClick={handleDropdownClick}
                                        className="ml-2 flex items-center text-[#4A4E69] hover:text-[#22223B] focus:outline-none">
                                        <span className="text-sm font-medium">{userinfo?.tentaikhoan}</span>

                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </button>
                                ) : (
                                    <a href="/login" className="ml-2 flex items-center text-[#4A4E69] hover:text-[#22223B] focus:outline-none">
                                        <span className="text-sm font-medium">Đăng nhập</span>
                                        <ChevronDown className="ml-1 h-4 w-4" />
                                    </a>
                                )}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-16 w-35 bg-white border border-gray-200 rounded shadow-lg">
                                        <div
                                            onClick={handleLogout}
                                            className="block text-sm px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer"
                                        >
                                            Logout
                                        </div>
                                    </div>
                                )}
                            </div> */}
                        </div>



                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden text-[#4A3228] focus:outline-none hover:text-[#FF7F50] transition duration-300 ease-in-out"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}

                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    <div
                        className={`mt-4 md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                            }`}
                    >
                        <nav className="flex flex-col space-y-3">
                            {['Trang chủ', 'Sản phẩm', 'Thương hiệu', 'Liên hệ'].map((item) => (
                                <a
                                    key={item}
                                    href={`/${item.toLowerCase().replace(' ', '-')}`}
                                    className="text-lg text-[#4A3228] font-medium hover:text-[#FF7F50] transition duration-300 ease-in-out"
                                >
                                    {item}
                                </a>
                            ))}
                        </nav>
                        <div className="mt-4 relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                className="w-full bg-white bg-opacity-20 text-[#4A3228] placeholder-black-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:bg-opacity-30 transition duration-300 ease-in-out"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#4A3228]" />
                        </div>
                        <a href="/gio-hang" className="flex items-center mt-4 hover:text-[#FF7F50] transition duration-300 ease-in-out">
                            <ShoppingCart className="h-6 w-6 mr-2" />
                            Giỏ hàng
                            <span className="ml-2 bg-yellow-400 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                        </a>
                    </div>
                </div>
            </header>
            <div>
                <Outlet />
            </div>
        </div>
    );
}

export default LayoutUser;