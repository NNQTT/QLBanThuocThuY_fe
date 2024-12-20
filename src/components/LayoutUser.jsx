import React, { useEffect, useState } from 'react';
import { Search, Menu, X, ShoppingCart, ChevronDown, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'
import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { DownOutlined } from '@ant-design/icons';

import { Dropdown, Menu as AntdMenu, Space, message } from 'antd';

const LayoutUser = ({ onSearchResults, searchTerm, setSearchTerm }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userinfo, setUserInfo] = useState(null);
    const [cart, setCart] = useState([]);
    //const [searchTerm, setSearchTerm] = useState('');

    const nav = useNavigate();

    useEffect(() => {
        const getCart = async () => {
            if (userinfo) {
                const res = await axios.get(`http://localhost:3000/cart/${userinfo.tentaikhoan}`);
                setCart(res.data);
            } else {
                let cart = sessionStorage.getItem('cart');
                if (cart) {
                    setCart(JSON.parse(cart));
                } else {
                    setCart([]);
                }
            }
        };

        getCart();
    });

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

    const handleSearch = async (e) => {
        if (e.key === "Enter" && searchTerm) {
            try {
                const res = await axios.get(`http://localhost:3000/product/getproductsbyname`, {
                    params: { 
                        searchTerm,
                        page: 1,
                        pagesize: 12
                    }
                });
                
                onSearchResults(res.data.products);
                console.log("Search results in LayoutUser:", res.data);
                nav('/listproduct');
            } catch (err) {
                console.error('Error:', err);
            }
        }
    };

    const menuItems = [
        { text: 'Trang chủ', path: '/' },
        { text: 'Sản phẩm', path: '/listproduct' },
        { text: 'Liên hệ', path: '/aboutus' },
    ]

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
                            {/* <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="h-12 w-12 mr-3 rounded-full shadow-md" /> */}
                            <span className="text-2xl font-bold font-serif tracking-wide text-[#4A3228]">Pharmacy</span>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex space-x-8">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.text}
                                    to={item.path}
                                    className="text-lg text-[#4A3228] font-medium hover:text-[#FF7F50] transition duration-300 ease-in-out"
                                >
                                    {item.text}
                                </Link>
                            ))}
                        </nav>

                        {/* Search, Cart, User Avatar */}
                        <div className="hidden md:flex items-center space-x-6">
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="bg-white bg-opacity-20 text-[#4A3228] placeholder-black-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#F4A261] focus:bg-opacity-30 transition duration-300 ease-in-out w-64"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#4A3228] group-hover:text-[#FF7F50] transition duration-300 ease-in-out" />
                            </div>
                            <a href="/cart" className="relative hover:text-[#FF7F50] transition duration-300 ease-in-out">
                                <ShoppingCart className="h-6 w-6" />
                                {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{cart.length}</span>}
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
            <footer className="bg-[#FFE5D9] text-[#4A3228] shadow-lg">
                <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Company Info */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                {/* <img src="/placeholder.svg?height=40&width=40" alt="Logo" className="h-12 w-12 mr-3 rounded-full shadow-md" /> */}
                                <span className="text-2xl font-bold font-serif tracking-wide text-[#4A3228]">Phamarcy</span>
                            </div>
                            <p className="text-sm">Chúng tôi cung cấp các sản phẩm dược phẩm chất lượng cao và dịch vụ chăm sóc sức khỏe tận tâm.</p>
                            <div className="flex space-x-4">
                                <a href="#" className="text-[#4A3228] hover:text-[#FF7F50] transition duration-300">
                                    <Facebook size={24} />
                                    <span className="sr-only">Facebook</span>
                                </a>
                                <a href="#" className="text-[#4A3228] hover:text-[#FF7F50] transition duration-300">
                                    <Instagram size={24} />
                                    <span className="sr-only">Instagram</span>
                                </a>
                                <a href="#" className="text-[#4A3228] hover:text-[#FF7F50] transition duration-300">
                                    <Twitter size={24} />
                                    <span className="sr-only">Twitter</span>
                                </a>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
                            <ul className="space-y-2">
                                {['Trang chủ', 'Sản phẩm', 'Thương hiệu', 'Liên hệ', 'Chính sách bảo mật', 'Điều khoản sử dụng'].map((item) => (
                                    <li key={item}>
                                        <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="hover:text-[#FF7F50] transition duration-300">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                            <ul className="space-y-2">
                                <li className="flex items-center">
                                    <MapPin size={18} className="mr-2 text-[#FF7F50]" />
                                    <span>140 Lê Trọng Tấn, Tây Thạnh, Quận Tân Phú, TP.HCM</span>
                                </li>
                                <li className="flex items-center">
                                    <Phone size={18} className="mr-2 text-[#FF7F50]" />
                                    <span className="hover:text-[#FF7F50] transition duration-300">
                                        (84) 123 456 789
                                    </span>
                                </li>
                                <li className="flex items-center">
                                    <Mail size={18} className="mr-2 text-[#FF7F50]" />
                                    <span className="hover:text-[#FF7F50] transition duration-300">
                                        info@pharmacy.com
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-8 pt-8 border-t border-[#4A3228] border-opacity-20 text-sm text-center">
                        <p>&copy; {new Date().getFullYear()} Phamarcy. Tất cả các quyền được bảo lưu.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default LayoutUser;