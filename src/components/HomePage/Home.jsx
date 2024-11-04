import React, { useState, useEffect } from 'react';

function Home() {
  const products = [
    { name: "Pate cho chó mèo King's Pet Lon 380gr", price: 44100, originalPrice: 88200 },
    { name: "Snack cho chó Thịt gà vị sữa mềm Natural Core", price: 37500, originalPrice: 75000 },
    { name: "Pate cho mèo Ciao Gói 40gr", price: 9000, originalPrice: 18000 },
    { name: "Pate cho chó mèo RawStew Absolute Holistic Lon 80gr", price: 14500, originalPrice: 29000 },
  ];

  return (
    <div className="w-full">
      {/* Hero Image Section */}
      <section className="relative w-full h-[400px] bg-[#FFF5F5]">
        <img
          src="/placeholder.svg?height=400&width=800"
          alt="Hero Image"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold">Mua 4 tặng 1</h2>
            <p className="mt-2 text-2xl">phiếu ưu đãi tháng</p>
            <p className="mt-1 text-xl">dành cho chó mèo</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-center text-2xl font-bold text-[#795548]">
            SẢN PHẨM ĐANG KHUYẾN MÃI
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=200&width=200"
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold mb-2">{product.name}</h3>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-red-500">{product.price.toLocaleString()}đ</span>
                    <span className="text-sm text-gray-500 line-through">{product.originalPrice.toLocaleString()}đ</span>
                  </div>
                  <button className="mt-4 w-full bg-[#795548] hover:bg-[#6D4C41] text-white py-2 rounded">
                    CHỌN MUA
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;