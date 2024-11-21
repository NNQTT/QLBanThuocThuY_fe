import React, { useEffect, useState } from 'react';
import { CiFilter } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

const ListProduct = ({ searchResults, setSearchResults, searchTerm }) => {
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [listProduct, setListProduct] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupName, setGroupName] = useState('');
  const pageSize = 12;

  const navItems = [
    { name: 'CHẾ PHẨM SINH HỌC', group: 'N1' },
    { name: 'DƯỢC PHẨM', group: 'N2' },
    { name: 'VACCINE', group: 'N3' },
    { name: 'HÓA CHẤT THÚ Y', group: 'N4' },
    { name: 'VI SINH VẬT', group: 'N5' },
  ];

  const priceRanges = [
    { id: "under-20", label: "Dưới 20.000đ", value: "19000" },
    { id: "20-50", label: "20.000đ - 50.000đ", value: "21000" },
    { id: "50-100", label: "50.000đ - 100.000đ", value: "51000" },
    { id: "100-200", label: "100.000đ - 200.000đ", value: "101000" },
    { id: "over-200", label: "Trên 200.000đ", value: "201000" },
  ]

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupFromUrl = params.get('group');
    if (groupFromUrl) {
      setGroupName(groupFromUrl);
    }
  }, [location]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Current states:", { priceFilter, groupName });
        if (priceFilter !== '') {
          const params = {
            price: priceFilter,
            page: currentPage,
            pagesize: pageSize,
          };
          if (groupName) {
            params.groupName = groupName;
          }
          const response = await axios.get(
            'http://localhost:3000/product/getproductsfilterdbyprice',
            { params }
          );
          setListProduct(response.data.products);
          setTotalPages(Math.ceil(response.data.totalProducts / parseInt(pageSize)));
        }
        else if (sortBy !== 'default') {
          const params = {
            sort: sortBy,
            page: currentPage,
            pagesize: pageSize,
          };
          if (groupName) {
            params.groupName = groupName;
          }
          const response = await axios.get(
            'http://localhost:3000/product/getproductssortedbyprice',
            { params }
          );
          setListProduct(response.data.products);
          setTotalPages(Math.ceil(response.data.totalProducts / parseInt(pageSize)));
        } else if (groupName) {
          const response = await axios.get('http://localhost:3000/product/getproductsbygroup', {
            params: { 
              groupName: groupName,
              page: currentPage,
              pagesize: pageSize,
            }
          });
          setListProduct(response.data.products);
          setTotalPages(Math.ceil(response.data.totalProducts / parseInt(pageSize)));
        } else {
          const response = await axios.get('http://localhost:3000/product/getproducts', {
            params: {
              page: currentPage,
              pagesize: pageSize,
            }
          });
          setListProduct(response.data.products);
          setTotalPages(Math.ceil(response.data.totalProducts / parseInt(pageSize)));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchProducts();
  }, [groupName, searchResults, currentPage, sortBy, priceFilter]);

  const handleProductClick = (productId) => {
    navigate(`/productdetail/${productId}`);
  };

  const handleGroupClick = (group) => {
    setPriceFilter('');
    setSortBy('default');
    setGroupName(group);
    setSearchResults([]);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    const newSortValue = e.target.value;
    setSortBy(newSortValue);
    setPriceFilter('');
    setCurrentPage(1);
    console.log("Current groupName and sort:", groupName, sortBy);
  };

  const handlePriceFilter = (e) => {
    const newPriceValue = e.target.value;
    setPriceFilter(newPriceValue);
    setSortBy('default');
    setCurrentPage(1);
    console.log("Current groupName and price:", groupName, priceFilter);
  };

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
        setPriceFilter('');
        setSortBy('default');
        setGroupName('');
        setCurrentPage(1);
    }
  }, [searchResults]);

  console.log("group: ", groupName);

  console.log('search on list product:', searchResults)
  const displayProducts = searchResults?.length > 0 ? searchResults : listProduct;

  const groupTitleMap = {
    N1: "CHẾ PHẨM SINH HỌC",
    N2: "DƯỢC PHẨM",
    N3: "VACCINE",
    N4: "HÓA CHẤT THÚ Y",
    N5: "VI SINH VẬT",
  };

  const currentGroupTitle = groupTitleMap[groupName] || 'Thuốc Thú Y';



  return (
    <div className="container mx-auto px-4 py-8">
      {/* Navigation */}
      <nav className="mb-6 ">
        <ul className="flex flex-wrap items-center gap-6 justify-center">
          <li>
            <a href="/" className="inline-block p-2 hover:text-red-600">
              {<FaHome size={24} />}

            </a>
          </li>
          {navItems.map((item) => (
            <li key={item.id} className={`border rounded-md px-8 text-center flex-1 ${groupName === item.group && !searchResults.length ? 'bg-orange-500 text-white' : 'hover:border-red-600'}`}>
              <a
                href="#"
                onClick={() => handleGroupClick(item.group)}
                className={`inline-block px-4 py-2 text-sm ${groupName === item.group && !searchResults.length ? 'text-white' : 'hover:text-red-600'} transition-colors`}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Breadcrumb */}
      {searchResults.length === 0 ? (
        <div className="flex items-center text-sm mb-6">
          <a href="/" className="text-gray-600 hover:text-red-600">
            Trang chủ
          </a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900">{currentGroupTitle}</span>
        </div>
      ) : null}

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        {searchResults?.length > 0 ? (
          <div>
            <span className="text-2xl text-gray-900">
              Kết quả tìm kiếm cho <strong>"{searchTerm}"</strong>
            </span>
            <span className="ml-2 text-gray-600">
              ({searchResults.length} sản phẩm)
            </span>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900">{currentGroupTitle}</h1>

            <div className="flex flex-wrap items-center gap-4">
              {/* Filter Button */}
              <div className="flex items-center gap-2 px-4 py-2 text-sm">
                {<CiFilter size={24} />}
                BỘ LỌC
              </div>

              {/* Price Filter */}
              <div className="relative">
                <select
                  value={priceFilter}
                  onChange={handlePriceFilter}
                  className="appearance-none w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md pr-8 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Lọc giá</option>
                  {priceRanges.map((range) => (
                    <option key={range.id} value={range.value}>
                      {range.label}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="appearance-none w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md pr-8 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="default">Sắp xếp</option>
                  <option value="1">Giá tăng dần</option>
                  <option value="-1">Giá giảm dần</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map(product => (
          <div key={product.MaThuoc} className="border rounded-lg overflow-hidden group flex flex-col" onClick={() => handleProductClick(product.MaThuoc)}>
            <div className="relative">
              <img
                src={`${import.meta.env.BASE_URL}src/assets/uploads/${product.MaThuoc}/${product.AnhDaiDien}`}
                alt={product.TenThuoc}
                className="w-full h-64 object-cover"
              />
              {product.TrangThai === "Tạm hết hàng" && (
                <span className="absolute top-2 right-2 bg-gray-800 text-white px-2 py-1 text-sm rounded">
                  Tạm hết hàng
                </span>
              )}
            </div>
            <div className="p-4 flex flex-col flex-1 justify-between">
              <a href='#'>
                <h3 className="text-lg font-medium mb-2 line-clamp-2 group-hover:text-red-600">
                  {product.TenThuoc}
                </h3>
              </a>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold">{product.GiaBan.toLocaleString()}₫</span>
              </div>
              {product.TrangThai === "Còn hàng" ? (
                <button className="mt-4 w-full rounded-md bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                  CHỌN MUA
                </button>
              ) : (
                <button className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
                  TẠM HẾT HÀNG
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {!searchResults?.length && (
        <div className="flex justify-center items-center mt-8 space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            &laquo;
          </button>
          {Array.from({ length: totalPages }, (_, index) => {
            const page = index + 1;
            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-md ${currentPage === page ? 'bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600'
                  }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-orange-500 rounded-md hover:bg-orange-600 disabled:opacity-50"
          >
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default ListProduct;