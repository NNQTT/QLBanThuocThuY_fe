import axios from 'axios';
import React, {useEffect, useState } from 'react';
import banner from '../../assets/banner.jpg'
  
function Home() {
      const [listProduct, setListProduct] = useState([]);
      const [visibleCount, setVisibleCount] = useState(8);

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
      return (
        <div className="flex min-h-screen flex-col">
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
                <div key={product.MaThuoc} className="overflow-hidden rounded-lg border shadow-sm">
                  <div className="relative">
                    <img
                      src={product.AnhDaiDien}
                      alt={product.TenThuoc}
                      className="h-[200px] w-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="mb-2 line-clamp-2 min-h-[3rem] text-sm font-semibold">
                      {product.TenThuoc}
                    </h3>
                    <div className="flex items-baseline justify-between">
                      <div>
                        <span className="text-lg font-bold text-orange-500">
                          {product.GiaBan.toLocaleString()}đ
                        </span>
                      </div>
                    </div>
                    <a href="#">
                        <button className="mt-4 w-full rounded-md bg-orange-500 py-2 text-sm font-semibold text-white hover:bg-orange-600">
                            CHỌN MUA
                        </button>
                    </a>                    
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 flex justify-center">
                <a href="#" className="inline-block">
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