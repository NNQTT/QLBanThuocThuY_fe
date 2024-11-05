'use client'

import { useEffect, useState } from 'react'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import axios from 'axios'

export default function Cart() {

    const [cart, setCart] = useState([])
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

    useEffect(() => {
        const getCart = async () => {
            if (userInfo) {
                const res = await axios.get(`http://localhost:3000/cart/${userInfo.tentaikhoan}`)
                console.log(res.data)
                setCart(res.data)
            }
            else {
                let cart = sessionStorage.getItem('cart')
                if (cart) {
                    setCart(JSON.parse(cart))
                }
                else {
                    setCart([])
                }
            }
        }

        getCart()
    },[])

    const removeItem = async (item) => {
        if (userInfo) {
            await axios.delete(`http://localhost:3000/cart/${userInfo.tentaikhoan}/${item.MaThuoc}`)
        }
        else {
            sessionStorage.setItem('cart', JSON.stringify(copyCart))
        }
        const copyCart = cart.filter(i => i.MaThuoc !== item.MaThuoc)
        setCart(copyCart)
    }

    const incrementQuantity = async (item) => {
        const copyCart = [...cart]
        const index = copyCart.findIndex(i => i.MaThuoc === item.MaThuoc)
        copyCart[index].SoLuong++
        copyCart[index].ThanhTien = copyCart[index].SoLuong * copyCart[index].GiaBan
        setCart(copyCart)
        if (userInfo) {
            await axios.patch(`http://localhost:3000/cart/${userInfo.tentaikhoan}/${item.MaThuoc}`, { quantity: copyCart[index].SoLuong })
        }
        else {
            sessionStorage.setItem('cart', JSON.stringify(copyCart))
        }
    };

    const decrementQuantity = async (item) => {
        const copyCart = [...cart]
        const index = copyCart.findIndex(i => i.MaThuoc === item.MaThuoc)
        console.log(copyCart[index].SoLuong)
        if (copyCart[index].SoLuong > 1) {
            copyCart[index].SoLuong--
            copyCart[index].ThanhTien = copyCart[index].SoLuong * copyCart[index].GiaBan
            setCart(copyCart)
            if (userInfo) {
                await axios.patch(`http://localhost:3000/cart/${userInfo.tentaikhoan}/${item.MaThuoc}`, { quantity: copyCart[index].SoLuong })
            }
            else {
                sessionStorage.setItem('cart', JSON.stringify(copyCart))
            }
        }
    }

    return (
        <>
            <div className="mx-12 md:p-12 font-sans my-5">
                <h1 className="text-3xl font-semibold mb-4 md:px-12">Giỏ hàng của bạn</h1>
                <p className="mb-4 text-lg md:px-12">Bạn đang có {cart.length} sản phẩm trong giỏ hàng</p>

                <div className="grid md:grid-cols-6 gap-6 items-start md:px-12">
                    <div className='md:col-span-4'>
                        {
                            cart.map((item, index) => {
                                return (
                                    <div className="bg-white p-4 rounded-lg shadow mb-6" key={item.MaThuoc}>
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <img
                                                    src="https://via.placeholder.com/100"
                                                    alt={item.TenThuoc}
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <button
                                                    onClick={() => removeItem(item)}
                                                    className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                                    aria-label="Remove item"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="flex-1">
                                                <h2 className="font-medium text-xl mb-1">
                                                    {item.TenThuoc}
                                                </h2>
                                                <p className="text-sm text-gray-500 mb-2">{item.DangBaoChe} - {item.QCDongGoi}</p>
                                                <p className="font-semibold text-lg">{item.ThanhTien}₫</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <button
                                                onClick={() => decrementQuantity(item)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                                            >
                                                <MinusIcon className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.SoLuong}</span>
                                            <button
                                                onClick={() => incrementQuantity(item)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                                            >
                                                <PlusIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow col-span-2">
                        <h2 className="font-semibold mb-4 text-2xl">Thông tin đơn hàng</h2>
                        <hr className="my-5 h-0.5 border-t-1 bg-neutral-100 dark:bg-white/10" />
                        <div className="flex justify-between mb-4">
                            <span className='text-xl font-bold'>Tổng tiền:</span>
                            <span className="font-bold text-red-600 text-2xl relative">{
                                cart.reduce((acc, item) => acc + item.ThanhTien, 0)
                            }<span className='text-lg absolute' style={{ top: -1 }}>₫</span></span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 mb-4">
                            <li>• Miễn phí vận chuyển cho đơn hàng từ 399.000₫ (Dưới 10km từ 140 Lê Trọng Tấn)</li>
                            <li>• Giao hàng hỏa tốc trong vòng 4 giờ, áp dụng tại khu vực nội thành Hồ Chí Minh</li>
                        </ul>
                        <hr className="my-5 h-0.5 border-t-1 bg-neutral-100 dark:bg-white/10" />
                        <button className="w-full bg-[#FF9A76] text-[#2C1A12] py-2 rounded transition-all 
        duration-300 
        ease-in-out
        hover:opacity-90 
        hover:scale-105 
        transform
        focus:outline-none 
        focus:ring-2 
        focus:ring-[#FF9A76] 
        focus:ring-opacity-50"
                        >
                            THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}