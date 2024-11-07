import React, { useState, useEffect, useRef } from 'react';
import { Carousel, Button, Card, Tabs, InputNumber, message, Typography } from 'antd';
import { LeftOutlined, RightOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function ProductDetail() {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [listProductRecently, setListProductRecently] = useState([]);
    const [listAlbumProduct, setListAlbumProduct] = useState([]);

    const carouselRef = useRef(null);
    const carouselRef1 = useRef(null);
    const carouselRef2 = useRef(null);

    // Handlers to move to next/previous slides
    const handlePrev = () => carouselRef.current?.prev();
    const handleNext = () => carouselRef.current?.next();

    // Handlers to move to next/previous slides
    const handlePrev1 = () => carouselRef1.current?.prev();
    const handleNext1 = () => carouselRef1.current?.next();

    const handlePrev2 = () => carouselRef2.current?.prev();
    const handleNext2 = () => carouselRef2.current?.next();

    const navigate = useNavigate();

    const handleAddToCart = () => {
        message.success('Thêm vào giỏ hàng thành công');
    };

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/product/getProductById/${productId}`);
                setProduct(response.data);
                const listProduct = JSON.parse(localStorage.getItem('product')) || [];
                if (!listProduct.includes(response.data.MaThuoc)) {
                    listProduct.push(response.data.MaThuoc);
                    localStorage.setItem('product', JSON.stringify(listProduct));
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
            }
        };

        fetchProductDetail();
    }, [productId]);

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const maloai = product.MaLoai;
                const manhomthuoc = product.MaNhomThuoc;
                const payload = {
                    maloai: maloai,
                    manhomthuoc: manhomthuoc
                }
                const response = await axios.get(`http://localhost:3000/product/getproductrelated`, { params: payload });
                setListProduct(response.data.data);
            } catch (error) {
                console.error('Error fetching related products:', error);
            }
        };
        if (product) {
            fetchRelatedProducts();
        }
    }, [product]);

    useEffect(() => {
        const fetchRecentlyViewedProducts = async () => {
            try {
                const listProduct = JSON.parse(localStorage.getItem('product')) || [];
                const response = await axios.get(`http://localhost:3000/product/getproductbylocalstorage`, { params: { listproduct: JSON.stringify(listProduct) } });
                setListProductRecently(response.data.data);
            } catch (error) {
                console.error('Error fetching recently viewed products:', error);
            }
        }

        fetchRecentlyViewedProducts();

    }, [productId]);

    useEffect(() => {
        const fetchAlbumProducts = async () => {
            try {
                const response = await axios.get('http://localhost:3000/product/getalbumproduct', { params: { mathuoc: productId } });
                setListAlbumProduct(response.data.data);
                console.log(response.data.data);
                const h = response.data.data[0];
                console.log(h);
                const test = `${import.meta.env.BASE_URL}src/assets/uploads/${h.MaThuoc}/${h.TenHinhAnh}`;
                console.log(test);
            } catch (error) {
                console.error('Error fetching album products:', error);
            }
        }

        fetchAlbumProducts();
    }, [productId]);

    const handleProductClick = (productId) => {
        navigate(`/productdetail/${productId}`);
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className="container mx-auto">
                <Card>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="h-[600px] w-[500px]">
                            <div className='relative'>
                                <Carousel
                                    ref={carouselRef2}
                                    autoplay={true}
                                    style={{ backgroundColor: '#ffffff', borderRadius: '0.5rem' }}
                                    className='rounded-lg h-[500px]'
                                >
                                    {listAlbumProduct.map((item, i) => (
                                        <img
                                            src={`${import.meta.env.BASE_URL}src/assets/uploads/${item.MaThuoc}/${item.TenHinhAnh}`}
                                            alt={item.TenHinhAnh}
                                            className="max-w-[500px] max-h-[500px] rounded-lg"
                                        />
                                    ))}
                                </Carousel>
                                <div
                                    onClick={handlePrev2}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer hover:opacity-70"
                                >
                                    <LeftOutlined style={{ color: '#fff', fontSize: '20px' }} />
                                </div>
                                <div
                                    onClick={handleNext2}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer hover:opacity-70"
                                >
                                    <RightOutlined style={{ color: '#fff', fontSize: '20px' }} />
                                </div>
                            </div>
                            <Carousel
                                slidesPerRow={4}
                                infinite={false}
                                dots={false}
                                rows={1}
                                arrows
                                className="flex gap-4 pb-2 h-[100px] w-[500px] mt-2 border">
                                {listAlbumProduct.map((item, i) => (
                                    <img
                                        src={`${import.meta.env.BASE_URL}src/assets/uploads/${item.MaThuoc}/${item.TenHinhAnh}`}
                                        alt={item.TenHinhAnh}
                                        className="max-w-[100px] rounded-lg cursor-pointer hover:opacity-70"
                                        onClick={() => carouselRef2.current.goTo(i)}
                                        key={i}
                                    />
                                ))}
                            </Carousel>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div className="text-3xl font-bold tracking-wide text-[#4A3228]">
                                <span level={2}>
                                    {product.TenThuoc}
                                </span>
                                <br />
                                <div className='flex items-center gap-4'>
                                    <Text type="secondary">Mã sản phẩm: {product.MaThuoc}</Text>

                                    <Text type="secondary">Tình trạng: {product.TrangThai}</Text>
                                </div>
                            </div>

                            <div className="text-3xl font-bold text-[#ef2957]" >
                                <span level={2}>
                                    {Number(product.GiaBan).toLocaleString()}₫
                                </span>
                            </div>
                            <div className="space-y-4 flex items-center gap-4">
                                <Text className='mt-4'>Chọn số lượng:</Text>
                                <div className="flex items-center bg-[#e8d5c4] rounded" >
                                    <Button
                                        type="text"
                                        icon={<MinusOutlined />}
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        style={{ color: '#ef2957' }}
                                    />
                                    <InputNumber
                                        min={1}
                                        value={quantity}
                                        onChange={setQuantity}
                                        style={{ backgroundColor: 'transparent', borderColor: 'transparent', width: '40px' }}
                                    />
                                    <Button
                                        type="text"
                                        icon={<PlusOutlined />}
                                        onClick={() => setQuantity(quantity + 1)}
                                        style={{ color: '#ef2957' }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">

                                <div className="flex items-center gap-4">
                                    {product.TrangThai === "Còn hàng" ? (
                                        <>
                                            <button
                                                // onClick={handleAddToCart}
                                                className='flex-grow text-white text-md rounded-md h-10 bg-orange-500 hover:bg-orange-600'
                                            >
                                                {<ShoppingCartOutlined className='mr-1' />}
                                                THÊM VÀO GIỎ
                                            </button>
                                            <button
                                                // onClick={handleAddToCart}
                                                className='flex-grow text-white text-md rounded-md h-10  bg-[#ef2957] hover:bg-[#ef2940]'
                                            >
                                                MUA NGAY
                                            </button>
                                        </>
                                    ) : (
                                        <button className="flex-grow text-md rounded-md h-10 bg-gray-200 text-gray-500 rounded cursor-not-allowed">
                                            TẠM HẾT HÀNG
                                        </button>
                                    )}
                                </div>
                            </div>

                            <Tabs
                                defaultActiveKey="description"
                                className='px-4 py-8 rounded-lg'
                            >
                                <TabPane tab="Thông tin sản phẩm" key="description" className='text-[#ef2957]'>
                                    <Card className='rounded-lg'>
                                        <Text>
                                            Quy cách đóng gói: {product.QCDongGoi}
                                        </Text>
                                        <br />
                                        <Text>
                                            Dạng bào chế: {product.DangBaoChe}
                                        </Text>
                                        <br />
                                        <Text>
                                            Công dụng:
                                        </Text>
                                        <br />
                                        <Text
                                            className="pl-4"
                                        >
                                            - {product.CongDung}
                                        </Text>
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
                        <div
                            onClick={handlePrev}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer"
                        >
                            <LeftOutlined style={{ color: '#fff', fontSize: '20px' }} />
                        </div>
                        <div
                            onClick={handleNext}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer"
                        >
                            <RightOutlined style={{ color: '#fff', fontSize: '20px' }} />
                        </div>
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
                        {listProductRecently.length > 4 ? (
                            <>

                                <div
                                    onClick={handlePrev1}
                                    className="absolute top-1/2 left-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer"
                                >
                                    <LeftOutlined style={{ color: '#fff', fontSize: '20px' }} />
                                </div>
                                <div
                                    onClick={handleNext1}
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 flex items-center justify-center bg-orange-500 hover:bg-orange-600 w-10 h-10 rounded-full cursor-pointer"
                                >
                                    <RightOutlined style={{ color: '#fff', fontSize: '20px' }} />
                                </div>
                            </>
                        ) : (<></>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}