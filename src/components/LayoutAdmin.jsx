import React, { useEffect, useState } from 'react';
import { Package, PlusCircle, ShoppingCart, ChevronRight, Menu, LogOut } from 'lucide-react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LayoutAdmin = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [activeItem, setActiveItem] = useState('Xem tất cả sản phẩm')

    const [infoadmin, setinfoadmin] = useState(null);

    const menuItems = [
        { icon: Package, text: 'Xem tất cả sản phẩm', path: '/admin' },
        { icon: PlusCircle, text: 'Thêm sản phẩm mới', path: '/admin/addproduct' },
        { icon: ShoppingCart, text: 'Quản lý đơn hàng', path: '/admin/orderlist' },
    ]

    const navigate = useNavigate();

    useEffect(() => async () => {
        const authenticateAdmin = async () => {
            const token = localStorage.getItem('accessToken');
            try {
                const res = await axios.get('http://localhost:3000/api/authenticationLogin', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                console.log(res);
                if (res.status === 200) {
                    console.log('Login successfully');
                    setinfoadmin(res.data.data);
                    navigate('/admin');
                }
            } catch (error) {
                console.error(error);
                if (error.response && error.response.status === 400) {
                    console.log('Login failed');
                    navigate('/adminlogin');
                }
            }
        };

        authenticateAdmin();

        if(!localStorage.getItem('accessToken')) {
            navigate('/adminlogin');
        }
    }, []);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`bg-[#FFE5D9] text-[#4A4E69] ${isOpen ? 'w-64' : 'w-20'
                    } transition-all duration-300 ease-in-out flex flex-col shadow-lg`}
            >
                {/* Logo and toggle button */}
                <div className="flex items-center justify-between p-4 border-b border-[#F4A261]">
                    {isOpen && <h1 className="text-2xl font-bold text-[#22223B]">Dashboard</h1>}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-full hover:bg-[#F4A261] focus:outline-none focus:ring-2 focus:ring-[#E76F51] transition-colors duration-200 text-[#22223B]"
                        aria-label={isOpen ? 'Thu gọn sidebar' : 'Mở rộng sidebar'}
                    >
                        {isOpen ? <ChevronRight size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Menu items */}
                <nav className="flex-grow">
                    <ul className="space-y-2 py-4">
                        {menuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    onClick={() => setActiveItem(item.text)}
                                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeItem === item.text
                                        ? 'bg-[#E76F51] text-white shadow-md'
                                        : 'text-[#4A4E69] hover:bg-[#F4A261] hover:text-[#22223B]'
                                        }`}
                                >
                                    <item.icon size={20} className={`mr-4 ${isOpen ? '' : 'mx-auto'}`} />
                                    {isOpen && <span>{item.text}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                {/* User profile */}
                <div className="p-4 border-t border-[#F4A261] flex items-center">
                    <img
                        src="/placeholder.svg?height=40&width=40"
                        alt="User avatar"
                        className="w-10 h-10 rounded-full mr-3 border-2 border-[#E76F51] shadow-md"
                    />
                    {isOpen && (
                        <div className="flex-grow">
                            <p className="text-xs text-[#4A4E69]">{infoadmin?.tentaikhoan}</p>
                        </div>
                    )}
                    {isOpen && (
                        <button
                            className="p-2 rounded-full hover:bg-[#F4A261] focus:outline-none focus:ring-2 focus:ring-[#E76F51] transition-colors duration-200 text-[#22223B]"
                            aria-label="Đăng xuất"
                        >
                            <LogOut size={20} />
                        </button>
                    )}
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default LayoutAdmin;