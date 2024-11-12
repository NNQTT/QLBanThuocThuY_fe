import { useEffect, useState } from "react"
import axios from "axios"
import { message } from "antd"

export default function Checkout() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhone] = useState("")
    const [address, setAddress] = useState("")

    const [provinces, setProvinces] = useState([])
    const [selectedCity, setSelectedCity] = useState("")
    const [districts, setDistricts] = useState([])
    const [selectedDistrict, setSelectedDistrict] = useState("")
    const [wards, setWards] = useState([])
    const [selectedWard, setSelectedWard] = useState("")
    const [cart, setCart] = useState([])

    const [errors, setErrors] = useState({})
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const [orderid, setOrderid] = useState("")

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

    const validateForm = () => {
        const newErrors = {}
        if (!name.trim()) newErrors.name = 'Họ và tên là bắt buộc'
        if (!email.trim()) newErrors.email = 'Email là bắt buộc'
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email không hợp lệ'
        if (!phone.trim()) newErrors.phone = 'Số điện thoại là bắt buộc'
        else if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = 'Số điện thoại không hợp lệ'
        if (!address.trim()) newErrors.address = 'Địa chỉ là bắt buộc'
        if (!selectedCity) newErrors.city = 'Vui lòng chọn tỉnh/thành'
        if (!selectedDistrict) newErrors.district = 'Vui lòng chọn quận/huyện'
        if (!selectedWard) newErrors.ward = 'Vui lòng chọn phường/xã'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            setShowConfirmation(true)
        }
    }

    const handleConfirm = () => {
        setShowConfirmation(false)
        // Simulate form submission
        const order = async () => {
            try {
                const ward = wards.find(ward => ward.code == selectedWard)
                const district = districts.find(district => district.code == selectedDistrict)
                const city = provinces.find(province => province.code == selectedCity)
                console.log(ward, district, city)
                const res = await axios.post("http://localhost:3000/cart/checkout", {
                    name: name,
                    phone: phone,
                    address: address + ', ' + ward.name + ', ' + district.name + ', ' + city.name,
                    email: email,
                    total: subtotal + shippingFee,
                    cartid: cart[0].MaGioHang || '',
                })
                console.log(res)
                setShowSuccess(true)
                setOrderid(res.data.mahd)
                sessionStorage.removeItem('cart')
            } catch (error) {
                console.log(error)
                message.error("Đã có lỗi xảy ra. Vui lòng thử lại sau")
            }
        }
        order()
    }

    const onCloseSuccess = () => {
        setShowSuccess(false)
        window.location.href = "/"
    }

    const onChangePhone = (e) => {
        const value = e.target.value.replace(/\D/g, '')
        setPhone(value)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid gap-8 lg:grid-cols-2">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Thông tin giao hàng</h2>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                                <input type="text" id="name" name="name" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Nhập họ và tên" onChange={(e) => setName(e.target.value)} />
                                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input type="email" id="email" name="email" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="example@email.com" onChange={(e) => setEmail(e.target.value)} />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                                    <input type="tel" id="phone" name="phone" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="0xxx xxx xxx" value={phone} onChange={onChangePhone} />
                                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                                <input type="text" id="address" name="address" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary" placeholder="Số nhà, tên đường" onChange={(e) => setAddress(e.target.value)} />
                                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
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
                                    {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
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
                                    {errors.district && <p className="mt-1 text-xs text-red-500">{errors.district}</p>}
                                </div>

                                <div>
                                    <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
                                    <select id="district" name="district" onChange={(e) => setSelectedWard(e.target.value)} disabled={!selectedDistrict} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary">
                                        <option value="">Chọn Phường/Xã</option>
                                        {
                                            wards?.map(ward => (
                                                <option key={ward.code} value={ward.code}>{ward.name}</option>
                                            ))
                                        }
                                    </select>
                                    {errors.ward && <p className="mt-1 text-xs text-red-500">{errors.ward}</p>}
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

                        <button
                            onClick={handleSubmit}
                            className="
                                w-full mt-2 
                                bg-[#FF9A76] 
                                text-[#2C1A12] 
                                py-2 
                                rounded 
                                transition-all 
                                duration-300 
                                ease-in-out
                                hover:opacity-90 
                                hover:scale-105 
                                transform
                                focus:outline-none 
                                focus:ring-2 
                                focus:ring-[#FF9A76] 
                                focus:ring-opacity-50
                            "
                            disabled={!subtotal}
                        >
                            THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Popup */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4">Xác nhận đơn hàng</h2>
                        <p>Bạn có chắc chắn muốn đặt hàng?</p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-[#FF9A76] text-[#2C1A12] rounded-md hover:opacity-90"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-sm w-full">
                        <h2 className="text-xl font-bold mb-4 text-green-600">Đặt hàng thành công!</h2>
                        <p>Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn trong thời gian sớm nhất.</p>
                        <p>Mã đơn hàng của bạn là: <span className="font-semibold">{orderid}</span></p>
                        <button
                            onClick={onCloseSuccess}
                            className="mt-6 w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}