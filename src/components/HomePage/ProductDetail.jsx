import React, { useState, useEffect } from 'react';
import { Carousel, Button, Card, Tabs, InputNumber, message, Typography } from 'antd';
import { LeftOutlined, RightOutlined, MinusOutlined, PlusOutlined, ShoppingCartOutlined, HeartOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const { TabPane } = Tabs;
const { Title, Text } = Typography;

export default function ProductDetail() {
    const { productId } = useParams();
    const [selectedFlavor, setSelectedFlavor] = useState('fish');
    const [selectedSize, setSelectedSize] = useState('150g');
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState([]);

    const flavors = [
        { id: 'chicken', name: 'Gà (XN)' },
        { id: 'tuna', name: 'Cá Ngừ (TN)' },
        { id: 'fish', name: 'Cá mồi (XL)' },
        { id: 'salmon', name: 'Cá Hồi (CN)' },
    ];

    const sizes = [
        { id: '150g', name: 'Lon 150g' },
        { id: '24pack', name: 'Thùng 24 lon' },
        { id: '48pack', name: 'Thùng 48 lon' },
        { id: '96pack', name: 'Thùng 96 lon' },
    ];

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

    return (
        <div style={{ backgroundColor: '#f9f5f2', minHeight: '100vh', padding: '2rem' }}>
            <div className="container mx-auto">
                <Card style={{ backgroundColor: '#fff', borderRadius: '1rem', overflow: 'hidden' }}>
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Product Images */}
                        <div className="space-y-4">
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
                                <span
                                    level={2}
                                    className="text-2xl font-bold font-serif tracking-wide text-[#4A3228]">
                                    {product.TenThuoc}
                                </span>
                                <br />
                                <Text type="secondary">Mã sản phẩm: {product.MaThuoc}</Text>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <Title level={2} style={{ color: '#ef2957', margin: 0 }} >{Number(product.GiaBan).toLocaleString()}₫</Title>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Text strong>Hương vị:</Text>
                                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 mt-2">
                                        {flavors.map((flavor) => (
                                            <Button
                                                key={flavor.id}
                                                type={selectedFlavor === flavor.id ? 'primary' : 'default'}
                                                onClick={() => setSelectedFlavor(flavor.id)}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: selectedFlavor === flavor.id ? '#fe995c' : '#fff',
                                                    borderColor: '#fe995c',
                                                    color: selectedFlavor === flavor.id ? '#fff' : '#fe995c',
                                                }}
                                            >
                                                {flavor.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Text strong>Kích thước:</Text>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {sizes.map((size) => (
                                            <Button
                                                key={size.id}
                                                type={selectedSize === size.id ? 'primary' : 'default'}
                                                onClick={() => setSelectedSize(size.id)}
                                                style={{
                                                    width: '100%',
                                                    backgroundColor: selectedSize === size.id ? '#fe995c' : '#fff',
                                                    borderColor: '#fe995c',
                                                    color: selectedSize === size.id ? '#fff' : '#fe995c',
                                                }}
                                            >
                                                {size.name}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

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
                                    <Button
                                        type="primary"
                                        icon={<ShoppingCartOutlined />}
                                        onClick={handleAddToCart}
                                        className='flex-grow text-white borderColor: #ef2957 bg-[#ef2957]'
                                    >
                                        Thêm vào giỏ
                                    </Button>
                                </div>
                            </div>

                            <Tabs
                                defaultActiveKey="description"
                                style={{ backgroundColor: '#eed6c4', borderRadius: '0.5rem', padding: '1rem' }}
                            >
                                <TabPane tab="Thông tin sản phẩm" key="description">
                                    <Card style={{ backgroundColor: '#fff', borderRadius: '0.5rem' }}>
                                        <Text>
                                            {product.CongDung}
                                        </Text>
                                    </Card>
                                </TabPane>
                                
                            </Tabs>
                        </div>
                    </div>
                </Card>

                {/* Related Products */}
                <div className="mt-12">
                    <Title level={3} style={{ color: '#ef2957', marginBottom: '1.5rem' }}>Sản phẩm liên quan</Title>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {[...Array(5)].map((_, i) => (
                            <Card
                                key={i}
                                hoverable
                                cover={
                                    <img
                                        alt={`Related product ${i + 1}`}
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

                {/* Recently Viewed */}
                <div className="mt-12">
                    <Title level={3} style={{ color: '#ef2957', marginBottom: '1.5rem' }}>Sản phẩm đã xem</Title>
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