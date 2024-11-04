import React, { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Eye, Edit, Filter, RefreshCcw, ChevronDown } from 'lucide-react'

const Admin = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [medicinesPerPage] = useState(6)
    const [sortColumn, setSortColumn] = useState('code')
    const [sortDirection, setSortDirection] = useState('asc')

    const medicines = [
        { code: 'MED001', name: 'Paracetamol', price: '50,000 ₫', quantity: 100, status: 'Còn hàng' },
        { code: 'MED002', name: 'Amoxicillin', price: '75,000 ₫', quantity: 50, status: 'Còn hàng' },
        { code: 'MED003', name: 'Omeprazole', price: '100,000 ₫', quantity: 0, status: 'Tạm hết hàng' },
        { code: 'MED004', name: 'Lisinopril', price: '120,000 ₫', quantity: 75, status: 'Còn hàng' },
        { code: 'MED005', name: 'Metformin', price: '80,000 ₫', quantity: 25, status: 'Sắp hết hàng' },
        { code: 'MED006', name: 'Atorvastatin', price: '150,000 ₫', quantity: 60, status: 'Còn hàng' },
        { code: 'MED007', name: 'Amlodipine', price: '90,000 ₫', quantity: 40, status: 'Còn hàng' },
        { code: 'MED008', name: 'Metoprolol', price: '110,000 ₫', quantity: 0, status: 'Hết hàng' },
        { code: 'MED009', name: 'Gabapentin', price: '130,000 ₫', quantity: 30, status: 'Còn hàng' },
        { code: 'MED010', name: 'Sertraline', price: '140,000 ₫', quantity: 20, status: 'Sắp hết hàng' },
    ]

    // Filter and sort medicines
    const filteredAndSortedMedicines = medicines
        .filter(medicine =>
            medicine.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1
            return 0
        })

    // Pagination logic
    const indexOfLastMedicine = currentPage * medicinesPerPage
    const indexOfFirstMedicine = indexOfLastMedicine - medicinesPerPage
    const currentMedicines = filteredAndSortedMedicines.slice(indexOfFirstMedicine, indexOfLastMedicine)

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
                            {['code', 'name', 'price', 'quantity', 'status'].map((column) => (
                                <th
                                    key={column}
                                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider cursor-pointer hover:bg-[#FFD6BA] transition-colors duration-200"
                                    onClick={() => handleSort(column)}
                                >
                                    <div className="flex items-center">
                                        {column === 'code' ? 'Mã thuốc' :
                                            column === 'name' ? 'Tên thuốc' :
                                                column === 'price' ? 'Giá bán' :
                                                    column === 'quantity' ? 'Số lượng' : 'Trạng thái'}
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
                        {currentMedicines.map((medicine) => (
                            <tr key={medicine.code} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#22223B]">{medicine.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{medicine.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{medicine.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A4E69]">{medicine.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${statusColors[medicine.status]}`}>
                                        {medicine.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-900 transition-colors duration-200 transform hover:scale-110" title="Xem chi tiết">
                                            <Eye size={18} />
                                        </button>
                                        <button variant="ghost" size="sm" className="text-green-600 hover:text-green-900 transition-colors duration-200 transform hover:scale-110" title="Chỉnh sửa">
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
                        disabled={indexOfLastMedicine >= filteredAndSortedMedicines.length}
                        className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                    >
                        Sau
                    </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{indexOfFirstMedicine + 1}</span> đến <span className="font-medium">{Math.min(indexOfLastMedicine, filteredAndSortedMedicines.length)}</span> trong số{' '}
                            <span className="font-medium">{filteredAndSortedMedicines.length}</span> thuốc
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
                            {[...Array(Math.ceil(filteredAndSortedMedicines.length / medicinesPerPage)).keys()].map((number) => (
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
                                disabled={indexOfLastMedicine >= filteredAndSortedMedicines.length}
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
    )
}

export default Admin;