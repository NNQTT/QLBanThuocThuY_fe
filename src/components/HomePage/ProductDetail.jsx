import React, { useState, useEffect } from 'react';
import { Carousel, Button, Card, Tabs, InputNumber, message, Typography } from 'antd';
import { LeftOutlined, RightOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { IoArrowBackCircleOutline, IoArrowForwardCircleOutline } from "react-icons/io5";

const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function ProductDetail() {
    const { productId } = useParams();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState([]);
    const [listProduct, setListProduct] = useState([]);
    const [visibleCount, setVisibleCount] = useState(5);

    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 5

    // Calculate total pages
    const totalPages = Math.ceil(listProduct.length / productsPerPage)

    // Get current products
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = listProduct.slice(indexOfFirstProduct, indexOfLastProduct)

    // Handle page navigation
    const handlePrevious = () => {
        setCurrentPage(prev => Math.max(prev - 1, 1))
    }

    const handleNext = () => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages))
    }

    const navigate = useNavigate();

    const handleAddToCart = () => {
        message.success('Thêm vào giỏ hàng thành công');
    };

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/product/getProductById/${productId}`);
                setProduct(response.data);
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
                console.log('MaLoai: ', maloai);
                console.log('MaNhomThuoc: ', manhomthuoc);
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

    const handleProductClick = (productId) => {
        navigate(`/productdetail/${productId}`);
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <div className="container mx-auto">
                {/* <Card style={{ backgroundColor: '#fff', borderRadius: '1rem', overflow: 'hidden' }}> */}
                <Card>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="space-y-6">
                            <Carousel
                                arrows
                                prevArrow={<LeftOutlined />}
                                nextArrow={<RightOutlined />}
                                style={{ backgroundColor: '#e8d5c4', borderRadius: '0.5rem' }}
                            >
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} style={{ padding: '1rem' }}>
                                        <img
                                            src="/placeholder.svg"
                                            alt={`Product image ${i + 1}`}
                                            style={{ objectFit: 'cover', borderRadius: '0.5rem', width: '100%', height: '400px' }}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                            <div className="flex gap-2 overflow-auto pb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Button key={i} type="text" className="p-0 relative aspect-square h-20 w-20 rounded-lg p-0">
                                        <img
                                            src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/444480596_2193080121030163_8138483540224069350_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a5f93a&_nc_ohc=B4UegfO4WNcQ7kNvgEV-c6i&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=ACIA3QfhW0HD2zgHgQ6r6qO&oh=00_AYDeSmmFOHhdQXaCz7e6XSe0DeWlRrmTSa6t-rOzeJOFnA&oe=672D9EE3"
                                            alt={`Thumbnail ${i + 1}`}
                                            className="object-cover rounded-lg w-full h-full"
                                        />
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-6">
                            <div className="text-2xl font-bold font-serif tracking-wide text-[#4A3228]">
                                <span level={2}>
                                    {product.TenThuoc}
                                </span>
                                <br />
                                <div className='flex items-center gap-4'>
                                    <Text type="secondary">Mã sản phẩm: {product.MaThuoc}</Text>

                                    <Text type="secondary">Tình trạng: {product.TrangThai}</Text>
                                </div>
                            </div>

                            <div className="text-2xl font-bold text-[#ef2957]" >
                                <span level={2}>
                                    {Number(product.GiaBan).toLocaleString()}₫
                                </span>
                            </div>

                            <div className="space-y-4">

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center" style={{ backgroundColor: '#eed6c4', borderRadius: '0.5rem', padding: '0.25rem' }}>
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
                                            style={{ backgroundColor: 'transparent', borderColor: 'transparent', width: '50px' }}
                                        />
                                        <Button
                                            type="text"
                                            icon={<PlusOutlined />}
                                            onClick={() => setQuantity(quantity + 1)}
                                            style={{ color: '#ef2957' }}
                                        />
                                    </div>
                                    <button
                                        icon={<ShoppingCartOutlined />}
                                        // onClick={handleAddToCart}
                                        className='flex-grow text-white rounded-md h-10  bg-orange-500 hover:bg-orange-600'
                                    >
                                        Thêm vào giỏ
                                    </button>
                                </div>
                            </div>

                            <Tabs
                                defaultActiveKey="description"
                                className='bg-[#eed6c4] px-4 py-8 rounded-lg'
                            >
                                <TabPane tab="Thông tin sản phẩm" key="description">
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
                <div className="mt-12 ">
                    <div
                        level={3}
                        className="text-2xl font-bold font-serif tracking-wide text-[#ef2957] mb-8">
                        <span>Sản phẩm liên quan</span>
                    </div>
                    {/* <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {listProduct.length > 0 && listProduct.map((product) => (
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
                    </div> */}

                    <Carousel
                        arrows
                        slidesPerRow={4}
                        infinite={false}
                        dots={false}
                        rows={1}
                        // autoplay={true}
                        className='flex justify-center items-center overflow-hidden'
                        prevArrow={
                            <div className='flex justify-center bg-[#ef2957] w-50 h-50'>
                                <IoArrowBackCircleOutline size={30} className='text-[#ef2957]' />
                            </div>
                        }
                        nextArrow={
                            <div className='flex bg-[#ef2957] w-50 h-50'>
                                <IoArrowForwardCircleOutline size={25} className='text-[#ef2957]' />
                            </div>
                        }

                    >
                        {listProduct.length > 0 && listProduct.map((product) => (
                            <div key={product.MaThuoc} className="max-w-[23%] border mx-2 rounded-lg overflow-hidden group flex flex-col" onClick={() => handleProductClick(product.MaThuoc)}>
                                <div className="">
                                    <img
                                        src={product.AnhDaiDien}
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
                    </Carousel>

                </div>

                {/* Recently Viewed */}
                <div className="mt-12">
                    <div
                        level={3}
                        className="text-2xl font-bold font-serif tracking-wide text-[#ef2957] mb-8">
                        <span>Sản phẩm đã xem</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {[...Array(5)].map((_, i) => (
                            <Card
                                key={i}
                                hoverable
                                cover={
                                    <img
                                        alt={`Recently viewed product ${i + 1}`}
                                        src="/placeholder.svg"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                }
                                style={{ backgroundColor: '#fff', borderRadius: '0.5rem', overflow: 'hidden' }}
                            >
                                <Card.Meta
                                    title={<Text strong>KitCat Complete Cuisine Pate</Text>}
                                    description={<Text type="danger">21,000₫</Text>}
                                />
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}