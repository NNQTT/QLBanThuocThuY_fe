import React, { useEffect, useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Filter, RefreshCcw, ChevronDown, X, Calendar, Package, DollarSign, Tag, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const OrderList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6);
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [orders, setOrders] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:3000/order/getOrders');
                console.log(response.data);
                setOrders(response.data);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            }
        };

        fetchOrders();
    }, []);

    const filteredAndSortedOrders = orders
        .filter(order => typeof order.MaDonHang === 'number' && order.MaDonHang.toString().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            if (sortColumn === 'id') {
                return sortDirection === 'desc' ? a.MaDonHang - b.MaDonHang : b.MaDonHang - a.MaDonHang;
            }
            // Thêm điều kiện sắp xếp cho các cột khác nếu cần
            return 0;
        });

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = filteredAndSortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const statusColors = {
        'Đã thanh toán': 'bg-green-100 text-green-800 border-green-300',
        'Đang xử lý': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Đã hủy': 'bg-red-100 text-red-800 border-red-300',
        'Đang vận chuyển': 'bg-indigo-100 text-indigo-800 border-indigo-300',
        'Đang chuẩn bị': 'bg-pink-100 text-pink-800 border-pink-300',
        'Đã hoàn tiền': 'bg-purple-100 text-purple-800 border-purple-300',
    };

    const handleViewDetails = async (order) => {
        try {
            const response = await axios.get(`http://localhost:3000/order/getOrderDetails/${order.MaDonHang}`);
            setSelectedOrder({ ...order, products: response.data });
            setIsModalOpen(true);
            setIsEditing(false);
        } catch (error) {
            console.error('Lỗi khi lấy chi tiết đơn hàng:', error);
        }
    };

    const handleEditOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
        setIsEditing(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
        setIsEditing(false);
    };

    const handleSaveChanges = async (updatedOrder) => {
        try {
            await axios.put(`http://localhost:3000/order/updateOrder/${updatedOrder.MaDonHang}`, updatedOrder);
            const updatedOrders = orders.map(order =>
                order.MaDonHang === updatedOrder.MaDonHang ? updatedOrder : order
            );
            setOrders(updatedOrders);
            closeModal();
        } catch (error) {
            console.error('Lỗi khi cập nhật đơn hàng:', error);
        }
    };

    const canEditOrder = (status) => {
        return status !== 'Đã hủy' && status !== 'Đã hoàn tiền';
    };

    const OrderDetailsModal = ({ order, onClose, isEditing, onSave }) => {
        if (!order) return null;

        const [editedOrder, setEditedOrder] = useState(order);

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setEditedOrder(prev => ({ ...prev, [name]: value }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            onSave(editedOrder);
        };

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#22223B]">{isEditing ? 'Chỉnh sửa đơn hàng' : 'Chi tiết đơn hàng'}</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <Package className="w-6 h-6 text-[#FF7F50]" />
                                    <div>
                                        <p className="text-sm text-gray-500">Mã đơn hàng</p>
                                        <p className="font-semibold text-gray-800">{order.MaDonHang}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <Tag className="w-6 h-6 text-[#FF7F50]" />
                                    <div>
                                        <p className="text-sm text-gray-500">Trạng thái</p>
                                        {isEditing ? (
                                            <select
                                                name="TrangThaiHD"
                                                value={editedOrder.TrangThaiHD}
                                                onChange={handleInputChange}
                                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            >
                                                <option value="Đang xử lý">Đang xử lý</option>
                                                <option value="Đang vận chuyển">Đang vận chuyển</option>
                                                <option value="Đã thanh toán">Đã thanh toán</option>
                                                <option value="Đã hủy">Đã hủy</option>
                                                <option value="Đã hoàn tiền">Đã hoàn tiền</option>
                                                <option value="Đang chuẩn bị">Đang chuẩn bị</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[order.TrangThaiHD] || 'bg-gray-100 text-gray-800'}`}>
                                                {order.TrangThaiHD || 'Không xác định'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <Calendar className="w-6 h-6 text-[#FF7F50]" />
                                    <div>
                                        <p className="text-sm text-gray-500">Ngày lập</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.NgayLap ? new Date(order.NgayLap).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Không có dữ liệu'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-[#FF7F50]" />
                                    <div>
                                        <p className="text-sm text-gray-500">Tổng tiền</p>
                                        <p className="font-semibold text-gray-800">
                                            {order.TongTien ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TongTien) : 'Không có dữ liệu'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                <Phone className="w-6 h-6 text-[#FF7F50]" />
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-500">Số điện thoại</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="DienThoai"
                                            value={editedOrder.DienThoai}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-800">{order.DienThoai}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                                <MapPin className="w-6 h-6 text-[#FF7F50]" />
                                <div className="flex-grow">
                                    <p className="text-sm text-gray-500">Địa chỉ</p>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="DiaChi"
                                            value={editedOrder.DiaChi}
                                            onChange={handleInputChange}
                                            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        />
                                    ) : (
                                        <p className="font-semibold text-gray-800">{order.DiaChi}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        {order.products && order.products.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh sách sản phẩm</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tên thuốc
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Số lượng
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.products.map((product, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-150">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{product.TenThuoc}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">{product.SoLuong}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-500">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.ThanhTien)}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <div className="text-sm font-medium text-gray-900">
                                        Tổng cộng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.products.reduce((sum, product) => sum + product.ThanhTien, 0))}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="mt-8 flex justify-end space-x-4">
                            {isEditing && (
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                >
                                    Lưu thay đổi
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                            >
                                {isEditing ? 'Hủy' : 'Đóng'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="bg-white mx-10 overflow-hidden transition-all duration-300 ease-in-out">
                <div className="p-8 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
                    <h3 className="text-3xl font-bold text-[#22223B] md:mb-0">Danh sách đơn hàng</h3>
                    <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm đơn hàng..."
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border-2 border-[#E76F51] rounded-full focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:border-transparent transition-all duration-300 ease-in-out text-[#4A4E69]"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-[#E76F51]" />
                        </div>
                        <div className="flex space-x-2">
                            <button className="p-2 bg-[#F4A261] text-white rounded-full hover:bg-[#E76F51] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:ring-opacity-50 transform hover:scale-105">
                                <Filter size={20} />
                            </button>
                            <button className="p-2 bg-[#F4A261] text-white rounded-full hover:bg-[#E76F51] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#E76F51] focus:ring-opacity-50 transform hover:scale-105">
                                <RefreshCcw size={20} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FFE5D9] text-[#4A4E69]">
                            <tr>
                                {['id', 'date', 'total', 'status'].map((column) => (
                                    <th
                                        key={column}
                                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#FFD6BA] transition-colors duration-200"
                                        onClick={() => handleSort(column)}
                                    >
                                        <div className="flex items-center">
                                            {column === 'id' ? 'Mã đơn hàng' :
                                                column === 'date' ? 'Ngày đặt hàng' :
                                                    column === 'total' ? 'Tổng tiền' : 'Trạng thái'}
                                            <ChevronDown
                                                size={16}
                                                className={`ml-1 transform transition-transform duration-200 ${sortColumn === column && sortDirection === 'desc' ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                    </th>
                                ))}
                                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.map((order) => (
                                <tr key={order.MaDonHang} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#22223B]">{order.MaDonHang}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">
                                        {order.NgayLap ? new Date(order.NgayLap).toLocaleDateString('vi-VN', { year: 'numeric', month: 'numeric', day: 'numeric' }) : 'Không có dữ liệu'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">
                                        {order.TongTien ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.TongTien) : 'Không có dữ liệu'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColors[order.TrangThaiHD]}`}>
                                            {order.TrangThaiHD}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(order)}
                                                className="text-blue-600 hover:text-blue-900 transition-colors duration-200 transform hover:scale-110"
                                                title="Xem chi tiết"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            {canEditOrder(order.TrangThaiHD) && (
                                                <button
                                                    onClick={() => handleEditOrder(order)}
                                                    className="text-green-600 hover:text-green-900 transition-colors duration-200 transform hover:scale-110"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-white px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            Trước
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastOrder >= filteredAndSortedOrders.length}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            Sau
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                Hiển thị <span className="font-medium">{indexOfFirstOrder + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastOrder, filteredAndSortedOrders.length)}</span> trong số{' '}
                                <span className="font-medium">{filteredAndSortedOrders.length}</span> đơn hàng
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <span className="sr-only">Trang trước</span>
                                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                                </button>
                                {[...Array(Math.ceil(filteredAndSortedOrders.length / ordersPerPage)).keys()].map((number) => (
                                    <button
                                        key={number + 1}
                                        onClick={() => paginate(number + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number + 1
                                            ? 'z-10 bg-[#E76F51] border-[#E76F51] text-white'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            } transition-colors duration-200`}
                                    >
                                        {number + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={indexOfLastOrder >= filteredAndSortedOrders.length}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <span className="sr-only">Trang sau</span>
                                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={closeModal}
                    isEditing={isEditing && canEditOrder(selectedOrder.TrangThaiHD)}
                    onSave={handleSaveChanges}
                />
            )}
        </>
    );
};

export default OrderList;