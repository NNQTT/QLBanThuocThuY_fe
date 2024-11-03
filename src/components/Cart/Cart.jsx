'use client'

import { useState } from 'react'
import { MinusIcon, PlusIcon, XIcon } from 'lucide-react'
import LayoutUser from '../LayoutUser'
import { useParams } from 'react-router-dom'

export default function Cart() {

    const { cartId } = useParams()

    const [cart, setCart] = useState([
        {
            id: 1,
            name: '(Chai 55ml - 100ml) Xịt thơm dưỡng lông HYPONIC cấp ẩm và gỡ rối lông cho chó mèo',
            description: 'Chai 55ml',
            price: 94500,
            quantity: 1
        },
        {
            id: 2,
            name: '(Chai 55ml - 100ml) Xịt thơm dưỡng lông HYPONIC cấp ẩm và gỡ rối lông cho chó mèo',
            description: 'Chai 55ml',
            price: 94500,
            quantity: 1
        },
        {
            id: 3,
            name: '(Chai 55ml - 100ml) Xịt thơm dưỡng lông HYPONIC cấp ẩm và gỡ rối lông cho chó mèo',
            description: 'Chai 55ml',
            price: 94500,
            quantity: 1
        }
    ])

    const removeItem = (item) => {
        setCart(prev => prev.filter(i => i.id !== item.id))
    }

    const incrementQuantity = (item) => {
        const copyCart = [...cart]
        const index = copyCart.findIndex(i => i.id === item.id)
        copyCart[index].quantity++
        setCart(copyCart)
    };
    const decrementQuantity = (item) => {
        const copyCart = [...cart]
        const index = copyCart.findIndex(i => i.id === item.id)
        if (copyCart[index].quantity > 1) {
            copyCart[index].quantity--
        }
        setCart(copyCart)
    }

    return (
        <>
            <LayoutUser />
            <div className="mx-12 md:p-12 font-sans my-5">
                <h1 className="text-3xl font-semibold mb-4 md:px-12">Giỏ hàng của bạn</h1>
                <p className="mb-4 text-lg md:px-12">Bạn đang có {cart.length} sản phẩm trong giỏ hàng</p>

                <div className="grid md:grid-cols-6 gap-6 items-start md:px-12">
                    <div className='md:col-span-4'>
                        {
                            cart.map((item, index) => {
                                return (
                                    <div className="bg-white p-4 rounded-lg shadow mb-6" key={item.id}>
                                        <div className="flex gap-4">
                                            <div className="relative">
                                                <img
                                                    src="https://via.placeholder.com/100"
                                                    alt={item.name}
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
                                                    {item.id} - {item.name}
                                                </h2>
                                                <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                                <p className="font-semibold text-lg">{item.price * item.quantity}₫</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-end gap-2 mt-4">
                                            <button
                                                onClick={() => decrementQuantity(item)}
                                                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded"
                                            >
                                                <MinusIcon className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
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
                        <hr class="my-5 h-0.5 border-t-1 bg-neutral-100 dark:bg-white/10" />
                        <div className="flex justify-between mb-4">
                            <span className='text-xl font-bold'>Tổng tiền:</span>
                            <span className="font-bold text-red-600 text-2xl relative">{
                                cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
                            }<span className='text-lg absolute' style={{ top: -1 }}>₫</span></span>
                        </div>
                        <ul className="text-sm text-gray-600 space-y-2 mb-4">
                            <li>• Miễn phí vận chuyển cho đơn hàng từ 399.000₫ (Dưới 10km từ 140 Lê Trọng Tấn)</li>
                            <li>• Giao hàng hỏa tốc trong vòng 4 giờ, áp dụng tại khu vực nội thành Hồ Chí Minh</li>
                        </ul>
                        <hr class="my-5 h-0.5 border-t-1 bg-neutral-100 dark:bg-white/10" />
                        <button className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded">
                            THANH TOÁN
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}