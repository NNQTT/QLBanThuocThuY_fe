'use client'

import { useEffect, useState } from "react"
import axios from "axios"

export default function Checkout() {
    const [provinces, setProvinces] = useState([])
    const [selectedCity, setSelectedCity] = useState("")
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState("")
    const [wards, setWards] = useState([])
    const [selectedWard, setSelectedWard] = useState("")
    const [cart, setCart] = useState([])

    const host = "https://provinces.open-api.vn/api/";

    const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

    useEffect(() => {
        const getCart = async () => {
            console.log(userInfo)
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
    }, [])

    useEffect(() => {
        const fetchProvinces = async () => {
            const res = await axios.get(host + "?depth=1")
            console.log(res)
            setProvinces(res.data)
        }

        fetchProvinces()
    }, [])

    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedCity) {
                const res = await axios.get(host + "p/" + selectedCity + "?depth=2")
                console.log(res)
                setWards([])
                setSelectedWard("")
                setSelectedDistrict("")
                setDistricts(res.data.districts)
            }
            else {
                setDistricts([])
            }
        }

        fetchDistricts()
    }, [provinces, selectedCity])

    useEffect(() => {
        const fetchWards = async () => {
            if (selectedDistrict) {
                const res = await axios.get(host + "d/" + selectedDistrict + "?depth=2")
                console.log(res)
                setWards(res.data.wards)
            }
            else {
                setWards([])
            }
        }

        fetchWards()
    }, [districts, selectedDistrict])

    const subtotal = cart.reduce((acc, item) => acc + item.ThanhTien, 0)

    const shippingFee = selectedCity === "79" && subtotal < 399000 ? 25000 : 0

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Nhập họ và tên" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="example@email.com" />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="0xxx xxx xxx" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                <input type="text" id="address" name="address" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Số nhà, tên đường" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành</label>
                                    <select id="city" name="city" onChange={(e) => setSelectedCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                        <option value="">Chọn tỉnh/thành</option>
                                        {
                                            provinces?.map(province => (
                                                <option key={province.code} value={province.code}>{province.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
                                    <select id="district" name="district" onChange={(e) => setSelectedDistrict(e.target.value)} disabled={!selectedCity} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                        <option value="">Chọn quận/huyện</option>
                                        {
                                            districts?.map(district => (
                                                <option key={district.code} value={district.code}>{district.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                                    <select id="district" name="district" onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                        <option value="">Chọn quận/huyện</option>
                                        {
                                            wards?.map(ward => (
                                                <option key={ward.code} value={ward.code}>{ward.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {selectedCity === "79" && (
                        <>
                            <h3 className="font-medium mb-4">Phương thức vận chuyển</h3>
                            <div className="border rounded-lg p-4">
                                <div className="flex items-center justify-between space-x-2">
                                    <div className="flex items-center space-x-2">
                                        <input type="radio" id="shipping" name="shipping" className="rounded-full" defaultChecked />
                                        <label htmlFor="shipping" className="text-sm">Hoả tốc HCM đơn từ 399k</label>
                                    </div>
                                    <span className="ml-auto text-sm font-medium">{shippingFee}₫</span>
                                </div>
                            </div>
                        </>
                    )}

                    <div>
                        <h3 className="font-medium mb-4">Phương thức thanh toán</h3>
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2 rounded-lg border p-4">
                                <input type="radio" id="bank" name="payment" value="bank" defaultChecked className="rounded-full" />
                                <label htmlFor="bank" className="text-sm">Chuyển khoản qua ngân hàng</label>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-gray-100 rounded-lg space-y-2 text-sm">
                            <p className="font-medium">THÔNG TIN CHUYỂN KHOẢN:</p>
                            <p>Ngân hàng ABC Chi nhánh XYZ</p>
                            <p>SỐ TK: 0123456789</p>
                            <p>Chủ TK: NGUYEN VAN A</p>
                            <p>NỘI DUNG: Mã đơn hàng (sẽ có sau khi chọn thanh toán)</p>
                            <hr className="my-2 border-gray-300" />
                            <p className="text-gray-600">Sau khi chuyển khoản vui lòng lưu thông tin chuyển khoản</p>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="font-bold text-lg mb-4">Đơn hàng của bạn</h3>

                        <div className="space-y-4 mb-6">
                            {cart.map((item, index) => (
                                <div key={item.MaThuoc} className="flex gap-4">
                                    <div className="relative">
                                        <img
                                            src={`${import.meta.env.BASE_URL}src/assets/uploads/${item.MaThuoc}/${item.AnhDaiDien}`}
                                            alt={item.TenThuoc}
                                            className="w-20 h-20 object-cover rounded"
                                        />
                                        <span
                                            className="absolute -top-2 -left-2 w-6 h-6 bg-[#E6815A] rounded-full flex items-center justify-center text-white font-bold "
                                        >
                                            {item.SoLuong}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="font-medium text-xl mb-1">
                                            {item.TenThuoc}
                                        </h2>
                                        <p className="text-sm text-gray-500 mb-2">{item.DangBaoChe} - {item.QCDongGoi}</p>
                                    </div>
                                    <p className="font-semibold text-lg">{item.ThanhTien}₫</p>
                                </div>

                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Tạm tính</span>
                                <span>{subtotal.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Phí vận chuyển</span>
                                <span>{shippingFee === 0 ? "Miễn phí" : shippingFee.toLocaleString() + '₫'}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Tổng cộng</span>
                                <span>{(subtotal + shippingFee).toLocaleString()}₫</span>
                            </div>
                        </div>

                        <button className="w-full mt-2 bg-[#FF9A76] text-[#2C1A12] py-2 rounded transition-all 
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
        </div>
    )
}