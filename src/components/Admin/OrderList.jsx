import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Trash2, Filter, RefreshCcw, ChevronDown } from 'lucide-react';

const OrderList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(6); // Changed from 10 to 8
    const [sortColumn, setSortColumn] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');

    // Mock data for orders
    const orders = [
        { id: '1001', customer: 'Nguyễn Văn A', date: '2023-06-01', total: '1,500,000 ₫', status: 'Đã giao hàng' },
        { id: '1002', customer: 'Trần Thị B', date: '2023-06-02', total: '2,300,000 ₫', status: 'Đang xử lý' },
        { id: '1003', customer: 'Lê Văn C', date: '2023-06-03', total: '800,000 ₫', status: 'Đã hủy' },
        { id: '1004', customer: 'Phạm Thị D', date: '2023-06-04', total: '3,200,000 ₫', status: 'Đang giao hàng' },
        { id: '1005', customer: 'Hoàng Văn E', date: '2023-06-05', total: '1,700,000 ₫', status: 'Đã giao hàng' },
        { id: '1006', customer: 'Vũ Thị F', date: '2023-06-06', total: '2,100,000 ₫', status: 'Đang xử lý' },
        { id: '1007', customer: 'Đặng Văn G', date: '2023-06-07', total: '1,900,000 ₫', status: 'Đã giao hàng' },
        { id: '1008', customer: 'Bùi Thị H', date: '2023-06-08', total: '2,800,000 ₫', status: 'Đang giao hàng' },
        { id: '1009', customer: 'Ngô Văn I', date: '2023-06-09', total: '1,200,000 ₫', status: 'Đã hủy' },
        { id: '1010', customer: 'Dương Thị K', date: '2023-06-10', total: '3,500,000 ₫', status: 'Đã giao hàng' },
    ];

    // Filter and sort orders
    const filteredAndSortedOrders = orders
        .filter(order =>
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    // Pagination logic
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
        'Đã giao hàng': 'bg-green-100 text-green-800 border-green-300',
        'Đang xử lý': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Đã hủy': 'bg-red-100 text-red-800 border-red-300',
        'Đang giao hàng': 'bg-blue-100 text-blue-800 border-blue-300',
    };

    return (
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
                            {['id', 'customer', 'date', 'total', 'status'].map((column) => (
                                <th
                                    key={column}
                                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#FFD6BA] transition-colors duration-200"
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center">
                                        {column === 'id' ? 'Mã đơn hàng' :
                                            column === 'customer' ? 'Khách hàng' :
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
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#22223B]">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{order.total}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColors[order.status]}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900 transition-colors duration-200 transform hover:scale-110" title="Xem chi tiết">
                                            <Eye size={18} />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900 transition-colors duration-200 transform hover:scale-110" title="Chỉnh sửa">
                                            <Edit size={18} />
                                        </button>
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
    );
};

export default OrderList;