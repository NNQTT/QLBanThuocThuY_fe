import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Filter, RefreshCcw, ChevronDown, History } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';

const Admin = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [productsPerPage] = useState(10)
    const [sortColumn, setSortColumn] = useState('MaThuoc')
    const [sortDirection, setSortDirection] = useState('asc')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/admin/getthuoc')
                console.log("Products fetched:", response.data)
                setProducts(response.data)
            } catch (error) {
                console.error("Error fetching products data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    const filteredAndSortedProducts = products
        .filter(product =>
            product.MaThuoc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.TenThuoc.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredAndSortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    const paginate = (pageNumber) => setCurrentPage(pageNumber)

    const handleSort = (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
        } else {
            setSortColumn(column)
            setSortDirection('asc')
        }
    }

    const statusColors = {
        'Còn hàng': 'bg-green-100 text-green-800 border-green-300',
        'Sắp hết hàng': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'Tạm hết hàng': 'bg-red-100 text-red-800 border-red-300',
    }

    const handleEdit = (maThuoc) => {
        console.log("MaThuoc being passed:", maThuoc);
        if (!maThuoc) {
            console.error("MaThuoc is undefined");
            return;
        }
        const url = `/admin/detailproduct/${maThuoc}`;
        console.log("Navigating to:", url);
        navigate(url);
    };

    if (loading) {
        return <div className="text-center py-4">Loading...</div>
    }

    return (
        <div className="bg-white mx-10 overflow-hidden transition-all duration-300 ease-in-out">
            <div className="p-8 flex flex-col sm:flex-row justify-between items-center border-b border-gray-200">
                <h3 className="text-3xl font-bold text-[#22223B] md:mb-0">Danh sách thuốc</h3>
                <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm thuốc..."
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
                            {['MaThuoc', 'TenThuoc', 'GiaBan', 'SoLuong', 'TrangThai'].map((column) => (
                                <th
                                    key={column}
                                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#FFD6BA] transition-colors duration-200"
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center">
                                        {column === 'MaThuoc' ? 'Mã thuốc' :
                                            column === 'TenThuoc' ? 'Tên thuốc' :
                                                column === 'GiaBan' ? 'Giá bán' :
                                                    column === 'SoLuong' ? 'Số lượng' : 'Trạng thái'}
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
                        {currentProducts.map((product) => (
                            <tr key={product.MaThuoc} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#22223B]">{product.MaThuoc}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{product.TenThuoc}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{product.GiaBan}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{product.SoLuong}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColors[product.TrangThai]}`}>
                                        {product.TrangThai}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button 
                                            onClick={() => handleEdit(product.MaThuoc)}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit size={20} />
                                        </button>
                                        <button 
                                            onClick={() => navigate(`/admin/lichsuthuoc/${product.MaThuoc}`)}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <History size={20} />
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
                        disabled={indexOfLastProduct >= filteredAndSortedProducts.length}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                        Sau
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <p className="text-sm text-gray-700">
                        Hiển thị <span className="font-medium">{indexOfFirstProduct + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastProduct, filteredAndSortedProducts.length)}</span> trong số <span className="font-medium">{filteredAndSortedProducts.length}</span> sản phẩm
                    </p>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastProduct >= filteredAndSortedProducts.length}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default Admin
