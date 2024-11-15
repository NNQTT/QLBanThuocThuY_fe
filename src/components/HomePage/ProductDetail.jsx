'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Carousel, Button, Card, Tabs, InputNumber, message, Typography } from 'antd'
import { LeftOutlined, RightOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

import './css/flex_important.css'

const { TabPane } = Tabs
const { Text } = Typography

export default function ProductDetail() {
    const { productId } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [product, setProduct] = useState({})
    const [listProduct, setListProduct] = useState([])
    const [listProductRecently, setListProductRecently] = useState([])
    const [listAlbumProduct, setListAlbumProduct] = useState([])

    const carouselRef = useRef(null)
    const carouselRef1 = useRef(null)
    const carouselRef2 = useRef(null)

    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const [showLeftArrow1, setShowLeftArrow1] = useState(false)
    const [showRightArrow1, setShowRightArrow1] = useState(true)
    const [showLeftArrow2, setShowLeftArrow2] = useState(false)
    const [showRightArrow2, setShowRightArrow2] = useState(true)

    const navigate = useNavigate()

    const handleAddToCart = () => {
        const addToCart = async () => {
            const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))
            console.log('userInfo:', userInfo)
            if (userInfo) {
                const res = await axios.post(`http://localhost:3000/cart/${userInfo.tentaikhoan}/${productId}`, {
                    uid: userInfo.tentaikhoan,
                    productId: product.MaThuoc,
                    quantity: quantity,
                })
                console.log('res:', res.data)
                if (!res.data.success) {
                    message.error('Thêm vào giỏ hàng thất bại')
                    return
                }
            }

            else {
                let cart = sessionStorage.getItem('cart')
                if (cart) {
                    cart = JSON.parse(cart)
                }
                else {
                    cart = []
                }
                if (cart.find(item => item.MaThuoc === product.MaThuoc)) {
                    cart.find(item => item.MaThuoc === product.MaThuoc).SoLuong += quantity
                    cart.find(item => item.MaThuoc === product.MaThuoc).ThanhTien = cart.find(item => item.MaThuoc === product.MaThuoc).SoLuong * product.GiaBan
                }
                else {
                    cart.push({
                        MaThuoc: product.MaThuoc,
                        SoLuong: quantity,
                        ThanhTien: product.GiaBan * quantity,
                        TenThuoc: product.TenThuoc,
                        DangBaoChe: product.DangBaoChe,
                        QCDongGoi: product.QCDongGoi,
                        GiaBan: product.GiaBan,
                        AnhDaiDien: product.AnhDaiDien,
                    })
                }

                sessionStorage.setItem('cart', JSON.stringify(cart))
            }
            message.success('Thêm vào giỏ hàng thành công')
        }

        addToCart()
    }

    const handleCarouselChange = (current, carouselRef, setShowLeft, setShowRight) => {
        setShowLeft(current > 0)
        setShowRight(current < carouselRef.current.innerSlider.state.slideCount - 4)
    }

    const handlePrev = (carouselRef, setShowLeft, setShowRight) => {
        carouselRef.current?.prev()
        setTimeout(() => {
            const current = carouselRef.current.innerSlider.state.currentSlide
            handleCarouselChange(current, carouselRef, setShowLeft, setShowRight)
        }, 300)
    }

    const handleNext = (carouselRef, setShowLeft, setShowRight) => {
        carouselRef.current?.next()
        setTimeout(() => {
            const current = carouselRef.current.innerSlider.state.currentSlide
            handleCarouselChange(current, carouselRef, setShowLeft, setShowRight)
        }, 300)
    }

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/product/getProductById/${productId}`)
                setProduct(response.data)
                const listProduct = JSON.parse(localStorage.getItem('product') || '[]')
                if (!listProduct.includes(response.data.MaThuoc)) {
                    listProduct.push(response.data.MaThuoc)
                    localStorage.setItem('product', JSON.stringify(listProduct))
                }
            } catch (error) {
                console.error('Error fetching product detail:', error)
            }
        }

        fetchProductDetail()
    }, [productId])

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const maloai = product.MaLoai
                const manhomthuoc = product.MaNhomThuoc
                const payload = {
                    maloai: maloai,
                    manhomthuoc: manhomthuoc
                }
                const response = await axios.get(`http://localhost:3000/product/getproductrelated`, { params: payload })
                setListProduct(response.data.data)
            } catch (error) {
                console.error('Error fetching related products:', error)
            }
        }
        if (product.MaLoai && product.MaNhomThuoc) {
            fetchRelatedProducts()
        }
    }, [product])

    useEffect(() => {
        const fetchRecentlyViewedProducts = async () => {
            try {
                const listProduct = JSON.parse(localStorage.getItem('product') || '[]')
                const response = await axios.get(`http://localhost:3000/product/getproductbylocalstorage`, { params: { listproduct: JSON.stringify(listProduct) } })
                setListProductRecently(response.data.data)
            } catch (error) {
                console.error('Error fetching recently viewed products:', error)
            }
        }

        fetchRecentlyViewedProducts()
    }, [productId])

    useEffect(() => {
        const fetchAlbumProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/product/getalbumproduct', { params: { mathuoc: productId } })
                setListAlbumProduct(response.data.data)
            } catch (error) {
                console.error('Error fetching album products:', error)
            }
        }

        fetchAlbumProducts()
    }, [productId])

    const handleProductClick = (productId) => {
        navigate(`/productdetail/${productId}`)
    }

    return (
        <div className='container mx-auto px-4 py-8'>
            <Card className="shadow-lg rounded-lg overflow-hidden">
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Product Images */}
                    <div className="h-[600px] lg:w-[650px] flex justify-center items-center">
                        <div className='relative w-full max-w-[500px] items-center justify-center'>
                            <Carousel
                                ref={carouselRef2}
                                autoplay={true}
                                slidesToScroll={1}
                                className='rounded-lg'
                                beforeChange={(_, next) => handleCarouselChange(next, carouselRef2, setShowLeftArrow2, setShowRightArrow2)}
                            >
                                {listAlbumProduct.map((item, i) => (
                                    <div key={i} className="flex justify-center items-center h-[500px] flex-important">
                                        <img
                                            key={i}
                                            src={`${import.meta.env.BASE_URL}src/assets/uploads/${item.MaThuoc}/${item.TenHinhAnh}`}
                                            alt={item.TenHinhAnh}
                                            className="max-w-full max-h-full object-contain rounded-lg"
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            {showLeftArrow2 && (
                                <Button
                                    icon={<LeftOutlined />}
                                    onClick={() => handlePrev(carouselRef2, setShowLeftArrow2, setShowRightArrow2)}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                                    shape="circle"
                                />
                            )}
                            {showRightArrow2 && (
                                <Button
                                    icon={<RightOutlined />}
                                    onClick={() => handleNext(carouselRef2, setShowLeftArrow2, setShowRightArrow2)}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                                    shape="circle"
                                />
                            )}
                            <div
                                onClick={() => carouselRef2.current.prev()}
                                className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer hover:opacity-70"
                            >
                                <LeftOutlined style={{ color: '#fff', fontSize: '20px' }} />
                            </div>
                            <div
                                onClick={() => carouselRef2.current.next()}
                                className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer hover:opacity-70"
                            >
                                <RightOutlined style={{ color: '#fff', fontSize: '20px' }} />
                            </div>

                            <div className="mt-4 mx-auto h-[100px]">
                                <Carousel
                                    slidesPerRow={4}
                                    slidesToScroll={1}
                                    infinite={false}
                                    dots={false}
                                    rows={1}
                                    arrows
                                    className="flex gap-2 ">
                                    {/* pb-2 h-[100px] w-[500px] mt-2  */}
                                    {listAlbumProduct.map((item, i) => (
                                        <div key={i} className="px-1">
                                            <img
                                                src={`${import.meta.env.BASE_URL}src/assets/uploads/${item.MaThuoc}/${item.TenHinhAnh}`}
                                                alt={item.TenHinhAnh}
                                                className="h-24 w-24 object-cover rounded-lg cursor-pointer hover:opacity-70"
                                                onClick={() => carouselRef2.current.goTo(i)}
                                                key={i}
                                            />
                                        </div>
                                    ))}
                                </Carousel>
                            </div>
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.TenThuoc}</h1>
                            <div className='flex items-center gap-4 text-sm text-gray-500'>
                                <span>Mã sản phẩm: {product.MaThuoc}</span>
                                <span>Tình trạng: {product.TrangThai}</span>
                            </div>
                        </div>

                        <div className="text-3xl font-bold text-red-600">
                            {Number(product.GiaBan).toLocaleString()}₫
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-gray-700">Chọn số lượng:</span>
                            <div className="flex items-center border rounded">
                                <Button
                                    icon={<MinusOutlined />}
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="text-gray-600 hover:text-red-600"
                                />
                                <InputNumber
                                    min={1}
                                    value={quantity}
                                    onChange={(value) => setQuantity(value)}
                                    className="w-16 text-center border-none"
                                />
                                <Button
                                    icon={<PlusOutlined />}
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="text-gray-600 hover:text-red-600"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {product.TrangThai === "Còn hàng" ? (
                                <>
                                    <Button
                                        onClick={handleAddToCart}
                                        icon={<ShoppingCartOutlined />}
                                        className="flex-1 h-12 bg-orange-500 hover:bg-orange-600 text-white border-none"
                                    >
                                        THÊM VÀO GIỎ
                                    </Button>
                                    <Button className="flex-1 h-12 bg-red-600 hover:bg-red-700 text-white border-none">
                                        MUA NGAY
                                    </Button>
                                </>
                            ) : (
                                <Button disabled className="flex-1 h-12 bg-gray-200 text-gray-500 cursor-not-allowed">
                                    TẠM HẾT HÀNG
                                </Button>
                            )}
                        </div>

                        <Tabs defaultActiveKey="description" className='mt-8'>
                            <TabPane tab="Thông tin sản phẩm" key="description">
                                <Card className='rounded-lg shadow-sm'>
                                    <div className="space-y-2 text-gray-700">
                                        <p><strong>Quy cách đóng gói:</strong> {product.QCDongGoi}</p>
                                        <p><strong>Dạng bào chế:</strong> {product.DangBaoChe}</p>
                                        <p><strong>Công dụng:</strong></p>
                                        <p className="pl-4">- {product.CongDung}</p>
                                    </div>
                                </Card>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Card>

            {/* Related Products */}
            <div className="mt-10">
                <div
                    level={3}
                    className="text-2xl font-bold font-serif tracking-wide text-[#ef2957] mb-8">
                    <span>Sản phẩm liên quan</span>
                </div>

                <div className="relative">

                    <Carousel
                        // arrows
                        slidesPerRow={4}
                        infinite={false}
                        dots={false}
                        rows={1}
                        ref={carouselRef}
                        // autoplay={true}
                        className='flex justify-center items-center overflow-hidden'
                    >
                        {listProduct.length > 0 && listProduct
                            .filter(product => product.MaThuoc !== productId)
                            .map((product) => (
                                <div key={product.MaThuoc} className="max-w-[23%] border mx-3 rounded-lg overflow-hidden group flex flex-col" onClick={() => handleProductClick(product.MaThuoc)}>
                                    <div className="">
                                        <img
                                            src={`${import.meta.env.BASE_URL}src/assets/uploads/${product.MaThuoc}/${product.AnhDaiDien}`}
                                            alt={product.TenThuoc}
                                            className="w-full h-64 object-cover"
                                        />
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
                                            <button
                                                // onClick={handleAddToCart}
                                                className='flex-grow mt-4 text-white text-md rounded-md h-10 bg-orange-500 hover:bg-orange-600'
                                            >
                                                <ShoppingCartOutlined className='mr-1' />
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
                    </Carousel>
                    {showLeftArrow && (
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => handlePrev(carouselRef, setShowLeftArrow, setShowRightArrow)}
                            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10"
                            shape="circle"
                        />
                    )}
                    {showRightArrow && (
                        <Button
                            icon={<RightOutlined />}
                            onClick={() => handleNext(carouselRef, setShowLeftArrow, setShowRightArrow)}
                            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10"
                            shape="circle"
                        />
                    )}
                </div>
            </div>

            {/* Recently Viewed */}
            <div className="mt-12">
                <div
                    level={3}
                    className="text-2xl font-bold font-serif tracking-wide text-[#ef2957] mb-8">
                    <span>Sản phẩm đã xem</span>
                </div>
                <div className="relative">

                    <Carousel
                        // arrows
                        slidesPerRow={4}
                        infinite={false}
                        dots={false}
                        rows={1}
                        ref={carouselRef1}
                        // autoplay={true}
                        className='flex justify-center items-center overflow-hidden'
                    >
                        {listProductRecently.length > 0 && listProductRecently
                            .filter(product => product.MaThuoc !== productId)
                            .map((product) => (
                                <div key={product.MaThuoc} className="max-w-[23%] border mx-3 rounded-lg overflow-hidden group flex flex-col" onClick={() => handleProductClick(product.MaThuoc)}>
                                    <div className="">
                                        <img
                                            src={`${import.meta.env.BASE_URL}src/assets/uploads/${product.MaThuoc}/${product.AnhDaiDien}`}
                                            alt={product.TenThuoc}
                                            className="w-full h-64 object-cover"
                                        />
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
                                            <button
                                                // onClick={handleAddToCart}
                                                className='flex-grow mt-4 text-white text-md rounded-md h-10 bg-orange-500 hover:bg-orange-600'
                                            >
                                                <ShoppingCartOutlined className='mr-1' />
                                                CHỌN MUA
                                            </button>
                                        ) : (
                                            <button className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
                                                TẠM HẾT HÀNG
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        }
                    </Carousel>
                    {showLeftArrow1 && listProductRecently.length > 4 && (
                        <Button
                            icon={<LeftOutlined />}
                            onClick={() => handlePrev(carouselRef1, setShowLeftArrow1, setShowRightArrow1)}
                            className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10"
                            shape="circle"
                        />
                    )}
                    {showRightArrow1 && listProductRecently.length > 4 && (
                        <Button
                            icon={<RightOutlined />}
                            onClick={() => handleNext(carouselRef1, setShowLeftArrow1, setShowRightArrow1)}
                            className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md z-10"
                            shape="circle"
                        />
                    )}
                </div>
            </div>
        </div>
    )
}