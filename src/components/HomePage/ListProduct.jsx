import React, { useEffect, useState } from 'react';
import { CiFilter } from "react-icons/ci";
import { FaHome } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ListProduct = () => {
  const [priceFilter, setPriceFilter] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [listProduct, setListProduct] = useState([]);
  const navigate = useNavigate();


  const navItems = [
    { name: 'MUA ĐỒ CHO CHÓ', href: '#' },
    { name: 'MUA ĐỒ CHO MÈO', href: '#' },
    { name: 'PETTAG MOZZI', href: '#' },
    { name: 'DỊCH VỤ SPA', href: '#' },
    { name: 'KHUYẾN MÃI', href: '#' },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/product/getproducts');
        setListProduct(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (productId) => {
    navigate(`/productdetail/${productId}`);
  };

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
            <li key={item.id} className='border border-gray-300 rounded-md px-8 hover:border-red-600 text-center flex-1'>
              <a
                href={item.href}
                className="inline-block px-4 py-2 text-sm hover:text-red-600 transition-colors"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-6">
        <a href="/" className="text-gray-600 hover:text-red-600">
          Trang chủ
        </a>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-900">Thuốc Thú Y</span>
      </div>

      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Thuốc Thú Y</h1>

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
              onChange={(e) => setPriceFilter(e.target.value)}
              className="appearance-none w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md pr-8 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Lọc giá</option>
              <option value="low">Giá thấp đến cao</option>
              <option value="high">Giá cao đến thấp</option>
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
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md pr-8 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="default">Sắp xếp</option>
              <option value="price-asc">Giá tăng dần</option>
              <option value="price-desc">Giá giảm dần</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listProduct.map(product => (
          <div key={product.MaThuoc} className="border rounded-lg overflow-hidden group flex flex-col" onClick={() => handleProductClick(product.MaThuoc)}>
            <div className="relative">
              <img
                src={product.AnhDaiDien}
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
              <a href = '#'>
                <h3 className="text-sm font-medium mb-2 line-clamp-2 group-hover:text-red-600">
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
    </div>
  );
};

export default ListProduct;