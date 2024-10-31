import React, { useEffect, useState } from 'react';
import { Package, PlusCircle, ShoppingCart, ChevronRight, Menu, LogOut } from 'lucide-react'
import { Outlet, useNavigate } from 'react-router-dom';

const LayoutAdmin = () => {
    const [isOpen, setIsOpen] = useState(true)
    const [activeItem, setActiveItem] = useState('Xem tất cả sản phẩm')

    const menuItems = [
        { icon: Package, text: 'Xem tất cả sản phẩm' },
        { icon: PlusCircle, text: 'Thêm sản phẩm mới' },
        { icon: ShoppingCart, text: 'Quản lý đơn hàng' },
    ]

    const navigate = useNavigate();

    useEffect(() => {
        const islogin = localStorage.getItem('isLogin');
        if (islogin !== 'true')
            navigate('/adminlogin');
        else
            navigate('/admin');
    }, []);
    
    return (
        <div>
            <div className="flex h-screen bg-gray-50">
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
                                    <a
                                        href="#"
                                        onClick={() => setActiveItem(item.text)}
                                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${activeItem === item.text
                                            ? 'bg-[#E76F51] text-white shadow-md'
                                            : 'text-[#4A4E69] hover:bg-[#F4A261] hover:text-[#22223B]'
                                            }`}
                                    >
                                        <item.icon size={20} className={`mr-4 ${isOpen ? '' : 'mx-auto'}`} />
                                        {isOpen && <span>{item.text}</span>}
                                    </a>
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
                                <p className="font-semibold text-sm text-[#22223B]">John Doe</p>
                                <p className="text-xs text-[#4A4E69]">Admin</p>
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
                <main className="flex-grow p-8 bg-white">
                    <h2 className="text-3xl font-bold mb-6 text-[#22223B]">{activeItem}</h2>
                    <div className="bg-[#FFE5D9] p-6 rounded-lg shadow-md">
                        <p className="text-[#4A4E69]"><Outlet /></p>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default LayoutAdmin;