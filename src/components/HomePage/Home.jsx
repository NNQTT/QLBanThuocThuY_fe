import axios from 'axios';
import React, { useEffect, useState } from 'react';
import banner from '../../assets/banner.jpg'
import { FaHome } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function Home() {
  const [listProduct, setListProduct] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
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

      {/* Hero Banner */}
      <section className="relative w-full">
        <div className="relative h-[500px] w-full">
          <img
            src={banner}
            alt="banner"
            className="h-full w-full object-contain"
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold">SẢN PHẨM</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {listProduct.slice(0, visibleCount).map((product) => (
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
                <a href='#'>
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
        <div className="mt-12 flex justify-center">
          <a href="/listproduct" className="inline-block">
            <button className="rounded-md border-2 border-orange-500 bg-white px-6 py-3 text-base font-semibold text-orange-500 hover:bg-orange-50 transition duration-300 ease-in-out transform hover:scale-105">
              Xem thêm sản phẩm
            </button>
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;